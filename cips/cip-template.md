---
title: The CIP title is a few words, not a complete sentence
description: Description is one full (short) sentence
author: a comma separated list of the author’s or authors’ name + GitHub username (in parenthesis), or name and email (in angle brackets). Example, FirstName LastName (@GitHubUsername), FirstName LastName foo@bar.com, FirstName (@GitHubUsername) and GitHubUsername (@GitHubUsername)
discussions-to: URL
status: Draft
type: Standards Track, Meta, or Informational
category: Core, Data Availability, Networking, Interface, or CRC. Only required for Standards Track. Otherwise, remove this field.
created: Date created on, in ISO 8601 (yyyy-mm-dd) format
requires: CIP number(s). Only required when you reference an CIP in the `Specification` section. Otherwise, remove this field.
---

> Note:
**READ CIP-1 BEFORE USING THIS TEMPLATE!**
This is the suggested template for new CIPs. After you have filled in the requisite fields, please delete these comments. Note that an CIP number will be assigned by an editor. When opening a pull request to submit your CIP, please use an abbreviated title in the filename, `cip-draft_title_abbrev.md`. The title should be 44 characters or less. It should not repeat the CIP number in title, irrespective of the category.

TODO: Remove the note before submitting

## Abstract

The Abstract is a multi-sentence (short paragraph) technical summary. This should be a very terse and human-readable version of the specification section. Someone should be able to read only the abstract to get the gist of what this specification does.

TODO: Remove the previous comments before submitting

## Motivation

This section is optional.

The motivation section should include a description of any nontrivial problems the CIP solves. It should not describe how the CIP solves those problems, unless it is not immediately obvious. It should not describe why the CIP should be made into a standard, unless it is not immediately obvious.

With a few exceptions, external links are not allowed. If you feel that a particular resource would demonstrate a compelling case for your CIP, then save it as a printer-friendly PDF, put it in the assets folder, and link to that copy.

TODO: Remove the previous comments before submitting

## Specification

The Specification section should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow competing, interoperable implementations for any of the current Celestia clients (celestia-node, celestia-core, celestia-app).

It is recommended to follow RFC 2119 and RFC 8170. Do not remove the key word definitions if RFC 2119 and RFC 8170 are followed.

TODO: Remove the previous comments before submitting

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

## Parameters

The parameters section should summarize any changes to global or module parameters, including any new parameters, introduced by the CIP. All mainnet parameters are tracked in [CIP-13](./cip-13.md). Once a CIP is accepted and deployed to mainnet, CIP-13 MUST be updated with these parameter changes. If there are no parameter changes in the CIP, this section can be omitted.

TODO: Remove the previous comments and update the following table before submitting

| Parameter     | Proposed value | Description                                                                                                                | Changeable via Governance |
|---------------|---------|------------------------------------------------------------------------------------------------------------------------|---------------------------|
| module1.Name1 | ProposedValue1  | Description1                                                            | bool                     |
| module2.Name2 | ProposedValue2  | Description2                                                            | bool                     |

For changes to existing parameters, use the following table:

| Parameter     | Current value | Proposed value | Description  | Changeable via Governance |
|---------------|---------------|----------------|--------------|---------------------------|
| module1.Name1 | CurrentValue1 | ProposedValue1 | Description1 | bool                      |
| module2.Name1 | CurrentValue2 | ProposedValue2 | Description2 | bool                      |

For new parameters the Current value column can be omitted.

## Rationale

The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages.

The current placeholder is acceptable for a draft.

TODO: Remove the previous comments before submitting

## Backwards Compatibility

This section is optional.

All CIPs that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. The CIP must explain how the author proposes to deal with these incompatibilities. CIP submissions without a sufficient backwards compatibility treatise may be rejected outright.

The current placeholder is acceptable for a draft: *"No backward compatibility issues found."*

TODO: Remove the previous comments before submitting

## Test Cases

This section is optional.

The Test Cases section should include expected input/output pairs, but may include a succinct set of executable tests. It should not include project build files. No new requirements may be be introduced here (meaning an implementation following only the Specification section should pass all tests here.)

If the test suite is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/cip-####/`. External links will not be allowed

TODO: Remove the previous comments before submitting

## Reference Implementation

This section is optional.

The Reference Implementation section should include a minimal implementation that assists in understanding or implementing this specification. It should not include project build files. The reference implementation is not a replacement for the Specification section, and the proposal should still be understandable without it.

If the reference implementation is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/cip-####/`. External links will not be allowed.

TODO: Remove the previous comments before submitting

## Security Considerations

All CIPs must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. For example, include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed. CIP submissions missing the "Security Considerations" section will be rejected. An CIP cannot proceed to status "Final" without a Security Considerations discussion deemed sufficient by the reviewers.

The current placeholder is acceptable for a draft.

TODO: Remove the previous comments before submitting

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
