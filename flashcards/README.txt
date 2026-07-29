OLIN / HUNTSMAN MODEL REVIEW & IB FLASHCARDS
Rebuilt: July 28, 2026

CONTENTS
- index.html
  Self-contained flashcard app. Open directly in a browser or serve the folder locally.
- deck.json
  Editable source deck.
- flashcards.csv
  Flat export of every card and answer choice.
- Olin_Huntsman_Full_Merger_Model_Checkpoint_2026-07-28_FINAL.txt
  End-of-session model checkpoint.
- INTERVIEW_STYLE_SPEC.txt
  Rules used to rewrite the custom decks.
- RefreshSourcesUses_InsertRows.bas
  Final Sources & Uses refresh macro from this session.
- run_local.py
  Starts a local web server.
- DECK_VALIDATION.txt
  Counts and validation checks.
- manifest.txt
  File list and hashes.

DECKS
1. Model Review - Core: 400
   Contextual questions tied to the workbook's three-statement, D&A, debt,
   equity, circularity, PPA, consolidation, and debugging mechanics.

2. Model Review - Today: 160
   Olin assumptions, share-count and APIC mechanics, dilution, Sources & Uses,
   target/acquirer refinancing, cash funding, and dynamic VBA.

3. M&I 400 - Real: 400
   Preserved from the prior app without rewriting the source-derived cards.

4. M&I 400 - Applied: 400
   Applied technical-interview scenarios with plausible near-miss distractors.

Total: 1,360 cards.

USING THE APP
- Open index.html directly, or run:
    python3 run_local.py
- Choose a deck, pool, difficulty, session size, and category.
- Multiple choice shortcuts: 1-4; Enter advances after answering.
- Flashcard mode: Enter flips; A/H/G/E grade Again/Hard/Good/Easy.
- S stars a card.
- Progress is stored in the browser.
- Export progress before changing browsers or clearing browser data.

FULL TEXT
The rebuilt custom cards are deliberately concise and complete. CSS was changed
so question, option, answer, feedback, and explanation text wrap and remain fully
visible rather than being clipped by a fixed-height card.

PHONE
For a private phone app, host this folder behind authentication or on a private
local network. A public GitHub Pages deployment is discoverable even if unlinked.
Once hosted, open the URL in Safari and use Share -> Add to Home Screen.

UPDATING
Edit deck.json as the source of truth, then re-embed it into index.html before
deployment. The current index.html already contains the complete deck and does
not require deck.json at runtime.
