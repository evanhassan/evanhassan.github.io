Option Explicit

'Assign the Sources & Uses refresh button to this procedure.
'This version INSERTS rows as needed for:
'  1) Target debt repaid / refinanced
'  2) Acquirer debt repaid / refinanced
'  3) New debt issued

Public Sub RefreshSourcesUses()

    Dim wsAssump As Worksheet
    Dim wsSU As Worksheet
    Dim targetName As String
    Dim acquirerName As String

    On Error GoTo CleanFail
    Application.ScreenUpdating = False
    Application.EnableEvents = False

    Set wsAssump = FindSheetWithLabels(Array( _
        "Target Company Name", _
        "Acquirer Company Name", _
        "Transaction Date (or expected):", _
        "Debt Financing Switch (0/1)"))

    Set wsSU = FindSheetWithLabels(Array( _
        "Uses of Funds", _
        "Sources of Funds", _
        "Target Debt Repaid / Refinanced at Close", _
        "Acquirer Debt Repaid / Refinanced at Close", _
        "New Debt Issued"))

    If wsAssump Is Nothing Then
        Err.Raise vbObjectError + 1, , _
            "Could not find the Transaction Assumptions sheet."
    End If

    If wsSU Is Nothing Then
        Err.Raise vbObjectError + 2, , _
            "Could not find the Sources & Uses sheet."
    End If

    targetName = CStr(FindExact(wsAssump, "Target Company Name").Offset(0, 1).Value)
    acquirerName = CStr(FindExact(wsAssump, "Acquirer Company Name").Offset(0, 1).Value)

    RefreshExistingDebtBlock wsAssump, wsSU, targetName, _
        "Target Debt Repaid / Refinanced at Close", _
        "Acquirer Debt Repaid / Refinanced at Close"

    RefreshExistingDebtBlock wsAssump, wsSU, acquirerName, _
        "Acquirer Debt Repaid / Refinanced at Close", _
        "Transaction Fees"

    RefreshNewDebtBlock wsAssump, wsSU

    Application.CalculateFull

CleanExit:
    Application.EnableEvents = True
    Application.ScreenUpdating = True
    Exit Sub

CleanFail:
    MsgBox Err.Description, vbExclamation, "Refresh Sources & Uses"
    Resume CleanExit

End Sub


