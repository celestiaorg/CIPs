---
name: cip-authoring
description: Create or review Celestia Improvement Proposals, including metadata, required sections, numbering, navigation, and repository validation.
---

# CIP authoring

Use this workflow when a task creates, restructures, or reviews a CIP.

## Read the sources

1. Read `cips/cip-001.md` for the current CIP process.
2. Read `cips/cip-template.md` for the required metadata and sections.
3. Read one or two nearby CIPs of the same type.
4. Treat those repository files as authoritative when they differ from this
   workflow.

## Create a proposal

1. Copy the structure from `cips/cip-template.md`.
2. Use `XX` as the CIP number until an editor assigns a number.
3. Name the file `cip-draft_title_abbrev.md` until it receives a number.
4. Complete each applicable metadata field.
5. Remove template comments and unused optional fields or sections.
6. Keep the title at 44 characters or fewer.
7. Include a substantive `Security Considerations` section.
8. Include the CC0 copyright statement.

## Edit or review a proposal

Check that:

- The metadata matches the document and uses an ISO 8601 creation date.
- `type` and `category` use values allowed by the template.
- `requires` lists each CIP referenced as a dependency in the specification.
- The abstract summarizes the specification without adding requirements.
- The motivation explains the problem, while the specification defines the
  solution precisely enough for interoperable implementations.
- Normative key words follow RFC 2119 and RFC 8174 when used.
- Parameter changes are summarized and account for CIP-13 when applicable.
- Backward compatibility and security consequences are explicit.
- Test cases do not introduce requirements absent from the specification.
- External resources comply with the CIP process.

Do not silently change technical intent. Flag ambiguity for the author or
editor when a safe correction is not clear.

## Publish a numbered CIP

When an editor assigns a number:

1. Rename the file to `cips/cip-###.md` with three digits.
2. Replace the draft number in its metadata.
3. Add the CIP to `cips/SUMMARY.md` in numeric order.
4. Add the CIP to the table in `cips/README.md`.
5. Update relative references affected by the rename.

## Validate

Run:

```sh
markdownlint --config .markdownlint.yaml '**/*.md'
mdbook build
```

Inspect the final diff for unrelated formatting changes and generated files.
