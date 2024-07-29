| cip | 1 |
| - | - |
| title | Celestia Improvement Proposal Process and Guidelines |
| author | Yaz Khoury <yaz@celestia.org> |
| status | Living |
| type | Meta |
| created | 2023-04-13 |

## Table of Contents

* What is a CIP?
* CIP Rationale
* CIP Types
* CIP Work Flow
  * Shepherding a CIP
  * Core CIPs
  * CIP Process
* What belongs in a successful CIP?
* CIP Formats and Templates
* CIP Header Preamble
  * author header
  * discussions-to header
  * type header
  * category header
  * created header
  * requires header
* Linking to External Resources
  * Data Availability Specifications
  * Consensus Layer Specifications
  * Networking Specifications
  * Digital Object Identifier System
* Linking to other CIPs
* Auxiliary Files
* Transferring CIP Ownership
* CIP Editors
* CIP Editor Responsibilities
* Style Guide
  * Titles
  * Descriptions
  * CIP numbers
  * RFC 2119 and RFC 8174
* History
* Copyright

## What is a CIP

CIP stands for Celestia Improvement Proposal. A CIP
is a design document providing information to the
Celestia community, or describing a new feature
for Celestia or its processes or environment.
The CIP should provide a concise technical specification
of the feature and a rationale for the feature. The CIP
author is responsible for building consensus within the
community and documenting dissenting opinions.

## CIP Rationale

We intend CIPs to be the primary mechanisms for proposing
new features, for collecting community technical input on
an issue, and for documenting the design decisions that have
gone into Celestia. Because the CIPs are maintained as text
files in a versioned repository, their revision history is
the historical record of the feature proposal.

For Celestia software clients and core devs, CIPs are a
convenient way to track the progress of their implementation.
Ideally, each implementation maintainer would list the CIPs
that they have implemented. This will give end users a
convenient way to know the current status of a given
implementation or library.

## CIP Types

There are three types of CIP:

* **Standards Track CIP** describes any change that affects
  most or all Celestia implementations, such as a change to
  the network protocol, a change in block or transaction
  validity rules, proposed standards/conventions, or any
  change or addition that affects the interoperability of
  execution environments and rollups using Celestia. Standards
  Track CIPs consist of three parts: a design document,
  an implementation, and (if warranted) an update to the
  formal specification. Furthermore, Standards Track CIPs
  can be broken down into the following categories:
  * **Core**: improvements requiring a consensus fork, as well
    as changes that are not necessarily consensus critical but
    may be relevant to “core dev” discussions (for example,
    validator/node strategy changes).
  * **Data Availability**: improvements to the Data Availability
    layer that while not consensus breaking, would be relevant
    for nodes to upgrade to after.
  * **Networking**: includes improvements around libp2p and the
    p2p layer in general.
  * **Interface**: includes improvements around consensus
    and data availability client API/RPC specifications and standards,
    and also certain language-level standards like method names.
    The label “interface” aligns with the client repository and
    discussion should primarily occur in that repository before
    a CIP is submitted to the CIPs repository.
  * **CRC**: Rollup standards and conventions, including standards
    for rollups such as token standards, name registries, URI
    schemes, library/package formats, and wallet formats that rely
    on the data availability layer for transaction submission to
    the Celestia Network.
* **Meta CIP** describes a process surrounding Celestia or proposes
  a change to (or an event in) a process. Meta CIPs are like
  Standards Track CIPs but apply to areas other than the Celestia
  protocol itself. They may propose an implementation, but not to
  Celestia’s codebase; they often require community consensus; unlike
  Informational CIPs, they are more than recommendations, and users
  are typically not free to ignore them. Examples include procedures,
  guidelines, changes to the decision-making process, and changes to
  the tools or environment used in Celestia development.
* **Informational CIP** describes a Celestia design issue, or
  provides general guidelines or information to the Celestia community,
  but does not propose a new feature. Informational CIPs do not necessarily
  represent Celestia community consensus or a recommendation, so users
  and implementers are free to ignore Informational CIPs or follow their advice.

