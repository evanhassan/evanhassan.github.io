# AGENTS.md — Olin / Huntsman Study App

## Purpose

This folder contains the self-contained study app for the completed Olin / Huntsman merger model. It combines FSRS-style flashcards, a targeted interview deck, and drag-and-drop Model Builder schedules.

## Sources of truth

- `deck.json` owns flashcard content.
- `model_builder_modules.json` owns Model Builder schedules, row orders, and mechanics quizzes.
- The newest `Olin_Huntsman_Full_Merger_Model_Checkpoint_*_FINAL.txt` owns the settled model architecture.
- `FINAL_ASSUMPTIONS_CHECKLIST.md` owns the remaining assumption audit.
- `index.html` contains generated embedded copies of both JSON files. Never edit those embedded copies manually.
- `flashcards.csv` is generated from `deck.json`.

## Current model architecture

- The core model is structurally complete.
- `D9` is the legal transaction date.
- `D14` is the first full-year Pro Forma Year.
- Final Pro Forma Financials use full-year combined treatment from D14 onward.
- The Pro Forma Opening Balance Sheet is the transaction-adjusted starting snapshot.
- Forecast balance-sheet accounts roll from the opening balance using combined annual movements and account-specific PPA / debt / equity schedules.
- CFS Ending Cash is the balance-sheet cash source of truth.
- The only substantive remaining work is the assumptions audit and presentation freeze.

Do not silently revert to the prior actual-close stub presentation.

## Non-negotiable compatibility rules

1. Never delete, rename, renumber, or reuse an existing flashcard ID unless explicitly instructed.
2. Never delete, rename, or renumber an existing module ID or block ID unless explicitly instructed.
3. Preserve browser progress compatibility, local-storage keys, and progress-export structure.
4. New model-session cards belong in `Model Review - Today` and use the next sequential `T###` IDs.
5. New targeted interview cards belong in `Interview Focus - Basic` and use the next sequential `I###` IDs.
6. Do not modify the 400 `M&I 400 - Real` cards unless explicitly instructed.
7. `Interview Focus - Basic` must remain a targeted deck, not a duplicate of the entire M&I 400.
8. Every card and builder question must have exactly four options and a zero-based `answer_index` from 0 to 3.
9. Keep the app dependency-free and directly openable from `index.html`.
10. Preserve Arial and the current visual design.
11. Do not touch files outside this folder.
12. Never force-push.

## Content standards

- Ground new material in the newest checkpoint and session notes.
- Preserve workbook terminology, sign conventions, and link direction.
- Distinguish disclosed facts, analyst assumptions, and temporary placeholders.
- Distinguish the legal close date from the selected full-year Pro Forma Year.
- Treat the Pro Forma Opening Balance Sheet as the starting snapshot.
- Treat standalone forecasts as sources of annual movement, not replacements for transaction-adjusted balances.
- Use plausible near-miss distractors.
- Explanations must state the accounting or modeling reason.
- Include formula, sign, timing, architecture, numerical, lookup, and debugging questions.
- Do not silently turn a placeholder assumption into a sourced fact.
- Negative net debt is a capital-allocation question, not automatically a credit problem.

## Model Builder standards

- Rows must appear in exact workbook order.
- New module and block IDs must be lowercase kebab-case and globally unique.
- Each block should test row order, formula construction, sign, timing, link direction, and failure modes.
- Preserve every existing module and block ID before appending new content.
- The final builder should cover Main Page & Assumptions, full-year Pro Forma IS, BS, CFS, and Summary / Accretion-Dilution.

## Required workflow

After any content change:

```bash
python3 scripts/sync_app.py
python3 scripts/validate_app.py
git diff --stat
git status --short
```

Do not commit if validation fails.

## Git workflow

- Default to a feature branch and pull request.
- Direct push to `main` is allowed only when the user explicitly requests it and validation passes.
- Make one focused commit with a descriptive message.
- Leave the worktree clean.