Private Sub RefreshExistingDebtBlock( _
    ByVal wsAssump As Worksheet, _
    ByVal wsSU As Worksheet, _
    ByVal companyName As String, _
    ByVal parentLabel As String, _
    ByVal nextLabel As String)

    Dim wsDebt As Worksheet
    Dim debtTable As ListObject
    Dim parentCell As Range
    Dim nextCell As Range
    Dim dateCell As Range
    Dim switchCell As Range

    Dim instrumentCol As Long
    Dim toggleCol As Long
    Dim targetYear As Long
    Dim yearCol As Long

    Dim oldDetailRows As Long
    Dim neededRows As Long
    Dim outputRow As Long
    Dim i As Long
    Dim activeRows As Long
    Dim instrumentName As String
    Dim endingBalanceCell As Range

    Set wsDebt = FindDebtScheduleByCompany(companyName)

    If wsDebt Is Nothing Then
        Err.Raise vbObjectError + 10, , _
            "Could not find a debt schedule for " & companyName & "."
    End If

    Set debtTable = FindRefinancingTable(wsDebt)

    If debtTable Is Nothing Then
        Err.Raise vbObjectError + 11, , _
            "Could not find a debt table with 'Debt Instrument' and " & _
            "'Refinance At Close?' on " & wsDebt.Name & "."
    End If

    Set parentCell = FindExact(wsSU, parentLabel)
    Set nextCell = FindExact(wsSU, nextLabel)
    Set dateCell = FindExact(wsAssump, "Transaction Date (or expected):").Offset(0, 1)
    Set switchCell = FindExact(wsAssump, "Debt Financing Switch (0/1)").Offset(0, 1)

    If Not IsDate(dateCell.Value) Then
        Err.Raise vbObjectError + 12, , _
            "Transaction date is not a valid Excel date."
    End If

    targetYear = Year(dateCell.Value)
    yearCol = FindForecastYearColumn(wsDebt, targetYear)

    If yearCol = 0 Then
        Err.Raise vbObjectError + 13, , _
            "Could not find " & targetYear & " on " & wsDebt.Name & "."
    End If

    instrumentCol = GetTableColumnIndex(debtTable, "Debt Instrument")
    toggleCol = GetTableColumnIndexFlexible(debtTable, Array( _
        "Refinance At Close?", _
        "Refinance at Close?", _
        "Refinance At Close? (0/1)", _
        "Refinance at Close? (0/1)", _
        "Refinance / Repay at Close? (0/1)"))

    oldDetailRows = nextCell.Row - parentCell.Row - 1
    If oldDetailRows > 0 Then
        wsSU.Rows((parentCell.Row + 1) & ":" & (nextCell.Row - 1)).Delete
    End If

    neededRows = debtTable.ListRows.Count
    If neededRows > 0 Then
        wsSU.Rows((parentCell.Row + 1) & ":" & _
            (parentCell.Row + neededRows)).Insert _
            Shift:=xlDown, CopyOrigin:=xlFormatFromLeftOrAbove
    End If

    Set parentCell = FindExact(wsSU, parentLabel)
    outputRow = parentCell.Row + 1
    activeRows = 0

    For i = 1 To debtTable.ListRows.Count

        instrumentName = Trim$(CStr( _
            debtTable.DataBodyRange.Cells(i, instrumentCol).Value))

        If Len(instrumentName) > 0 Then

            Set endingBalanceCell = FindInstrumentEndingBalance( _
                wsDebt, instrumentName, yearCol, _
                debtTable.Range.Row + debtTable.Range.Rows.Count)

            If endingBalanceCell Is Nothing Then
                Err.Raise vbObjectError + 14, , _
                    "Could not find Ending Balance for " & instrumentName & _
                    " on " & wsDebt.Name & "."
            End If

            wsSU.Cells(outputRow, parentCell.Column).Formula = _
                "='" & EscapeSheetName(wsDebt.Name) & "'!" & _
                debtTable.DataBodyRange.Cells(i, instrumentCol).Address(True, True)

            wsSU.Cells(outputRow, parentCell.Column + 1).Formula = _
                "='" & EscapeSheetName(wsDebt.Name) & "'!" & _
                endingBalanceCell.Address(True, True) & _
                "*'" & EscapeSheetName(wsDebt.Name) & "'!" & _
                debtTable.DataBodyRange.Cells(i, toggleCol).Address(True, True) & _
                "*'" & EscapeSheetName(wsAssump.Name) & "'!" & _
                switchCell.Address(True, True)

            wsSU.Cells(outputRow, parentCell.Column).IndentLevel = 1
            wsSU.Cells(outputRow, parentCell.Column + 1).NumberFormat = _
                "$#,##0;[Red]($#,##0);-"

            outputRow = outputRow + 1
            activeRows = activeRows + 1
        End If
    Next i

    If activeRows = 0 Then
        parentCell.Offset(0, 1).Value = 0
    Else
        parentCell.Offset(0, 1).Formula = _
            "=SUM(" & _
            wsSU.Cells(parentCell.Row + 1, parentCell.Column + 1).Address(False, False) & _
            ":" & _
            wsSU.Cells(parentCell.Row + activeRows, parentCell.Column + 1).Address(False, False) & _
            ")"
    End If

    parentCell.Offset(0, 1).NumberFormat = "$#,##0;[Red]($#,##0);-"

End Sub


