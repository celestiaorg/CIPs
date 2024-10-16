| cip | 26 |
| - | - |
| title | Reduce block time to six seconds |
| description | Proposal to reduce block time on celestia-app to 6 seconds, from 12. |
| author | Josh Stein ([@jcstein](https://github.com/jcstein)), Rootul Patel ([@rootulp](https://github.com/rootulp))| Sanaz Taheri ([@staheri14](https://github.com/staheri14) )
| discussions-to | <https://forum.celestia.org/t/cip-decrease-block-time-to-6-seconds/1836> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2024-10-09 |

## Abstract

This CIP proposes to reduce the block time on celestia-app to 6 seconds, from 12. This will double the throughput and reduce the time it takes for transactions to be finalized in half. This CIP also proposes to increase the `ttl-num-blocks` parameter in the mempool configuration from 5 to 12 to maintain consistency with the new block time.

## Motivation

The motivation for this CIP stems from a discussion in Core Devs Call 17, where it was proposed to reduce the block time to 6 seconds from 12 seconds.

## Specification

1. The block time in celestia-app SHOULD be reduced from 12 seconds to 6 seconds. Concretely, this implies decreasing `TimeoutCommit` to 4.2 seconds and `TimeoutPropose` to 3.5 seconds.
    1. The `TimeoutCommit` and `TimeoutPropose` parameters were moved from local config parameters into versioned parameters controlled by the state machine to ensure consistency and correctness across different protocol versions.
    1. The change in block time MUST be implemented at a specific block height, which SHALL be determined and agreed upon by the Celestia community via on-chain signaling by validators.
    1. Celestia consensus nodes SHOULD update their software to accommodate this change prior to the agreed-upon block height.
    1. Client applications interacting with the Celestia network SHOULD be updated to account for the faster block time, particularly in areas related to transaction confirmation and block finality.

1. The default `ttl-num-blocks` parameter in the mempool configuration SHALL be increased from 5 to 12. This change is necessary to maintain consistency with the new block time and ensure that transactions remain in the mempool for a similar duration as before.
    1. Current default: `ttl-num-blocks = 5`
    1. New default: `ttl-num-blocks = 12`
    1. This change SHALL NOT be implemented alongside the block time reduction. The default increase from 5 to 12 will occur when users upgrade to v3.0.0 and regenerate their config files. The block time reduction will happen one week later when the v2 to v3 activation height occurs. This approach ensures consistent behavior of the mempool across the network upgrade.
    1. All validator nodes SHOULD update their configuration files to reflect this new `ttl-num-blocks` value before the agreed-upon implementation block height.

1. Documentation and APIs related to block time and block production MUST be updated to reflect these changes.

## Rationale

The rationale for this change is to increase the throughput of the Celestia network by doubling the number of blocks produced per unit of time. This will reduce the time it takes for transactions to be finalized and improve the overall user experience on the network.

The increase in `ttl-num-blocks` from 5 to 12 is necessary to maintain consistent mempool behavior with the new block time. This change ensures that transactions remain in the mempool for approximately 72 seconds (12 blocks times 6 seconds), which closely matches the previous behavior of about 60 seconds (5 blocks times 12 seconds).

## Backwards Compatibility

This is a breaking network upgrade and will require all participants to update their software to accommodate the new block time and `ttl-num-blocks`. The change in block time will not be backward compatible with the existing network, and all participants MUST be compliant by the agreed-upon implementation block height.

## Test Cases

This will be tested on Arabica devnet and Mocha testnet before going live on Celestia Mainnet Beta.

## Security Considerations

While the reduction in block time itself does not introduce significant new security risks to the network, there are important considerations:

1. Participants should ensure that their systems are capable of handling the increased throughput from faster block times.
1. The increase of `ttl-num-blocks` from 5 to 12 is crucial for maintaining the security and efficiency of the mempool:
    1. It prevents premature removal of valid transactions, reducing the risk of unintended exclusion from blocks.
    1. Without this adjustment, transactions would be pruned from the mempool after only 30 seconds, potentially leading to increased transaction failures and a poor user experience.
1. Validators and node operators should update their configurations to reflect the new `ttl-num-blocks` value to maintain network consistency and security.

These changes require careful implementation and testing to ensure network stability during and after the transition.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
