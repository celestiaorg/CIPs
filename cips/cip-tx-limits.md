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

1. Set the versioned parameter `MaxTxSize` to 2097152 (2MiB in bytes).
2. From version v3 and above, enforce this limit in `CheckTx`, `PrepareProposal`, and `ProcessProposal`.
3. Transactions exceeding this limit will be rejected or excluded at all stages, from initial submission to execution.

## Rationale

1. To prevent issues with gossiping large transactions, even with 8MiB blocks.
2. Gossiping an 8MiB transaction without chunking could be detrimental to the network.
3. This change ensures network stability and efficient transaction processing.

## Backwards Compatibility

This proposal is meant to be included with v3 and the [Ginger Network Upgrade](./cip-25.md). It is a consensus-breaking change.

## Security Considerations

While this proposal doesn't introduce new security risks, it significantly impacts network behavior and transaction processing, which must be carefully considered during implementation.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