Private Sub RefreshNewDebtBlock( _
    ByVal wsAssump As Worksheet, _
    ByVal wsSU As Worksheet)

    Dim debtHeader As Range
    Dim switchCell As Range
    Dim parentCell As Range
    Dim nextCell As Range

    Dim instrumentCol As Long
    Dim amountCol As Long
    Dim firstRow As Long
    Dim lastRow As Long
    Dim oldDetailRows As Long
    Dim neededRows As Long
    Dim outputRow As Long
    Dim activeRows As Long
    Dim r As Long
    Dim instrumentName As String

    Set debtHeader = FindExact(wsAssump, "Debt Instrument")
    Set switchCell = FindExact(wsAssump, "Debt Financing Switch (0/1)").Offset(0, 1)
    Set parentCell = FindExact(wsSU, "New Debt Issued")
    Set nextCell = FindExact(wsSU, "Other Sources")

    instrumentCol = debtHeader.Column
    firstRow = debtHeader.Row + 2
    lastRow = FindTableLastRow(wsAssump, firstRow, instrumentCol)
    amountCol = DetectAmountColumn(wsAssump, firstRow, lastRow, instrumentCol)

    activeRows = 0
    For r = firstRow To lastRow
        instrumentName = Trim$(CStr(wsAssump.Cells(r, instrumentCol).Value))

        If Len(instrumentName) > 0 _
           And LCase$(instrumentName) <> "total" _
           And IsNumeric(wsAssump.Cells(r, amountCol).Value) Then

            If CDbl(wsAssump.Cells(r, amountCol).Value) <> 0 Then
                activeRows = activeRows + 1
            End If
        End If
    Next r

    oldDetailRows = nextCell.Row - parentCell.Row - 1
    If oldDetailRows > 0 Then
        wsSU.Rows((parentCell.Row + 1) & ":" & (nextCell.Row - 1)).Delete
    End If

    neededRows = activeRows
    If neededRows > 0 Then
        wsSU.Rows((parentCell.Row + 1) & ":" & _
            (parentCell.Row + neededRows)).Insert _
            Shift:=xlDown, CopyOrigin:=xlFormatFromLeftOrAbove
    End If

    Set parentCell = FindExact(wsSU, "New Debt Issued")
    outputRow = parentCell.Row + 1
    activeRows = 0

    For r = firstRow To lastRow

        instrumentName = Trim$(CStr(wsAssump.Cells(r, instrumentCol).Value))

        If Len(instrumentName) > 0 _
           And LCase$(instrumentName) <> "total" _
           And IsNumeric(wsAssump.Cells(r, amountCol).Value) Then

            If CDbl(wsAssump.Cells(r, amountCol).Value) <> 0 Then

                wsSU.Cells(outputRow, parentCell.Column).Formula = _
                    "='" & EscapeSheetName(wsAssump.Name) & "'!" & _
                    wsAssump.Cells(r, instrumentCol).Address(True, True)

                wsSU.Cells(outputRow, parentCell.Column + 1).Formula = _
                    "='" & EscapeSheetName(wsAssump.Name) & "'!" & _
                    wsAssump.Cells(r, amountCol).Address(True, True) & _
                    "*'" & EscapeSheetName(wsAssump.Name) & "'!" & _
                    switchCell.Address(True, True)

                wsSU.Cells(outputRow, parentCell.Column).IndentLevel = 1
                wsSU.Cells(outputRow, parentCell.Column + 1).NumberFormat = _
                    "$#,##0;[Red]($#,##0);-"

                outputRow = outputRow + 1
                activeRows = activeRows + 1
            End If
        End If
    Next r

    If activeRows = 0 Then
        parentCell.Offset(0, 1).Value = 0
    Else
        parentCell.Offset(0, 1).Formula = _
            "=SUM(" & _
            wsSU.Cells(parentCell.Row + 1, parentCell.Column + 1).Address(False, False) & _
            ":" & _
            wsSU.Cells(parentCell.Row + activeRows, parentCell.Column + 1).Address(False, False) & _
            ")"
    End If

    parentCell.Offset(0, 1).NumberFormat = "$#,##0;[Red]($#,##0);-"

End Sub


