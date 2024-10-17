| cip | TBD(27) |
| - | - |
| title | Block limits for number of PFBs and non-PFBs |
| description | Set limits for number of PFBs and non-PFBs per block |
| author | Josh Stein ([@jcstein](https://github.com/jcstein)), Nina Barbakadze ([@ninabarbakadze](https://github.com/ninabarbakadze)) |
| discussions-to | <https://forum.celestia.org/t/cip-limit-number-of-pfbs-and-non-pfbs-per-block-increase-transaction-size-limit/1843> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2024-10-16 |

## Abstract

This CIP proposes to set limits for the number of PayForBlobs (PFBs) messages and non-PFBs messages per block. The proposal is to set the limits to 600 PFBs messages and 200 non-PFBs messages per block.

## Specification

1. The number of PFBs per block is limited to 600 by setting `MaxPFBMessages` to 600.
2. The number of non-PFBs messages per block is limited to 200 by setting `MaxNonPFBMessages` to 200.
3. These limits are soft limits implemented in the `PrepareProposal` stage.

## Rationale

To prevent long block times on the network by limiting the number of PFBs and non-PFBs messages per block. Limits were established based on benchmarks to achieve a target processing time of ~0.25 seconds.

## Backwards Compatibility

This proposal is meant to be included with v3 and the Ginger Network Upgrade. It is backwards compatible with v2.

## Security Considerations

This proposal does not introduce new security risks but impacts network behavior and user experience.

## Copyright
Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
