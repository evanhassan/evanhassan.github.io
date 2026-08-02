#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DECK_PATH = ROOT / "deck.json"
BUILDER_PATH = ROOT / "model_builder_modules.json"
INDEX_PATH = ROOT / "index.html"


def fail(message: str) -> None:
    raise SystemExit(f"VALIDATION FAILED: {message}")


def extract_json_script(page: str, script_id: str) -> object:
    match = re.search(
        rf'<script type="application/json" id="{re.escape(script_id)}">(.*?)</script>',
        page,
        flags=re.S,
    )
    if not match:
        fail(f"Missing #{script_id} JSON script tag.")
    return json.loads(match.group(1))


def main() -> None:
    deck = json.loads(DECK_PATH.read_text(encoding="utf-8"))
    builder = json.loads(BUILDER_PATH.read_text(encoding="utf-8"))
    page = INDEX_PATH.read_text(encoding="utf-8")

    questions = deck.get("questions", [])
    if deck.get("question_count") != len(questions):
        fail("deck.question_count does not equal the number of questions.")

    ids = [item.get("id") for item in questions]
    duplicates = [key for key, count in Counter(ids).items() if count > 1]
    if duplicates:
        fail(f"Duplicate card IDs: {duplicates[:10]}")

    for item in questions:
        if not isinstance(item.get("options"), list) or len(item["options"]) != 4:
            fail(f'{item.get("id")} does not have exactly four options.')
        if item.get("answer_index") not in range(4):
            fail(f'{item.get("id")} has invalid answer_index.')
        if not item.get("question") or not item.get("explanation"):
            fail(f'{item.get("id")} is missing a question or explanation.')
        if not item.get("category"):
            fail(f'{item.get("id")} is missing a category.')

    actual_counts = Counter(item["category"] for item in questions)
    declared_counts = {
        item["name"]: item["count"]
        for item in deck.get("categories", [])
    }
    if actual_counts != Counter(declared_counts):
        fail(
            "Category counts differ. "
            f"Actual={dict(actual_counts)} Declared={declared_counts}"
        )

    if deck.get("category_count") != len(declared_counts):
        fail("deck.category_count does not equal the declared category count.")

    if actual_counts.get("M&I 400 - Real") != 400:
        fail("M&I 400 - Real must remain at 400 cards.")

    if actual_counts.get("Interview Focus - Basic") != 95:
        fail("Interview Focus - Basic must contain 95 cards.")

    interview_ids = [
        item["id"]
        for item in questions
        if item["category"] == "Interview Focus - Basic"
    ]
    if interview_ids != [f"I{number:03d}" for number in range(1, 96)]:
        fail("Interview Focus IDs must be I001-I095 in order.")

    modules = builder.get("modules", [])
    module_ids = [module.get("id") for module in modules]
    if len(module_ids) != len(set(module_ids)):
        fail("Duplicate Model Builder module ID.")

    required_modules = {
        "consolidated-income-statement",
        "main-page-assumptions",
        "pro-forma-balance-sheet",
        "pro-forma-cash-flow-statement",
        "summary-accretion-dilution",
    }
    missing_modules = required_modules.difference(module_ids)
    if missing_modules:
        fail(f"Missing final Model Builder modules: {sorted(missing_modules)}")

    block_ids: list[str] = []
    quiz_count = 0

    for module in modules:
        if not module.get("title") or not module.get("blocks"):
            fail(f'Module {module.get("id")} is missing a title or blocks.')

        for block in module["blocks"]:
            block_id = block.get("id")
            block_ids.append(block_id)

            if len(block.get("rows", [])) < 2:
                fail(f"Block {block_id} has fewer than two rows.")

            for question in block.get("questions", []):
                quiz_count += 1
                if len(question.get("options", [])) != 4:
                    fail(f"Builder question in {block_id} lacks four options.")
                if question.get("answer_index") not in range(4):
                    fail(
                        f"Builder question in {block_id} has invalid answer_index."
                    )
                if not question.get("question") or not question.get("explanation"):
                    fail(
                        f"Builder question in {block_id} is missing text."
                    )

    if len(block_ids) != len(set(block_ids)):
        fail("Duplicate Model Builder block ID.")

    embedded_deck = extract_json_script(page, "deckData")
    embedded_builder = extract_json_script(page, "builderData")

    if embedded_deck != deck:
        fail("Embedded deckData does not match deck.json. Run sync_app.py.")

    if embedded_builder != builder:
        fail(
            "Embedded builderData does not match "
            "model_builder_modules.json. Run sync_app.py."
        )

    if 'value="builder"' not in page or 'id="builderView"' not in page:
        fail("Model Builder UI is missing from index.html.")

    for category in declared_counts:
        escaped = category.replace("&", "&amp;")
        if category not in page and escaped not in page:
            fail(f"Deck selector is missing category: {category}")

    if "All 5 decks" not in page:
        fail("Deck selector does not show the five-deck option.")

    node = shutil.which("node")
    if node:
        scripts = re.findall(
            r'<script(?![^>]*type="application/json")[^>]*>(.*?)</script>',
            page,
            flags=re.S,
        )
        with tempfile.NamedTemporaryFile(
            "w",
            suffix=".js",
            encoding="utf-8",
            delete=False,
        ) as handle:
            handle.write("\n".join(scripts))
            js_path = Path(handle.name)

        try:
            result = subprocess.run(
                [node, "--check", str(js_path)],
                capture_output=True,
                text=True,
            )
            if result.returncode != 0:
                fail(f"JavaScript syntax check failed:\n{result.stderr}")
        finally:
            js_path.unlink(missing_ok=True)

    block_count = sum(len(module["blocks"]) for module in modules)

    print("VALIDATION PASSED")
    print(
        f"Cards: {len(questions)}; "
        f"categories: {dict(actual_counts)}"
    )
    print(
        f"Model Builder: {len(modules)} schedules, "
        f"{block_count} blocks, {quiz_count} questions"
    )
    if node:
        print(
            "Embedded JSON matches source files; "
            "JavaScript syntax is valid."
        )
    else:
        print(
            "Embedded JSON matches source files; "
            "Node not installed, JS syntax check skipped."
        )


if __name__ == "__main__":
    main()
