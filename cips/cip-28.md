| cip | 28 |
| - | - |
| title | Transaction size limit |
| description | Set limit for transaction size |
| author | Josh Stein ([@jcstein](https://github.com/jcstein)), Nina Barbakadze ([@ninabarbakadze](https://github.com/ninabarbakadze)), Rootul Patel ([@rootulp](https://github.com/rootulp)) |
| discussions-to | <https://forum.celestia.org/t/cip-limit-number-of-pfbs-and-non-pfbs-per-block-increase-transaction-size-limit/1843> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2024-10-16 |

## Abstract

This CIP proposes to set the limit for transaction size. The proposal is to set the transaction size limit to 2MiB. Setting the transaction size limit is consensus-breaking.

## Specification

1. Transaction size is limited to 2MiB by setting the versioned parameter `MaxTxSize` to 2097152, which is 2MiB in bytes. From version v3 and above, in `CheckTx`, `PrepareProposal`, and `ProcessProposal`, each transaction's size is checked against the `appconsts.MaxTxSize` threshold. This ensures that transactions over the limit are rejected or excluded at all stages, from initial submission to execution.

## Rationale

The rationale for this proposal is to set the transaction size limit to 2MiB, even with 8MiB blocks, to prevent issues with gossiping large transactions. Gossiping an 8MiB transaction without chunking could be detrimental to the network. This is a consensus-breaking change.

## Backwards Compatibility

This proposal is meant to be included with v3 and the [Ginger Network Upgrade](./cip-25.md). It is a consensus-breaking change.

## Security Considerations

This proposal does not introduce any new security risks. However, it does impact network behavior and user experience, which should be carefully considered during implementation.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
