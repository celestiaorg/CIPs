| cip | XX (assigned by Editors) |
| - | - |
| title | Nonce Aware Mempool |
| description | Mempool to prioritize transactions where nonce takes presedence |
| author | @ninabarbakadze |
| discussions-to | TODO: post discussions |
| status | Draft |
| type | Standards Track, Meta, or Informational |
| category | Core, Data Availability, Networking, Interface, or CRC. Only required for Standards Track. Otherwise, remove this field. |
| created | Date created on, in ISO 8601 (2024-09-20) format |

## Abstract

To improve transaction submission reliability, we propose implementing a nonce-aware priority mempool. This approach aims to reduce transaction eviction likelihood by ordering txs by nonce and priority, ensuring high-priority transactions are processed sooner while maintaining nonce order.

## Specification

The Specification section should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow competing, interoperable implementations for any of the current Celestia clients (celestia-node, celestia-core, celestia-app).

It is recommended to follow RFC 2119 and RFC 8170. Do not remove the key word definitions if RFC 2119 and RFC 8170 are followed.

TODO: Remove the previous comments before submitting

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

## Rationale

The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages.

The current placeholder is acceptable for a draft.

TODO: Remove the previous comments before submitting

## Backwards Compatibility

This feature is ABCI breaking and tendermint API breaking.

## Test Cases

This section is optional.

The Test Cases section should include expected input/output pairs, but may include a succinct set of executable tests. It should not include project build files. No new requirements may be be introduced here (meaning an implementation following only the Specification section should pass all tests here.)

If the test suite is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/cip-####/`. External links will not be allowed

TODO: Remove the previous comments before submitting

## Reference Implementation

## Security Considerations

Potential DOS attack. Users can keep increasing the fee and cause excessive transaction resending.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
