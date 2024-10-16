| cip | TBD(27) |
| - | - |
| title | Block limits for number of PFBs/non-PFBs and transaction sizes |
| description | Set limits for number of PFBs and non-PFBs per block and transaction size |
| author | Josh Stein ([@jcstein](https://github.com/jcstein)) |
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

1. The size of a transaction is limited to 2MB by setting `MaxTxBytes` to 2091752, which is 2MiB in bytes.

## Rationale

The rationale  for this proposal is to prevent congestion on the network by limiting the number of PFBs and non-PFB transactions per block. It is also to set the transaction size limit to 2MiB to prevent issues with gossiping 8MiB transactions when the block size increases. Gossiping an 8MiB transaction without chunking could be detrimental to the network.

## Backwards Compatibility

This proposal is meant to be included with v3 and the [Ginger Network Upgrade](./cip-25.md). It is not backwards compatible with v2.

## Security Considerations

This proposal does not introduce any new security risks.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
