# Repository guide for coding agents

## Scope

This repository contains Celestia Improvement Proposals (CIPs) and the mdBook
site that publishes them. Keep changes focused on the requested proposal or
repository documentation. Do not change a CIP's technical meaning unless the
request explicitly requires it.

## Repository layout

- `cips/cip-###.md`: numbered proposals.
- `cips/cip-template.md`: source template for new proposals.
- `cips/SUMMARY.md`: mdBook navigation. Add or update an entry when a numbered
  CIP changes the published index.
- `cips/wgs/`: working-group documents.
- `cips/notes/`: Core Devs Call notes.
- `theme/`: mdBook theme overrides and static assets.
- `book.toml`: mdBook configuration.
- `.markdownlint.yaml`: Markdown lint rules.
- `.agents/skills/`: task-specific agent workflows.

## CIP rules

- Read `cips/cip-001.md` before creating or substantially editing a CIP.
- Start new proposals from `cips/cip-template.md`.
- Do not assign a CIP number to a new proposal. Editors assign the number.
- Name an unnumbered proposal `cip-draft_title_abbrev.md`.
- Preserve the metadata table and section structure required by the template.
- Use RFC 2119 and RFC 8174 key words consistently when the proposal uses
  normative requirements.
- Keep links relative for repository content. Avoid new external links in a
  proposal unless the CIP process permits them.
- Update `cips/SUMMARY.md` and the table in `cips/README.md` when adding or
  renumbering a published CIP.
- Use the `cip-authoring` skill for the full authoring and review checklist.

## Writing conventions

- Follow `.markdownlint.yaml`.
- Match the terminology, capitalization, and formatting of nearby CIPs.
- Prefer direct, technical prose. Do not add marketing language.
- Preserve an author's voice when editing an existing proposal.
- Do not reflow unrelated paragraphs or tables.
- Use ISO 8601 dates in CIP metadata.

## Validation

Run Markdown lint after changing Markdown:

```sh
markdownlint --config .markdownlint.yaml '**/*.md'
```

Build the site after changing navigation, templates, theme files, or book
configuration:

```sh
mdbook build
```

If a required tool is not installed, report that validation gap in the final
response. Do not commit generated `book/` output.

## Git and review

- Review the diff against the target branch before committing.
- Keep generated files and local agent settings out of commits.
- Do not overwrite unrelated workspace changes.
- Summarize content changes and validation results in the pull request body.
