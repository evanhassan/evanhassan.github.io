#!/usr/bin/env python3
"""Sync canonical JSON into the self-contained study app.

Run from the repository root:
    python3 scripts/sync_app.py
"""
from __future__ import annotations

import csv
import html as html_lib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DECK = ROOT / "deck.json"
BUILDER = ROOT / "model_builder_modules.json"
HTML = ROOT / "index.html"
CSV = ROOT / "flashcards.csv"

deck = json.loads(DECK.read_text(encoding="utf-8"))
builder = json.loads(BUILDER.read_text(encoding="utf-8"))

questions = deck["questions"]
deck["question_count"] = len(questions)

counts: dict[str, int] = {}
for card in questions:
    counts[card["category"]] = counts.get(card["category"], 0) + 1

declared_names = [row["name"] for row in deck.get("categories", [])]
for category in counts:
    if category not in declared_names:
        deck.setdefault("categories", []).append({"name": category, "count": 0})

for row in deck.get("categories", []):
    row["count"] = counts.get(row["name"], 0)

deck["category_count"] = len(deck.get("categories", []))
DECK.write_text(
    json.dumps(deck, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)

fields = [
    "ID",
    "Deck",
    "Subcategory",
    "Difficulty",
    "Question",
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "Correct Letter",
    "Correct Answer",
    "Explanation",
    "Source Basis",
]

with CSV.open("w", encoding="utf-8-sig", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=fields)
    writer.writeheader()
    for card in questions:
        answer_index = card["answer_index"]
        writer.writerow(
            {
                "ID": card["id"],
                "Deck": card["category"],
                "Subcategory": card.get("subcategory", ""),
                "Difficulty": card.get("difficulty", ""),
                "Question": card["question"],
                "Option A": card["options"][0],
                "Option B": card["options"][1],
                "Option C": card["options"][2],
                "Option D": card["options"][3],
                "Correct Letter": "ABCD"[answer_index],
                "Correct Answer": card["options"][answer_index],
                "Explanation": card.get("explanation", ""),
                "Source Basis": card.get("source_basis", ""),
            }
        )

page = HTML.read_text(encoding="utf-8")
compact_deck = json.dumps(
    deck,
    ensure_ascii=False,
    separators=(",", ":"),
).replace("</script>", "<\\/script>")
compact_builder = json.dumps(
    builder,
    ensure_ascii=False,
    separators=(",", ":"),
).replace("</script>", "<\\/script>")

page = re.sub(
    r'(<script type="application/json" id="deckData">).*?(</script>)',
    lambda match: match.group(1) + compact_deck + match.group(2),
    page,
    count=1,
    flags=re.S,
)
page = re.sub(
    r'(<script type="application/json" id="builderData">).*?(</script>)',
    lambda match: match.group(1) + compact_builder + match.group(2),
    page,
    count=1,
    flags=re.S,
)

category_rows = deck.get("categories", [])
deck_options = [
    f'<option value="all">All {len(category_rows)} decks</option>'
]
for row in category_rows:
    name = html_lib.escape(row["name"], quote=True)
    deck_options.append(f'<option value="{name}">{name}</option>')
deck_options_html = "\n".join(deck_options)

page = re.sub(
    r'(<select id="studyDay">).*?(</select>)',
    lambda match: match.group(1) + "\n" + deck_options_html + "\n" + match.group(2),
    page,
    count=1,
    flags=re.S,
)

card_count = f"{len(questions):,}"
module_count = len(builder["modules"])
block_count = sum(len(module["blocks"]) for module in builder["modules"])
quiz_count = sum(
    len(block.get("questions", []))
    for module in builder["modules"]
    for block in module["blocks"]
)

deck_word = "deck" if len(category_rows) == 1 else "decks"
schedule_word = "schedule" if module_count == 1 else "schedules"

subtitle = (
    f"{card_count} questions across {len(category_rows)} {deck_word}, plus "
    f"{module_count} drag-and-drop Model Builder {schedule_word} "
    f"with {block_count} blocks and {quiz_count} mechanics / linkage questions."
)
page = re.sub(
    r'<div class="subtitle">.*?</div>',
    f'<div class="subtitle">{subtitle}</div>',
    page,
    count=1,
    flags=re.S,
)

version_text = (
    f'Version {html_lib.escape(deck.get("created", ""), quote=False)} - '
    f'{html_lib.escape(deck.get("version", ""), quote=False)}'
)
page = re.sub(
    r'<div class="badge" id="versionBadge">.*?</div>',
    f'<div class="badge" id="versionBadge">{version_text}</div>',
    page,
    count=1,
    flags=re.S,
)

HTML.write_text(page, encoding="utf-8")

print(
    f"Synced {len(questions)} cards, {len(category_rows)} decks, "
    f"{module_count} builder schedules, {block_count} blocks, and {quiz_count} questions."
)
