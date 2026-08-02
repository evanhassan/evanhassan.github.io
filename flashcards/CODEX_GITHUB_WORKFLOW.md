# Codex + GitHub workflow for the study app

## Goal

Stop downloading and re-uploading the folder. Keep one tracked copy inside GitHub. Codex edits the folder in place, rebuilds the self-contained app, validates it, commits the change, pushes a branch, and opens a pull request.

## Recommended repository location

Use the existing repository:

```text
evanhassan/evanhassan.github.io
```

Place this folder at:

```text
evanhassan.github.io/
  olin-huntsman-study/
```

That preserves the portfolio at the repository root and publishes the app as a GitHub Pages subpath.

## One-time local setup on the Mac

```bash
# Install GitHub CLI and Codex CLI if needed.
brew install gh
curl -fsSL https://chatgpt.com/codex/install.sh | sh

# Authenticate once.
gh auth login
# Run Codex once from a project directory and choose Sign in with ChatGPT.
codex

# Clone the site repository.
git clone https://github.com/evanhassan/evanhassan.github.io.git
cd evanhassan.github.io

# Copy this entire folder into the repo and use the stable name.
mv /path/to/Olin_Huntsman_Study_App_2026-08-01_FINAL ./olin-huntsman-study

# Validate before the first commit.
python3 olin-huntsman-study/scripts/sync_app.py
python3 olin-huntsman-study/scripts/validate_app.py

git add olin-huntsman-study
git commit -m "Add Olin Huntsman study app"
git push origin main
```

After GitHub Pages republishes, the app should be available at the repository’s normal Pages domain under `/olin-huntsman-study/`.

## What Codex reads

Run Codex from `olin-huntsman-study/`. The nested `AGENTS.md` in that folder tells Codex:

- which files are canonical;
- how to preserve IDs and browser progress;
- what validation commands to run;
- not to touch the rest of the portfolio repository;
- to default to a branch and pull request.

## Normal update loop

1. Save the newest model checkpoint and updated assumptions checklist into the app folder.
2. Copy `SESSION_NOTES_TEMPLATE.md` to `SESSION_NOTES.md` and fill it out.
3. From the app folder, run Codex with a task such as:

```text
Read AGENTS.md, SESSION_NOTES.md, and the newest checkpoint. Update only this study-app folder. Preserve every existing ID and progress schema. Add high-quality contextual cards, preserve the 95-card interview deck, add only supported Model Builder blocks, update the checkpoint / assumptions checklist / README, run sync_app.py and validate_app.py, review the diff, and stop with a precise summary. Do not touch the rest of the repository.
```

4. Review the diff.
5. Push a branch and open a pull request.
6. Merge after validation passes.

## One-command branch + PR path

The included script automates the safe workflow:

```bash
cd evanhassan.github.io/olin-huntsman-study
cp SESSION_NOTES_TEMPLATE.md SESSION_NOTES.md
# Fill in SESSION_NOTES.md
bash scripts/codex_update.sh.example SESSION_NOTES.md
```

The script:

1. refuses to run on a dirty working tree;
2. creates a timestamped `codex/study-app-update-*` branch;
3. runs `codex exec --sandbox workspace-write` inside this folder;
4. runs sync and validation again;
5. commits only this folder;
6. pushes the branch;
7. opens a GitHub pull request with `gh pr create`.

## Why branch + PR is the default

The biggest risk is not a broken HTML file. It is encoding a wrong accounting conclusion into 100 cards. A branch and PR gives you one final diff review while still eliminating the folder-resend workflow.

Once this has worked cleanly several times, direct-to-main publishing can be added, but it should remain an explicit choice rather than the default.

## GitHub Actions validation

Copy:

```text
GITHUB_ACTION_VALIDATE.yml.example
```

to the repository root as:

```text
.github/workflows/validate-study-app.yml
```

The workflow runs the validator whenever the app folder changes in a pull request or on `main`.

## Optional Codex Cloud path

Connect the GitHub repository to Codex and create an environment for it. Give Codex the same task and ask it to push a branch / open a pull request. This removes the need for the Mac to remain online. Keep `AGENTS.md` and the validation workflow in the repo so cloud and local runs follow the same rules.

## Direct push later

After the workflow is stable, a direct-push command can be used deliberately:

```bash
python3 scripts/sync_app.py
python3 scripts/validate_app.py
git add .
git commit -m "Update Olin Huntsman study app"
git push origin main
```

Do not automate this until the PR workflow has produced several clean updates.
