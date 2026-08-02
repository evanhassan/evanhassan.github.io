# Final Assumptions Checklist — Olin / Huntsman

This is the only substantive work remaining before the model is frozen.

## 1. Transaction and presentation

- [ ] Legal close date remains **June 30, 2027**.
- [ ] Full-year **Pro Forma Year remains 2027**.
- [ ] `D9` controls legal-close and opening-balance-sheet mechanics.
- [ ] `D14` controls full-year Pro Forma Financials and Summary.
- [ ] The base case remains **all stock**.
- [ ] Exchange ratio remains **0.5476**.
- [ ] Target diluted shares remain **178.1mm**.
- [ ] Consideration shares remain approximately **97.5mm**.
- [ ] Debt Financing Switch remains **0** unless a real use for new debt is added.

## 2. PPA / Goodwill

- [ ] Confirm whether the **$100mm PP&E step-up** is sourced or illustrative.
- [ ] Confirm whether the **$200mm new identifiable intangibles** assumption is sourced or illustrative.
- [ ] Clearly label any unsourced PPA values as analyst assumptions.
- [ ] Confirm **PP&E Step-Up Life = 10 years**.
- [ ] Confirm **Intangible Amortization Life = 10 years**.
- [ ] Confirm the incremental DTL uses only PPA-created temporary differences.
- [ ] Confirm transaction fees remain excluded from goodwill.
- [ ] Confirm target historical equity is eliminated.

## 3. Synergies and integration

- [ ] Confirm **Run-Rate Synergies = $300mm**.
- [ ] Confirm **Additional Synergies = $100mm**.
- [ ] Confirm **Integration Costs = $175mm**.
- [ ] Confirm the near-term synergy ramp.
- [ ] Confirm the additional-synergy timing.
- [ ] Confirm integration-cost timing percentages sum to **100%**.
- [ ] Confirm integration costs are not stub-weighted twice.
- [ ] Reconcile the Summary's current **0 / 150 / 285 / 300 / 300** synergy row with the Synergies & Integration schedule.
- [ ] Ensure Summary, Pro Forma IS, and Synergies & Integration use identical timing.

## 4. Taxes

- [ ] Confirm the modeled tax rate remains **24%**.
- [ ] Decide whether the disclosed NOL / cash-tax benefit is modeled separately.
- [ ] Keep book tax expense separate from cash-tax benefits.
- [ ] Confirm incremental PPA DTL unwind mechanics.
- [ ] Confirm debt interest deductibility treatment.
- [ ] Decide whether to model interest income on excess cash.

## 5. Financing

- [ ] Confirm selected Huntsman close repayments:
  - [ ] Revolver: approximately **$214.9mm**
  - [ ] U.S. A/R Program: **$93.0mm**
  - [ ] EU A/R Program: **$59.0mm**
- [ ] Confirm total selected debt repaid / refinanced is approximately **$366.9mm**.
- [ ] Confirm Existing Cash Used is approximately **$423mm**.
- [ ] Confirm Sources - Uses = **0**.
- [ ] Confirm Financing Fees = **0** in the active base case.
- [ ] Confirm Refinancing Rate = **7.50%** only where applicable.
- [ ] Do not activate optional new debt without an explicit use for proceeds.

## 6. Shares and equity

- [ ] Confirm full consideration shares are included in 2027 full-year pro forma shares.
- [ ] Confirm Huntsman historical shares are not added after close.
- [ ] Confirm Common Stock records par value only.
- [ ] Confirm APIC receives the residual consideration-share value.
- [ ] Confirm target historical equity is eliminated.
- [ ] Confirm the simplified Olin dilutive-effect assumption is intentional.
- [ ] Do not infer cash issuance proceeds from net share-count movement.

## 7. Capital allocation / excess cash

The model reaches net cash in 2030 and approximately **$3.1bn of net cash in 2031**.

Select and document one policy:

- [ ] Leave excess cash unallocated.
- [ ] Use excess cash for additional debt repayment.
- [ ] Add share repurchases.
- [ ] Add higher dividends.
- [ ] Add acquisitions / strategic investments.
- [ ] Use a combination of the above.

Do not alter free cash flow merely to prevent negative net debt.

## 8. Summary and outputs

- [ ] Revenue: **13,781 / 14,845 / 15,497 / 16,480 / 17,301**
- [ ] EBITDA: **1,454 / 2,117 / 2,569 / 3,167 / 3,623**
- [ ] Net Income: **332 / 828 / 1,180 / 1,669 / 2,032**
- [ ] Pro Forma EPS: **1.55 / 3.86 / 5.49 / 7.75 / 9.41**
- [ ] Olin Standalone EPS: **1.20 / 3.07 / 4.72 / 7.16 / 8.80**
- [ ] Accretion: **29.44% / 25.92% / 16.38% / 8.19% / 6.89%**
- [ ] Net Debt: **3,502 / 2,442 / 1,027 / (868) / (3,123)**
- [ ] Free Cash Flow: **797 / 1,236 / 1,591 / 2,069 / 2,429**
- [ ] Summary year headers begin at D14 and stop at 2031.
- [ ] INDEX / MATCH row and column ranges are aligned.
- [ ] No extra post-2031 `#N/A` column is visible.

## 9. Final checks

- [ ] Pro Forma Opening BS check = **0**.
- [ ] Pro Forma Balance Sheet check = **0** in every year.
- [ ] CFS Ending Cash = Balance Sheet Cash.
- [ ] IS Net Income = CFS Net Income.
- [ ] Pro Forma D&A ties to the CFS and EBITDA.
- [ ] Debt balances and interest tie to Transaction & Refinancing Debt.
- [ ] Retained Earnings rolls correctly.
- [ ] Common shares and diluted shares tie.
- [ ] Standalone EPS ties.
- [ ] Accretion / dilution recalculates.
- [ ] No `#REF!`, `#VALUE!`, `#N/A`, or `#DIV/0!` in the presentation case.
- [ ] Save the newest workbook and a clean backup.