Private Function FindDebtScheduleByCompany( _
    ByVal companyName As String) As Worksheet

    Dim ws As Worksheet
    Dim shortName As String

    shortName = FirstWord(companyName)

    For Each ws In ThisWorkbook.Worksheets
        If InStr(1, ws.Name, shortName, vbTextCompare) > 0 _
           And InStr(1, ws.Name, "Debt", vbTextCompare) > 0 Then

            Set FindDebtScheduleByCompany = ws
            Exit Function
        End If
    Next ws

    For Each ws In ThisWorkbook.Worksheets
        If InStr(1, ws.Name, "Debt", vbTextCompare) > 0 Then
            If Not FindRefinancingTable(ws) Is Nothing Then
                Set FindDebtScheduleByCompany = ws
                Exit Function
            End If
        End If
    Next ws

End Function


Private Function FindRefinancingTable( _
    ByVal ws As Worksheet) As ListObject

    Dim lo As ListObject

    For Each lo In ws.ListObjects
        If GetTableColumnIndex(lo, "Debt Instrument") > 0 _
           And GetTableColumnIndexFlexible(lo, Array( _
               "Refinance At Close?", _
               "Refinance at Close?", _
               "Refinance At Close? (0/1)", _
               "Refinance at Close? (0/1)", _
               "Refinance / Repay at Close? (0/1)")) > 0 Then

            Set FindRefinancingTable = lo
            Exit Function
        End If
    Next lo

End Function


Private Function FindSheetWithLabels( _
    ByVal labels As Variant) As Worksheet

    Dim ws As Worksheet
    Dim i As Long
    Dim allFound As Boolean

    For Each ws In ThisWorkbook.Worksheets
        allFound = True

        For i = LBound(labels) To UBound(labels)
            If FindExact(ws, CStr(labels(i))) Is Nothing Then
                allFound = False
                Exit For
            End If
        Next i

        If allFound Then
            Set FindSheetWithLabels = ws
            Exit Function
        End If
    Next ws

End Function


Private Function FindExact( _
    ByVal ws As Worksheet, _
    ByVal searchText As String) As Range

    Set FindExact = ws.Cells.Find( _
        What:=searchText, _
        After:=ws.Cells(1, 1), _
        LookIn:=xlValues, _
        LookAt:=xlWhole, _
        SearchOrder:=xlByRows, _
        SearchDirection:=xlNext, _
        MatchCase:=False)

End Function


Private Function GetTableColumnIndex( _
    ByVal lo As ListObject, _
    ByVal headerText As String) As Long

    Dim lc As ListColumn

    For Each lc In lo.ListColumns
        If LCase$(Trim$(lc.Name)) = LCase$(headerText) Then
            GetTableColumnIndex = lc.Index
            Exit Function
        End If
    Next lc

End Function


Private Function GetTableColumnIndexFlexible( _
    ByVal lo As ListObject, _
    ByVal possibleHeaders As Variant) As Long

    Dim lc As ListColumn
    Dim i As Long

    For Each lc In lo.ListColumns
        For i = LBound(possibleHeaders) To UBound(possibleHeaders)
            If LCase$(Trim$(lc.Name)) = _
               LCase$(CStr(possibleHeaders(i))) Then

                GetTableColumnIndexFlexible = lc.Index
                Exit Function
            End If
        Next i
    Next lc

End Function


Private Function FindForecastYearColumn( _
    ByVal ws As Worksheet, _
    ByVal targetYear As Long) As Long

    Dim r As Long
    Dim c As Long
    Dim lastCol As Long
    Dim score As Long
    Dim bestScore As Long
    Dim bestRow As Long
    Dim v As Variant

    lastCol = ws.UsedRange.Columns(ws.UsedRange.Columns.Count).Column

    For r = 1 To Application.Min(60, ws.UsedRange.Rows.Count)
        score = 0

        For c = 1 To lastCol
            v = ws.Cells(r, c).Value

            If IsDate(v) Then
                If Year(CDate(v)) >= 2000 And Year(CDate(v)) <= 2100 Then
                    score = score + 1
                End If
            ElseIf CStr(v) Like "*20##*" Then
                score = score + 1
            End If
        Next c

        If score > bestScore Then
            bestScore = score
            bestRow = r
        End If
    Next r

    For c = 1 To lastCol
        v = ws.Cells(bestRow, c).Value

        If IsDate(v) Then
            If Year(CDate(v)) = targetYear Then
                FindForecastYearColumn = c
                Exit Function
            End If
        ElseIf InStr(1, CStr(v), CStr(targetYear), vbTextCompare) > 0 Then
            FindForecastYearColumn = c
            Exit Function
        End If
    Next c

