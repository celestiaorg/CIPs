---
title: Packet Forward Middleware
description: Adopt Packet Forward Middleware for multi-hop IBC and path unwinding
author: Alex Cheng (@akc2267)
discussions-to: URL
status: Draft
type: Standards Track
category: Core
created: Date created on, in ISO 8601 (yyyy-mm-dd) format
---
<!-- markdownlint-disable MD013 -->

> Note:
**READ CIP-1 BEFORE USING THIS TEMPLATE!**
This is the suggested template for new CIPs. After you have filled in the requisite fields, please delete these comments. Note that an CIP number will be assigned by an editor. When opening a pull request to submit your CIP, please use an abbreviated title in the filename, `cip-draft_title_abbrev.md`. The title should be 44 characters or less. It should not repeat the CIP number in title, irrespective of the category.

**TODO: Remove the note before submitting**

## Abstract

This CIP integrates Packet Forward Middleware, the IBC middleware that enables multi-hop IBC and path unwinding to preserve fungibility for IBC-transferred tokens.

## Specification

The Specification section should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow competing, interoperable implementations for any of the current Celestia clients (celestia-node, celestia-core, celestia-app).

It is recommended to follow RFC 2119 and RFC 8170. Do not remove the key word definitions if RFC 2119 and RFC 8170 are followed.

**TODO: Remove the previous comments before submitting**

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

Celestia MUST import and integrate Packet Forward Middleware. This integration SHOULD use sensible defaults for the following configs: [Retries On Timeout, Timeout Period, Refund Timeout, Fee Percentage].

## Rationale

**TODO: What are the recommended defaults?**

The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages.

The current placeholder is acceptable for a draft.

**TODO: Remove the previous comments before submitting**

## Backwards Compatibility

This section is optional.

All CIPs that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. The CIP must explain how the author proposes to deal with these incompatibilities. CIP submissions without a sufficient backwards compatibility treatise may be rejected outright.

The current placeholder is acceptable for a draft: *"No backward compatibility issues found."*

**TODO: Remove the previous comments before submitting**

## Test Cases

This section is optional.

The Test Cases section should include expected input/output pairs, but may include a succinct set of executable tests. It should not include project build files. No new requirements may be be introduced here (meaning an implementation following only the Specification section should pass all tests here.)

If the test suite is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/cip-####/`. External links will not be allowed

**TODO: Remove the previous comments before submitting**

## Reference Implementation

This section is optional.

The Reference Implementation section should include a minimal implementation that assists in understanding or implementing this specification. It should not include project build files. The reference implementation is not a replacement for the Specification section, and the proposal should still be understandable without it.

If the reference implementation is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/cip-####/`. External links will not be allowed.

**TODO: Remove the previous comments before submitting**

## Security Considerations

All CIPs must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. For example, include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed. CIP submissions missing the "Security Considerations" section will be rejected. An CIP cannot proceed to status "Final" without a Security Considerations discussion deemed sufficient by the reviewers.

The current placeholder is acceptable for a draft.

**TODO: Remove the previous comments before submitting**

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
<!-- markdownlint-disable MD013 -->
