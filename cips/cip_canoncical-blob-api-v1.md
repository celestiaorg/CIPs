---
title: Canonical Blob API v1
description: This specifies the canonical API for interacting with Celestia's data availability layer.
author: a comma separated list of the author’s or authors’ name + GitHub username (in parenthesis), or name and email (in angle brackets). Example, FirstName LastName (@GitHubUsername), FirstName LastName foo@bar.com, FirstName (@GitHubUsername) and GitHubUsername (@GitHubUsername)
discussions-to: https://github.com/celestiaorg/celestia-node/discussions/3517
status: Draft
type: Standards Track
category: Interface
created: 2024-07-15
requires: CIP number(s). Only required when you reference an CIP in the `Specification` section. Otherwise, remove this field.
---

<!-- URL snippets for perma links -->
<!--  -->
<!-- commit hash for perma links:  -->
<!-- example link:  -->



## Abstract
This CIP proposes a canonical API specification, hereby referred to as v1 (or canonical Blob API v1), to address the lack of a complete specification and some user experience issues in the current node RPC API (referred to as beta API). 
This new API will provide an implementation-independent specification in form of a concrete Interface Definition Language (IDL) or API definition. 
The IDL of choice here is protocol buffers (protobuf) combined with gRPC services. 

## Motivation

The current API for interacting with Celestia's data availability layer has a few shortcomings that result from the lack of a full specification, the lack of developer feedback, and the lack of a clear user stories.

The v1 is motivated to address these issues by these specific points: 

- The canonical Blob API v1 has been developed with extensive user input and feedback, ensuring it meets user requirements more effectively.
- The v1 API is designed to be language-agnostic, enhancing its usability across various programming languages and platforms.
- Clear definitions and precise specifications in the new API eliminate ambiguities, leading to a better developer experience by providing predictable and well-defined behavior.
- Comprehensive documentation accompanies the new API, clearly explaining its usage and behavior to improve user experience. 
- A detailed specification provides users with a clear understanding of the API's intended behavior, reducing uncertainty.
- The new API is informed by well-defined user stories and use-cases, setting clear expectations for developers interacting with Celestia's DA layer. 
 
## Specification

Find the full protobuf definitions in the [proto](./proto) directory.

TODO: define expected behaviour for each service


### Common Types

These are types used across multiple services and are defined in the `common` package.

#### Error Messages
[error.proto](../assets/cip-api-v1/proto/common/error.proto)

TODO: Maybe have errors per service instead of global errors?


#### Data Retrieval Options
[retrieval_options.proto](../assets/cip-api-v1/proto/common/retrieval_options.proto)


#### Transaction Options
[tx_config.proto](../assets/cip-api-v1/proto/common/tx_config.proto)



### Header

#### Types
[header.proto](../assets/cip-api-v1/proto/header/header.proto)



#### Service

[header_service.proto](../assets/cip-api-v1/proto/header/header_service.proto)


### Blob Service

#### Types
[blob.proto](../assets/cip-api-v1/proto/blob/blob.proto)


#### Service

[blob_service.proto](../assets/cip-api-v1/proto/blob/blob_service.proto)



### Share Service

#### Types
[share.proto](../assets/cip-api-v1/proto/share/share.proto)



#### Service
[share_service.proto](../assets/cip-api-v1/proto/share/share_service.proto)


### Bad Encoding Fraud Proofs Service

#### Types

[befp.proto](./proto/befp/befp.proto)

#### Service

[befp_service.proto](./proto/befp/befp_service.proto)


## Rationale

- TODO add rationale for changes to current API
  - focus on blob, header, share, and fraud service
  - access, or lack thereof, to other state machine related queries / tx submission 
- TODO provide rationale for protobuf + grpc (break out into its own CIP if controversial)
- TODO: add reference to user stories / use-cases
- add rationale for befp vs "fraud" service: https://github.com/celestiaorg/celestia-node/discussions/3517#discussioncomment-10051462

## Backwards Compatibility

The canonical Blob API v1 is not backwards compatible with the current beta API.
Hence, the current beta API will be deprecated and eventually removed from the Celestia node software.
Parts of the current API may continue to be supported as form of an internal API, but will not be exposed publicly to developers. 

TODO: add more specif timeline for deprecation and removal

## Test Cases

This section is optional.

The Test Cases section should include expected input/output pairs, but may include a succinct set of executable tests. It should not include project build files. No new requirements may be be introduced here (meaning an implementation following only the Specification section should pass all tests here.)

If the test suite is too large to reasonably be included inline, then consider adding it as one or more files in ../assets/cip-####/. External links will not be allowed

TODO: Remove the previous comments before submitting
## Reference Implementation



## Security Considerations

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).