It is highly recommended that a single CIP contain a single key
proposal or new idea. The more focused the CIP, the more successful
it tends to be. A change to one client doesn’t require a CIP; a
change that affects multiple clients, or defines a standard for
multiple apps to use, does.

A CIP must meet certain minimum criteria. It must be a clear and
complete description of the proposed enhancement. The enhancement
must represent a net improvement. The proposed implementation, if
applicable, must be solid and must not complicate the protocol unduly.

## Celestia Improvement Proposal (CIP) Workflow

### Shepherding a CIP

Parties involved in the process are you, the champion or CIP author,
the CIP editors, and the Celestia Core Developers.

Before diving into writing a formal CIP, make sure your idea stands
out. Consult the Celestia community to ensure your idea is original,
saving precious time by avoiding duplication. We highly recommend
opening a discussion thread on the [Celestia forum](https://forum.celestia.org)
for this purpose.

Once your idea passes the vetting process, your next responsibility
is to present the idea via a CIP to reviewers and all interested
parties. Invite editors, developers, and the community to give their
valuable feedback through the relevant channels. Assess whether the
interest in your CIP matches the work involved in implementing it
and the number of parties required to adopt it. For instance,
implementing a Core CIP demands considerably more effort than a CRC,
necessitating adequate interest from Celestia client teams. Be
aware that negative community feedback may hinder your CIP's
progression beyond the Draft stage.

### Core CIPs

For Core CIPs, you'll need to either provide a client implementation
or persuade clients to implement your CIP, given that client
implementations are mandatory for Core CIPs to reach the Final
stage (see "CIP Process" below).

To effectively present your CIP to client implementers, request a
Celestia CoreDevsCall (CDC) call by posting a comment linking your
CIP on a CoreDevsCall agenda GitHub Issue.

The CoreDevsCall allows client implementers to:

* Discuss the technical merits of CIPs
* Gauge which CIPs other clients will be implementing
* Coordinate CIP implementation for network upgrades

These calls generally lead to a "rough consensus" on which CIPs
should be implemented. Rough Consensus is informed based on the
IETF's [RFC 7282](https://www.rfc-editor.org/rfc/rfc7282) which
is a helpful document to understand how decisions are made in
Celestia CoreDevCalls. This consensus assumes that CIPs are not
contentious enough to cause a network split and are technically
sound. One important excerpt from the document that highlights
based on [Dave Clark's 1992 presentation](http://www.ietf.org/proceedings/24.pdf)
is the following:

> *We reject: kings, presidents and voting.*
  *We believe in: rough consensus and running code.*

:warning: The burden falls on client implementers to estimate
community sentiment, obstructing the technical coordination
function of CIPs and AllCoreDevs calls. As a CIP shepherd,
you can facilitate building community consensus by ensuring
the Celestia forum thread for your CIP encompasses as much
of the community discussion as possible and represents various
stakeholders.

In a nutshell, your role as a champion involves writing the CIP
using the style and format described below, guiding discussions
in appropriate forums, and fostering community consensus around
the idea.

### CIP Process

The standardization process for all CIPs in all tracks follows
the below status:

* **Idea**: A pre-draft idea not tracked within the CIP Repository.
* **Draft**: The first formally tracked stage of a CIP in development.
  A CIP is merged by a CIP Editor into the CIP repository when properly
  formatted.
  * ➡️  Draft: If agreeable, CIP editor will assign the CIP a number
    (generally the issue or PR number related to the CIP) and merge
    your pull request. The CIP editor will not unreasonably deny a CIP.
  * ❌ Draft: Reasons for denying Draft status include being too
    unfocused, too broad, duplication of effort, being technically
    unsound, not providing proper motivation or addressing backwards
    compatibility, or not in keeping with the Celestia values and
    code of conduct.
* **Review**: A CIP Author marks a CIP as ready for and requesting
  Peer Review.
* **Last Call**: The final review window for a CIP before moving to
  Final. A CIP editor assigns Last Call status and sets a review end
  date (last-call-deadline), typically 14 days later.
  * ❌ Review: A Last Call which results in material changes or substantial
    unaddressed technical complaints will cause the CIP to revert
    to Review.
  * ✅ Final: A successful Last Call without material changes or
    unaddressed technical complaints will become Final.
* **Final**: This CIP represents the final standard. A Final CIP
  exists in a state of finality and should only be updated to correct
  errata and add non-normative clarifications. A PR moving a CIP from
  Last Call to Final should contain no changes other than the status
  update. Any content or editorial proposed change should be separate
  from this status-updating PR and committed prior to it.

#### Other Statuses

* **Stagnant**: Any CIP in Draft, Review, or Last Call that remains
  inactive for 6 months or more is moved to Stagnant. Authors or CIP
  Editors can resurrect a proposal from this state by moving it back
  to Draft or its earlier status. If not resurrected, a proposal may
  stay forever in this status.
* **Withdrawn**: The CIP Author(s) have withdrawn the proposed CIP.
  This state has finality and can no longer be resurrected using this
  CIP number. If the idea is pursued at a later date, it is considered
  a new proposal.
* **Living**: A special status for CIPs designed to be continually
  updated and not reach a state of finality. This status caters to
  dynamic CIPs that require ongoing updates.

As you embark on this exciting journey of shaping Celestia's future
with your valuable ideas, remember that your contributions matter.
Your technical knowledge, creativity, and ability to bring people
together will ensure that the CIP process remains engaging, efficient,
and successful in fostering a thriving ecosystem for Celestia.

## What belongs in a successful CIP

A successful Celestia Improvement Proposal (CIP) should consist of
the following parts:

* **Preamble**: RFC 822 style headers containing metadata about the CIP,
  including the CIP number, a short descriptive title (limited to a maximum
  of 44 words), a description (limited to a maximum of 140 words),
  and the author details. Regardless of the category, the title and description
  should not include the CIP number. See below for details.
* **Abstract**: A multi-sentence (short paragraph) technical summary that
  provides a terse and human-readable version of the specification section.
  By reading the abstract alone, someone should be able to grasp the essence
  of what the proposal entails.
* **Motivation (optional)**: A motivation section is crucial for CIPs that
  seek to change the Celestia protocol. It should clearly explain why the
  existing protocol specification is insufficient for addressing the problem
  the CIP solves. If the motivation is evident, this section can be omitted.
* **Specification**: The technical specification should describe the syntax
  and semantics of any new feature. The specification should be detailed
  enough to enable competing, interoperable implementations for any of the
  current Celestia platforms.
* **Parameters**: Summary of any parameters introduced by or changed by the CIP.
* **Rationale**: The rationale elaborates on the specification by explaining
  the reasoning behind the design and the choices made during the design process.
  It should discuss alternative designs that were considered and any related work.
  The rationale should address important objections or concerns raised during
  discussions around the CIP.
* **Backwards Compatibility (optional)**: For CIPs introducing backwards
  incompatibilities, this section must describe these incompatibilities and
  their consequences. The CIP must explain how the author proposes to handle
  these incompatibilities. If the proposal does not introduce any backwards
  incompatibilities, this section can be omitted.
* **Test Cases (optional)**: Test cases are mandatory for CIPs affecting
  consensus changes. They should either be inlined in the CIP as data (such
  as input/expected output pairs) or included in `../assets/cip-###/<filename>`.
  This section can be omitted for non-Core proposals.
* **Reference Implementation (optional)**: This optional section contains
  a reference/example implementation that people can use to better understand
  or implement the specification. This section can be omitted for all CIPs (
  mandatory for Core CIPs to reach the Final stage).
* **Security Considerations**: All CIPs must include a section discussing
  relevant security implications and considerations. This section should
  provide information critical for security discussions, expose risks, and
  be used throughout the proposal's life-cycle. Examples include security-relevant
  design decisions, concerns, significant discussions, implementation-specific
  guidance, pitfalls, an outline of threats and risks, and how they are
  addressed. CIP submissions lacking a "Security Considerations" section
  will be rejected. A CIP cannot reach "Final" status without a Security
  Considerations discussion deemed sufficient by the reviewers.
* **Copyright Waiver**: All CIPs must be in the public domain. The
  copyright waiver MUST link to the license file and use the following
  wording: Copyright and related rights waived via CC0.

## CIP Formats and Templates

CIPs should be written in [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
format. There is a [CIP template](./cip-template.md) to follow.

## CIP Header Preamble

Each CIP must begin with an RFC 822 style header preamble in a
markdown table. This header is also termed “front matter” by Jekyll.
In order to display on the CIP site, the frontmatter must be formatted
in a markdown table. The headers must appear in the following order:

* `cip`: CIP number (this is determined by the CIP editor)
* `title`: The CIP title is a few words, not a complete sentence
* `description`: Description is one full (short) sentence
* `author`: The list of the author’s or authors’ name(s) and/or
  username(s), or name(s) and email(s). Details are below.
* `discussions-to`: The url pointing to the official discussion thread
* `status`: Draft, Review, Last Call, Final, Stagnant, Withdrawn, Living
* `last-call-deadline`: The date last call period ends on (Optional field,
  only needed when status is Last Call)
* `type`: One of Standards Track, Meta, or Informational
* `category`: One of Core, Data Availability, Networking, Interface, or
  CRC (Optional field, only needed for Standards Track CIPs)
* `created`: Date the CIP was created on
* `requires`: CIP number(s) (Optional field)
* `withdrawal-reason`: A sentence explaining why the CIP was withdrawn.
  (Optional field, only needed when status is Withdrawn)

Headers that permit lists must separate elements with commas.

Headers requiring dates will always do so in the format of ISO 8601 (yyyy-mm-dd).

### `author` header

The `author` header lists the names, email addresses or usernames of the
authors/owners of the CIP. Those who prefer anonymity may use a username
only, or a first name and a username. The format of the `author` header
value must be:

> Random J. User &lt;<address@dom.ain>&gt;

or

> Random J. User ([@username](https://github.com/username))

or

> Random J. User ([@username](https://github.com/username) &lt;<address@dom.ain>&gt;

if the email address and/or GitHub username is included, and

> Random J. User

if neither the email address nor the GitHub username are given.

At least one author must use a GitHub username, in order to get
notified on change requests and have the capability to approve
or reject them.

### `discussions-to` header

While an CIP is a draft, a `discussions-to` header will indicate
the URL where the CIP is being discussed.

The preferred discussion URL is a topic on [Celestia Forums](https://forum.celestia.org/).
The URL cannot point to Github pull requests, any URL which is
ephemeral, and any URL which can get locked over time (i.e. Reddit topics).

### `type` header

The `type` header specifies the type of CIP: Standards Track,
Meta, or Informational. If the track is Standards please include
the subcategory (core, networking, interface, or CRC).

### `category` header

The `category` header specifies the CIP's category. This is
required for standards-track CIPs only.

### `created` header

The `created` header records the date that the CIP was
assigned a number. Both headers should be in yyyy-mm-dd
format, e.g. 2001-08-14.

### `requires` header

CIPs may have a `requires` header, indicating the CIP
numbers that this CIP depends on. If such a dependency
exists, this field is required.

A `requires` dependency is created when the current CIP
cannot be understood or implemented without a concept or
technical element from another CIP. Merely mentioning another
CIP does not necessarily create such a dependency.

## Linking to External Resources

Other than the specific exceptions listed below, links to
external resources **SHOULD NOT** be included. External
resources may disappear, move, or change unexpectedly.

The process governing permitted external resources is
described in [CIP-3](./cip-3.md).

### Data Availability Client Specifications

Links to the Celestia Data Availability Client Specifications
may be included using normal markdown syntax, such as:

```markdown
[Celestia Data Availability Client Specifications](https://github.com/celestiaorg/celestia-specs)
```

Which renders to:

[Celestia Data Availability Client Specifications](https://github.com/celestiaorg/celestia-specs)

### Consensus Layer Specifications

Links to specific commits of files within the Celestia
Consensus Layer Specifications may be included using normal
markdown syntax, such as:

```markdown
[Celestia Consensus Layer Client Specifications](https://github.com/celestiaorg/celestia-specs)
```

Which renders to:

[Celestia Consensus Layer Client Specifications](https://github.com/celestiaorg/celestia-specs)

### Networking Specifications

Links to specific commits of files within the Celestia
Networking Specifications may be included using normal
markdown syntax, such as:

```markdown
[Celestia P2P Layer Specifications](https://github.com/celestiaorg/celestia-specs)
```

Which renders as:

[Celestia P2P Layer Specifications](https://github.com/celestiaorg/celestia-specs)

### Digital Object Identifier System

Links qualified with a Digital Object Identifier (DOI)
may be included using the following syntax:

````markdown
This is a sentence with a footnote.[^1]

[^1]:
    ```csl-json
    {
      "type": "article",
      "id": 1,
      "author": [
        {
          "family": "Khoury",
          "given": "Yaz"
        }
      ],
      "DOI": "00.0000/a00000-000-0000-y",
      "title": "An Awesome Article",
      "original-date": {
        "date-parts": [
          [2022, 12, 31]
        ]
      },
      "URL": "https://sly-hub.invalid/00.0000/a00000-000-0000-y",
      "custom": {
        "additional-urls": [
          "https://example.com/an-interesting-article.pdf"
        ]
      }
    }
    ```
````

Which renders to:

<!-- markdownlint-capture -->
<!-- markdownlint-disable code-block-style -->

This is a sentence with a footnote.[^1]

[^1]:
    ```csl-json
    {
      "type": "article",
      "id": 1,
      "author": [
        {
          "family": "Khoury",
          "given": "Yaz"
        }
      ],
      "DOI": "00.0000/a00000-000-0000-y",
      "title": "An Awesome Article",
      "original-date": {
        "date-parts": [
          [2022, 12, 31]
        ]
      },
      "URL": "https://sly-hub.invalid/00.0000/a00000-000-0000-y",
      "custom": {
        "additional-urls": [
          "https://example.com/an-interesting-article.pdf"
        ]
      }
    }
    ```

<!-- markdownlint-restore -->
<!-- markdownlint-disable code-block-style -->

See the [Citation Style Language Schema](https://resource.citationstyles.org/schema/v1.0/input/json/csl-data.json)
for the supported fields. In addition to passing validation
against that schema, references must include a DOI and at
least one URL.

The top-level URL field must resolve to a copy of the referenced
document which can be viewed at zero cost. Values under
`additional-urls` must also resolve to a copy of the
referenced document, but may charge a fee.

## Linking to other CIPs

References to other CIPs should follow the format `CIP-N`
where `N` is the CIP number you are referring to. Each CIP
that is referenced in an CIP **MUST** be accompanied by a
relative markdown link the first time it is referenced, and
**MAY** be accompanied by a link on subsequent references.
The link **MUST** always be done via relative paths so that
the links work in this GitHub repository, forks of this repository,
the main CIPs site, mirrors of the main CIP site, etc.
For example, you would link to this CIP as `./cip-1.md`.

## Auxiliary Files

Images, diagrams and auxiliary files should be included in a
subdirectory of the `assets` folder for that CIP as follows:
`assets/cip-N` (where **N** is to be replaced with the CIP
number). When linking to an image in the CIP, use relative
links such as `../assets/cip-1/image.png`.

## Transferring CIP Ownership

It occasionally becomes necessary to transfer ownership of CIPs
to a new champion. In general, we'd like to retain the original
author as a co-author of the transferred CIP, but that's really
up to the original author. A good reason to transfer ownership
is because the original author no longer has the time or interest
in updating it or following through with the CIP process, or has
fallen off the face of the 'net (i.e. is unreachable or isn't
responding to email). A bad reason to transfer ownership is because
you don't agree with the direction of the CIP. We try to build
consensus around an CIP, but if that's not possible, you can
always submit a competing CIP.

If you are interested in assuming ownership of an CIP, send a
message asking to take over, addressed to both the original author
and the CIP editor. If the original author doesn't respond to the
email in a timely manner, the CIP editor will make a unilateral
decision (it's not like such decisions can't be reversed :)).

## CIP Editors

The current CIP editors are

* Yaz Khoury ([@YazzyYaz](https://github.com/YazzyYaz))
* Josh Stein ([@jcstein](https://github.com/jcstein))
* Ethan Buchman ([@ebuchman](https://github.com/ebuchman))
* Rootul Patel ([@rootulp](https://github.com/rootulp))

If you would like to become a CIP editor, please check [CIP-2](./cip-2.md).

## CIP Editor Responsibilities

For each new CIP that comes in, an editor does the following:

* Read the CIP to check if it is ready: sound and complete. The ideas
  must make technical sense, even if they don't seem likely to get to
  final status.
* The title should accurately describe the content.
* Check the CIP for language (spelling, grammar, sentence
  structure, etc.), markup (GitHub flavored Markdown), code style

If the CIP isn't ready, the editor will send it back to the
author for revision, with specific instructions.

Once the CIP is ready for the repository, the CIP editor will:

* Assign an CIP number (generally the next unused CIP number, but the decision
  is with the editors)
* Merge the corresponding [pull request](https://github.com/celestiaorg/CIPs/pulls)
* Send a message back to the CIP author with the next step.

Many CIPs are written and maintained by developers with write
access to the Celestia codebase. The CIP editors monitor CIP
changes, and correct any structure, grammar, spelling, or markup
mistakes we see.

The editors don't pass judgment on CIPs. We merely do the
administrative & editorial part.

## Style Guide

### Titles

The `title` field in the preamble:

* Should not include the word "standard" or any variation thereof; and
* Should not include the CIP's number.

### Descriptions

The `description` field in the preamble:

* Should not include the word "standard" or any variation thereof; and
* Should not include the CIP's number.

### CIP numbers

When referring to an CIP with a `category` of `CRC`, it must be written
in the hyphenated form `CRC-X` where `X` is that CIP's assigned number.
When referring to CIPs with any other `category`, it must be written in
the hyphenated form `CIP-X` where `X` is that CIP's assigned number.

### RFC 2119 and RFC 8174

CIPs are encouraged to follow [RFC 2119](https://www.ietf.org/rfc/rfc2119.html)
and [RFC 8174](https://www.ietf.org/rfc/rfc8174.html) for terminology
and to insert the following at the beginning of the Specification section:

> The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
  "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
  "OPTIONAL" in this document are to be interpreted as described in RFC
  2119 and RFC 8174.

## History

This document was derived heavily from [Ethereum's EIP Process](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1.md)
written by Hudson Jameson which is derived from [Bitcoin's BIP-0001](https://github.com/bitcoin/bips)
written by Amir Taaki which in turn was derived from [Python's PEP-0001](https://peps.python.org/).
In many places text was simply copied and modified. Although the PEP-0001
text was written by Barry Warsaw, Jeremy Hylton, and David Goodger, they
are not responsible for its use in the Celestia Improvement Process, and
should not be bothered with technical questions specific to Celestia or
the CIP. Please direct all comments to the CIP editors.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
