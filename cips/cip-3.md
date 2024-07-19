```
---
cip: 3
title: Process for Approving External Resources
description: Requirements and process for allowing new origins of external resources
author: Yaz Khoury (@YazzyYaz)
discussions-to: https://forum.celestia.org
status: Draft
type: Meta
created: 2023-04-13
requires: 1
---
```
<!-- markdownlint-disable MD013 -->

## Abstract

Celestia improvement proposals (CIPs) occasionally link to resources external to this repository. This document sets out the requirements for origins that may be linked to, and the process for approving a new origin.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

### Definitions

* **Link**: Any method of referring to a resource, including: markdown links, anchor tags (`<a>`), images, citations of books/journals, and any other method of referencing content not in the current resource.
* **Resource**: A web page, document, article, file, book, or other media that contains content.
* **Origin**: A publisher/chronicler of resources, like a standards body (eg. w3c) or a system of referring to documents (eg. Digital Object Identifier System).

### Requirements for Origins

Permissible origins **MUST** provide a method of uniquely identifying a particular revision of a resource. Examples of such methods may include git commit hashes, version numbers, or publication dates.

Permissible origins **MUST** have a proven history of availability. A origin existing for at least ten years and reliably serving resources would be sufficient—but not necessary—to satisfy this requirement.

Permissible origins **MUST NOT** charge a fee for accessing resources.

### Origin Removal

Any approved origin that ceases to satisfy the above requirements **MUST** be removed from [CIP-1](./cip-1.md). If a removed origin later satisfies the requirements again, it MAY be re-approved by following the process described in [Origin Approval](#origin-approval).

Finalized CIPs (eg. those in the `Final` or `Withdrawn` statuses) **SHOULD NOT** be updated to remove links to these origins.

Non-Finalized CIPs **MUST** remove links to these origins before changing statuses.

### Origin Approval

Should the editors determine that an origin meets the requirements above, CIP-1 **MUST** be updated to include:

* The name of the allowed origin;
* The permitted markup and formatting required when referring to resources from the origin; and
* A fully rendered example of what a link should look like.

## Rationale

### Unique Identifiers

If it is impossible to uniquely identify a version of a resource, it becomes impractical to track changes, which makes it difficult to ensure immutability.

### Availability

If it is possible to implement a standard without a linked resource, then the linked resource is unnecessary. If it is impossible to implement a standard without a linked resource, then that resource must be available for implementers.

### Free Access

The Celestia ecosystem is built on openness and free access, and the CIP process should follow those principles.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
<!-- markdownlint-enable MD013 -->
