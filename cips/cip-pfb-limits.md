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

This CIP proposes to set limits for the number of PayForBlobs (PFBs) messages and non-PFBs messages per block. The proposal is to set the limits to 600 PFBs messages and 200 non-PFBs messages per block. Setting PFB and non-PFBs limits is not consensus-breaking.

## Specification

1. Set `MaxPFBMessages` to 600, limiting the number of PFBs per block to 600.
2. Set `MaxNonPFBMessages` to 200, limiting the number of non-PFBs messages per block to 200.
3. These limits are implemented as soft limits in the `PrepareProposal` stage of the `celestia-app`.
4. Validators can potentially modify the `PrepareProposal` logic and produce blocks exceeding these limits.

## Rationale

1. To prevent long block times by limiting PFBs and non-PFBs messages per block.
2. Limits were established based on benchmarks in [PR 3904](https://github.com/celestiaorg/celestia-app/pull/3904):
   - Target processing time: ~0.25 seconds
   - Benchmarks run on recommended validator configuration (4 CPU, 16GB RAM)
   - Soft limiter implemented in prepare proposal stage
3. This approach balances network efficiency with block processing speed.
4. While initially not considered consensus-breaking, it has a meaningful effect on users and should be formalized.

## Backwards Compatibility

This proposal is meant to be included with v3 and the [Ginger Network Upgrade](./cip-25.md). It is backwards compatible with v2.

## Security Considerations

This proposal does not introduce new security risks but impacts network behavior and user experience.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
