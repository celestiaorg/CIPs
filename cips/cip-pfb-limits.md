| cip | TBD(27) |
| - | - |
| title | Block limits for number of PFBs and non-PFBs |
| description | Set limits for number of PFBs and non-PFBs per block |
| author | Josh Stein ([@jcstein](https://github.com/jcstein)), Nina Barbakadze ([@ninabarbakadze](https://github.com/ninabarbakadze)), rach-id ([@rach-id](https://github.com/rach-id)), Rootul Patel ([@rootulp](https://github.com/rootulp)) |
| discussions-to | <https://forum.celestia.org/t/cip-limit-number-of-pfbs-and-non-pfbs-per-block-increase-transaction-size-limit/1843> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2024-10-16 |

## Abstract

This CIP proposes to set limits for the number of PayForBlobs (PFBs) messages and non-PFBs messages per block. The proposal is to set the limits to 600 PFBs messages and 200 non-PFB messages per block. Setting PFB and non-PFBs limits is not consensus-breaking.

## Specification

1. The number of PFBs per block is limited to 600 by setting `MaxPFBMessages` to 600.
1. The number of non-PFBs messages per block is limited to 200 by setting `MaxNonPFBMessages` to 200.
1. It's important to note that these limits are not strictly enforced. While they are defined by the `celestia-app` implementation, a validator could potentially modify the `PrepareProposal` logic, run a custom binary, and produce blocks that exceed the specified limits for PFB or non-PFBs transactions.

## Rationale

The rationale for this proposal is to prevent long block times on the network by limiting the number of PFBs and non-PFB messages per block. This is not consensus-breaking but it has a meaningful effect on users and should be formalized in a CIP.

1. The limits for PFBs (Pay for Blob transactions) and non-PFBs per block were established using the following process:
    1. Benchmarks were conducted in [PR 3904 on celestia-app](https://github.com/celestiaorg/celestia-app/pull/3904) to measure ABCI method processing times for different transaction types.
    1. A target processing time of ~0.25 seconds was set to prevent long block times.
    1. Based on these benchmarks run on the recommended validator configuration (4 CPU, 16GB RAM), a soft limiter was implemented in the prepare proposal stage.
    1. This limiter sets specific caps on the number of PFB and non-PFB messages allowed in a default block to meet the processing time target.
    1. While default blocks adhere to these limits, blocks exceeding them can still be included if they reach consensus, ensuring flexibility.
1. This approach balances network efficiency with block processing speed, directly informing the PFB and non-PFB limits now in place.

## Backwards Compatibility

This proposal is meant to be included with v3 and the [Ginger Network Upgrade](./cip-25.md). It is backwards compatible with v2.

## Security Considerations

This proposal does not introduce any new security risks. However, it does impact network behavior and user experience, which should be carefully considered during implementation.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
