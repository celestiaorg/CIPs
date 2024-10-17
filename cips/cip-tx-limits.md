| cip | TBD(27) |
| - | - |
| title | Block limits for number of PFBs/non-PFBs and transaction size |
| description | Set limits for number of PFBs and non-PFBs per block and transaction size |
| author | Josh Stein ([@jcstein](https://github.com/jcstein)), Nina Barbakadze ([@ninabarbakadze](https://github.com/ninabarbakadze)) |
| discussions-to |  <https://forum.celestia.org/t/cip-limit-number-of-pfbs-and-non-pfbs-per-block-increase-transaction-size-limit/1843> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2024-10-16 |

## Abstract

This CIP proposes to set limits for the number of PayForBlobs (PFBs) messages and non-PFBs messages per block and set the limit for transaction size. The proposal is to set the limits to 600 PFBs messages and 200 non-PFBs messages per block and set the transaction size limit to 2MiB. Setting PFB and non-PFBs limits is not consensus-breaking. Setting the transaction size limit is consensus-breaking.

## Specification

1. The number of PFBs per block is limited to 600 by setting `MaxPFBMessages` to 600.

1. The number of non-PFBs messages per block is limited to 200 by setting `MaxNonPFBMessages` to 200.

1. It's important to note that these limits are not strictly enforced. While they are defined by the `celestia-app` implementation, a validator could potentially modify the `PrepareProposal` logic, run a custom binary, and produce blocks that exceed the specified limits for PFB or non-PFBs transactions.

1. Transaction size is limited to 2MiB by setting the versioned parameter `MaxTxSize` to 2097152, which is 2MiB in bytes. From version v3 and above, in `CheckTx`, `PrepareProposal`, and `ProcessProposal`, each transaction's size is checked against the `appconsts.MaxTxSize` threshold. This ensures that transactions over the limit are rejected or excluded at all stages, from initial submission to execution.

## Rationale

The rationale for this proposal is twofold:

1. To prevent long block times on the network by limiting the number of PFBs and non-PFBs messages per block. This was initially not considered consensus-breaking, but it has a meaningful effect on users and should be formalized in a CIP. 
    1. The limits for PFBs (Pay for Blob transactions) and non-PFBs per block were established using the following process:
        1. Benchmarks were conducted in [PR 3904 on celestia-app](https://github.com/celestiaorg/celestia-app/pull/3904) to measure ABCI method processing times for different transaction types.
        1. A target processing time of ~0.25 seconds was set to prevent long block times.
        1. Based on these benchmarks, run on the recommended validator configuration (4 CPU, 16GB RAM), a soft limiter was implemented in the prepare proposal stage.
        1. This limiter sets specific caps on the number of PFB and non-PFB messages allowed in a default block to meet the processing time target.
        1. While default blocks adhere to these limits, blocks exceeding them can still be included if they reach consensus, ensuring flexibility.
    1. This approach balances network efficiency with block processing speed, directly informing the PFB and non-PFB limits now in place.

1. To set the transaction size limit to 2MiB, even with 8MiB blocks, to prevent issues with gossiping large transactions. Gossiping an 8MiB transaction without chunking could be detrimental to the network. This is a consensus-breaking change.

## Backwards Compatibility

This proposal is meant to be included with v3 and the [Ginger Network Upgrade](./cip-25.md). It is backwards compatible with v2.

## Security Considerations

This proposal does not introduce any new security risks. However, it does impact network behavior and user experience, which should be carefully considered during implementation.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