End Function


Private Function FindInstrumentEndingBalance( _
    ByVal ws As Worksheet, _
    ByVal instrumentName As String, _
    ByVal yearCol As Long, _
    ByVal searchStartRow As Long) As Range

    Dim searchRange As Range
    Dim hit As Range
    Dim firstAddress As String
    Dim rr As Long
    Dim lastUsedRow As Long

    lastUsedRow = ws.UsedRange.Row + ws.UsedRange.Rows.Count - 1

    Set searchRange = ws.Range( _
        ws.Cells(searchStartRow + 1, 1), _
        ws.Cells(lastUsedRow, Application.Max(yearCol, 2)))

    Set hit = searchRange.Find( _
        What:=instrumentName, _
        After:=searchRange.Cells(1, 1), _
        LookIn:=xlValues, _
        LookAt:=xlWhole, _
        SearchOrder:=xlByRows, _
        SearchDirection:=xlNext, _
        MatchCase:=False)

    If hit Is Nothing Then Exit Function

    firstAddress = hit.Address

    Do
        For rr = hit.Row + 1 To Application.Min(hit.Row + 10, lastUsedRow)
            If LCase$(Trim$(CStr(ws.Cells(rr, hit.Column).Value))) = _
               "ending balance" Then

                Set FindInstrumentEndingBalance = ws.Cells(rr, yearCol)
                Exit Function
            End If
        Next rr

        Set hit = searchRange.FindNext(hit)
    Loop While Not hit Is Nothing And hit.Address <> firstAddress

End Function


Private Function FindTableLastRow( _
    ByVal ws As Worksheet, _
    ByVal firstRow As Long, _
    ByVal instrumentCol As Long) As Long

    Dim r As Long
    Dim blankCount As Long
    Dim labelValue As String

    For r = firstRow To firstRow + 100

        labelValue = Trim$(CStr(ws.Cells(r, instrumentCol).Value))

        If LCase$(labelValue) = "total" Then
            FindTableLastRow = r - 1
            Exit Function
        End If

        If Len(labelValue) = 0 Then
            blankCount = blankCount + 1
        Else
            blankCount = 0
        End If

        If blankCount = 3 Then
            FindTableLastRow = r - 3
            Exit Function
        End If
    Next r

    FindTableLastRow = firstRow + 99

End Function


Private Function DetectAmountColumn( _
    ByVal ws As Worksheet, _
    ByVal firstRow As Long, _
    ByVal lastRow As Long, _
    ByVal instrumentCol As Long) As Long

    Dim c As Long
    Dim r As Long
    Dim score As Double
    Dim bestScore As Double
    Dim v As Variant

    For c = instrumentCol + 1 To instrumentCol + 6
        Select Case LCase$(Trim$(CStr(ws.Cells(firstRow - 2, c).Value)))
            Case "amount", "debt amount", "principal", "size"
                DetectAmountColumn = c
                Exit Function
        End Select
    Next c

    For c = instrumentCol + 1 To instrumentCol + 6
        score = 0

        For r = firstRow To lastRow
            v = ws.Cells(r, c).Value
            If IsNumeric(v) Then
                If Abs(CDbl(v)) >= 1 Then score = score + Abs(CDbl(v))
            End If
        Next r

        If score > bestScore Then
            bestScore = score
            DetectAmountColumn = c
        End If
    Next c

End Function


Private Function FirstWord(ByVal textValue As String) As String

    Dim cleaned As String

    cleaned = Trim$(textValue)

    If InStr(cleaned, " ") > 0 Then
        FirstWord = Left$(cleaned, InStr(cleaned, " ") - 1)
    Else
        FirstWord = cleaned
    End If

End Function


Private Function EscapeSheetName(ByVal sheetName As String) As String
    EscapeSheetName = Replace(sheetName, "'", "''")
End Function
