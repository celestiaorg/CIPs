| cip | 28 |
| - | - |
| title | Transaction size limit |
| description | Set limit for transaction size |
| author | Josh Stein ([@jcstein](https://github.com/jcstein)), Nina Barbakadze ([@ninabarbakadze](https://github.com/ninabarbakadze)), Rootul Patel ([@rootulp](https://github.com/rootulp)) |
| discussions-to | <https://forum.celestia.org/t/cip-limit-number-of-pfbs-and-non-pfbs-per-block-increase-transaction-size-limit/1843> |
| status | Last Call |
| last-call-deadline | 2024-10-22 |
| type | Standards Track |
| category | Core |
| created | 2024-10-16 |

## Abstract

This CIP proposes to set the limit for transaction size. The proposal is to set the transaction size limit to 2MiB. Setting the transaction size limit is consensus-breaking.

## Specification

1. Transaction size is limited to 2MiB by setting the versioned parameter `MaxTxSize` to 2097152, which is 2MiB in bytes. From version v3 and above, in `CheckTx`, `PrepareProposal`, and `ProcessProposal`, each transaction's size is checked against the `appconsts.MaxTxSize` threshold. This ensures that transactions over the limit are rejected or excluded at all stages, from initial submission to execution.

## Rationale

This proposal aims to set a transaction size limit of 2 MiB, even with blocks of 8 MiB or larger, primarily as a preventative measure. Gossiping transactions approaching 8 MiB without chunking could potentially be detrimental to network performance and stability.

The 2 MiB limit serves to:

1. Maintain network stability
2. Provide clear expectations for users and developers
3. Safeguard against potential issues as network usage grows

This approach prioritizes network-wide consistency and stability while allowing for future scalability considerations.

## Backwards Compatibility

This proposal is meant to be included with v3 and the [Ginger Network Upgrade](./cip-25.md). It is a consensus-breaking change.

## Security Considerations

Any changes to the block validity rules (via `PrepareProposal` and `ProcessProposal`) introduce implementation risks that could potentially lead to a chain halt.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
