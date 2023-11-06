---
title: Rename data availability to data publication
description: Renaming data avaiability to data publication to better reflect the message
author: msfew (@fewwwww) <msfew@hyperoracle.io>
discussions-to: URL
status: Draft
type: Informational
created: 2023-11-06
---

## Abstract

The term `data availability` isn't as straightforward as it should be and could lead to misunderstandings within the community. To address this, this CIP proposes replacing `data availability` with `data publication`.

## Motivation

The term `data availability` has caused confusion within the community due to its lack of intuitive clarity. For instance, in Celestia's Glossary, there isn't a clear definition of `data availability`; instead, it states that `data availability` addresses the question of whether this data has been published. Additionally, numerous community members have misinterpreted `data availability` as meaning `data storage`.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

The term `data availability` is RECOMMENDED to be renamed to `data publication`.

## Rationale

Motivations:
- `Data publication` aligns more precisely with the intended meaning, which revolves around whether data has been published.
- The community already favors and commonly uses the term `data publication`.
- `Data publication` maintains a similar structure to `data availability`, making it easier for those familiar with the latter term to transition.

Alternative designs:
- `Proof of publication`: While intuitive, it differs in structure from `data availability` and may be too closely associated with terms like `proof of work`, potentially causing confusion within consensus-related mechanisms.
- `Data availability proof`: While logically coherent, it may create issues when used in conjunction with other terms, as the emphasis falls on "proof". For instance, "verify a rollup's data availability" and "verify a rollup's data availability proof" might not refer to the same concept.

## Backwards Compatibility

No backward compatibility issues found.

## Security Considerations

No security issues found.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
