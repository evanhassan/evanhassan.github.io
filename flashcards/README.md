# Olin / Huntsman Model Review, IB Flashcards & Model Builder

Version: August 1, 2026

Open `index.html` directly in a browser. The app is self-contained and requires no server or external dependency.

## Current model status

The core merger model is structurally complete:

- Two standalone three-statement forecasts
- Standalone D&A, debt, and equity schedules
- Transaction assumptions and Sources & Uses
- PPA / Goodwill
- Transaction & Refinancing Debt
- Pro Forma Opening Balance Sheet
- Pro Forma D&A
- Synergies & Integration
- Full-year Pro Forma Income Statement
- Full-year Pro Forma Balance Sheet
- Full-year Pro Forma Cash Flow Statement
- Summary and EPS accretion / dilution
- Core model checks

The only substantive remaining work is the final assumptions audit, sourcing, and presentation freeze. See:

- `Olin_Huntsman_Full_Merger_Model_Checkpoint_2026-08-01_FINAL.txt`
- `FINAL_ASSUMPTIONS_CHECKLIST.md`

## Flashcards

- Model Review - Core: 400
- Model Review - Today: 516
- M&I 400 - Real: 400
- M&I 400 - Applied: 400
- Interview Focus - Basic: 95
- **Total: 1,811**

The Interview Focus deck contains:

- Accounting: 34
- Enterprise / Equity Value: 15
- Merger Model: 24
- LBO Model: 22

Existing `C###`, `T001-T420`, `R###`, and `A###` IDs were preserved. New content uses:

- `T421-T516` — August 1 final-model and assumptions cards
- `I001-I095` — targeted basic interview deck

Prior exported progress remains compatible.

## Model Builder

- 13 schedules
- 70 drag-and-drop blocks
- 308 mechanics / linkage questions

Schedules:

1. Huntsman — Depreciation And Amoritization Schedule
2. Olin — Share Schedule
3. PPA & Goodwill
4. Transaction & Refinancing Debt
5. Sources & Uses — Joint Debt Flow
6. Pro Forma Opening Balance Sheet
7. Pro Forma D&A
8. Synergies & Integration
9. Pro Forma Financials — Income Statement
10. Main Page & Assumptions — Final Audit
11. Pro Forma Financials — Balance Sheet
12. Pro Forma Financials — Cash Flow Statement
13. Summary & Accretion / Dilution

The August 1 additions cover the final full-year pro forma architecture, balance-sheet roll-forward, cash-flow construction, summary lookups, accretion / dilution, capital allocation, and final assumption review.

## Source files

- `deck.json` — flashcard source of truth
- `model_builder_modules.json` — Model Builder source of truth
- `index.html` — generated self-contained app with both JSON files embedded
- `flashcards.csv` — generated spreadsheet-friendly export
- `Olin_Huntsman_Full_Merger_Model_Checkpoint_2026-08-01_FINAL.txt` — latest locked model checkpoint
- `FINAL_ASSUMPTIONS_CHECKLIST.md` — remaining assumption work

## Editing workflow

Do not hand-edit embedded JSON inside `index.html`.

After changing either canonical JSON file, run:

```bash
python3 scripts/sync_app.py
python3 scripts/validate_app.py
```

`sync_app.py` updates metadata, rebuilds `flashcards.csv`, refreshes the deck selector, embeds the current JSON into `index.html`, and updates the visible counts and version.

`validate_app.py` checks:

- card IDs and category counts;
- four-option answer structure;
- the 400-card M&I Real deck;
- the 95-card Interview Focus deck;
- builder module and block IDs;
- source / embedded JSON parity;
- Model Builder UI presence;
- JavaScript syntax when Node is installed.

## GitHub maintenance

- `AGENTS.md` gives coding-agent rules.
- `CODEX_GITHUB_WORKFLOW.md` contains the maintenance workflow.
- `SESSION_NOTES_TEMPLATE.md` is the handoff format.
- `scripts/codex_update.sh.example` provides an example branch / validate / PR workflow.
- `GITHUB_ACTION_VALIDATE.yml.example` can be copied into `.github/workflows/`.

Keep the app dependency-free, directly openable from `index.html`, and in Arial.
