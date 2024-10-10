| cip | TBD |
| - | - |
| title | Reduce block time to six seconds |
| description | Proposal to reduce block time on celestia-app to 6 seconds, from 12. |
| author | Josh Stein ([@jcstein](https://github.com/jcstein)), Rootul Patel ([@rootulp](https://github.com/rootulp))|
| discussions-to | <https://forum.celestia.org/t/cip-decrease-block-time-to-6-seconds/1836> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2024-10-09 |

## Abstract

This CIP proposes to reduce the block time on celestia-app to 6 seconds, from 12. This will double the throughput and reduce the time it takes for transactions to be finalized in half.

## Motivation

The motivation for this CIP stems from a discussion in Core Devs Call 17, where it was proposed to reduce the block time to 6 seconds from 12 seconds.

## Specification

1. The block time in celestia-app SHOULD be reduced from 12 seconds to 6 seconds. Concretely, this implies decreasing `TimeoutCommit` to 1 seconds and `TimeoutPropose` to 3 seconds.

2. All implementations of celestia-app SHALL adjust their block production mechanisms to conform to this new 6-second block time.

3. The change in block time MUST be implemented at a specific block height, which SHALL be determined and agreed upon by the Celestia community via on-chain signaling by validators.

4. Celestia consensus nodes SHOULD update their software to accommodate this change prior to the agreed-upon block height.

5. Client applications interacting with the Celestia network SHOULD be updated to account for the faster block time, particularly in areas related to transaction confirmation and block finality.

7. The implementation of this change SHOULD include appropriate testing and monitoring to ensure network stability during and after the transition.

8. Documentation and APIs related to block time and block production MUST be updated to reflect this change.

9. The network SHOULD provide a grace period for node operators and other participants to adapt to the new block time, but all participants MUST be compliant by the agreed-upon implementation block height.

## Rationale

The rationale for this change is to increase the throughput of the Celestia network by doubling the number of blocks produced per unit of time. This will reduce the time it takes for transactions to be finalized and improve the overall user experience on the network.

## Backwards Compatibility

This is a breaking network upgrade and will require all participants to update their software to accommodate the new block time. The change in block time will not be backward compatible with the existing network, and all participants MUST be compliant by the agreed-upon implementation block height.

## Test Cases

This will be tested on Arabica devnet and Mocha testnet before going live on Celestia Mainnet Beta.

## Security Considerations

The security considerations for this change are minimal, as the reduction in block time does not introduce any new security risks to the network. However, participants should be aware of the faster block time and ensure that their systems are capable of handling the increased throughput.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
