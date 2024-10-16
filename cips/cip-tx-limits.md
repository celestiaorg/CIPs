| cip | TBD(27) |
| - | - |
| title | Block limits for number of PFBs/non-PFBs and transaction sizes |
| description | Set limits for number of PFBs and non-PFBs per block and transaction size |
| author | Josh Stein ([@jcstein](https://github.com/jcstein)), Nina Barbakadze ([@ninabarbakadze](https://github.com/ninabarbakadze)) |
| discussions-to |  <https://forum.celestia.org/t/cip-limit-number-of-pfbs-and-non-pfbs-per-block-increase-transaction-size-limit/1843> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2024-10-16 |

## Abstract

This CIP proposes to set limits for the number of PFBs and non-PFBs per block and set the limit for transaction size. Concretely, the proposal is to set the limits to 600 PFBs and 200 non-PFB transactions per block and set the transaction size limit to 2MiB.

## Specification

1. The number of PFBs per block is limited to 600 by setting `PFBTransactionCap` to 600. `PFBTransactionCap` is the maximum number of PFB messages a block can contain.

1. The number of non-PFB transactions per block is limited to 200 by setting `NonPFBTransactionCap` to 200. `NonPFBTransactionCap` is the maximum number of SDK messages, aside from PFBs, that a block can contain.

It's important to note that these limits are not strictly enforced. While they are defined by the `celestia-app` implementation, a validator could potentially modify the `PrepareProposal` logic, run a custom binary, and produce blocks that exceed the specified limits for PFB or non-PFB transactions.

1. The size of a transaction is limited to 2MiB by setting `MaxTxSize` to 2097152, which is 2MiB in bytes. From version v3 and above, in `CheckTx`, `PrepareProposal`, and `ProcessProposal`, each transaction's size is checked against the `appconsts.MaxTxSize` threshold. This ensures that transactions over the limit are rejected or excluded at all stages, from initial submission to execution.

## Rationale

The rationale for this proposal is twofold:

1. To prevent long block times on the network by limiting the number of PFBs and non-PFB transactions per block. This was initially not considered consensus-breaking, but it has a meaningful effect on users and should be formalized in a CIP.

1. To set the transaction size limit to 2MiB, even with 8MB blocks, to prevent issues with gossiping large transactions. Gossiping an 8MiB transaction without chunking could be detrimental to the network.

These changes affect users significantly and are consensus-breaking, necessitating their inclusion in a CIP.

## Backwards Compatibility

This proposal is meant to be included with v3 and the [Ginger Network Upgrade](./cip-25.md). It is not backwards compatible with v2.

## Security Considerations

This proposal does not introduce any new security risks. However, it does impact network behavior and user experience, which should be carefully considered during implementation.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
