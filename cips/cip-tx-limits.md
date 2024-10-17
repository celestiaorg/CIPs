| cip | TBD(28) |
| - | - |
| title | Transaction size limit |
| description | Set limit for transaction size |
| author | Josh Stein ([@jcstein](https://github.com/jcstein)), Nina Barbakadze ([@ninabarbakadze](https://github.com/ninabarbakadze)) |
| discussions-to | <https://forum.celestia.org/t/cip-limit-number-of-pfbs-and-non-pfbs-per-block-increase-transaction-size-limit/1843> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2024-10-16 |

## Abstract

This CIP proposes to set the limit for transaction size to 2MiB. This is a consensus-breaking change.

## Specification

1. Transaction size is limited to 2MiB by setting the versioned parameter `MaxTxSize` to 2097152 (2MiB in bytes).
2. From version v3 and above, in `CheckTx`, `PrepareProposal`, and `ProcessProposal`, each transaction's size is checked against the `appconsts.MaxTxSize` threshold.

## Rationale

To set the transaction size limit to 2MiB, even with 8MiB blocks, to prevent issues with gossiping large transactions. Gossiping an 8MiB transaction without chunking could be detrimental to the network.

## Backwards Compatibility

This proposal is meant to be included with v3 and the Ginger Network Upgrade. It is a consensus-breaking change.

## Security Considerations

This proposal does not introduce new security risks but impacts network behavior and user experience.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
