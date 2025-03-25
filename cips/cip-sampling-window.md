| cip | XX (assigned by Editors) |
| - | - |
| title | Lower Sampling and Pruning Window to 14 days |
| description | Lower Sampling and Pruning Window to 14 days |
| author | Callum Waters ([@cmwaters](https://github.com/cmwaters)), Nashqueue ([@Nashqueue](https://github.com/Nashqueue)) |
| discussions-to | URL |
| status | Draft |
| type | Standards Track |
| category | Data Availability |
| created | 2025-03-17 |
| supercedes | [CIP 4](./cip-4.md) |

## Abstract

Lower the minimum sampling and pruning window to 14 days and 14 days + 1 hour respectively to reduce storage costs in response to increasing throughput of the network and to ensure that the subjective intialized header, known as **Tail**, in the header pruning CIP, is within the trusting period and thus not subject to long range attacks.

## Parameters

| Parameter     | Current value | Proposed value | Description  |
|---------------|---------------|----------------|--------------|
| RequestWindow | 720 hours  | 336 hours | This is analagous to the sampling window  |
| StorageWindow | 721 hours | 337 hours | This is analagous to the pruning window - the minimum retention period of shares for serving the network |

## Rationale

The next pending increase in throughput at 32 MB blocks in 6 seconds could require as much as 1 TB of storage per day, at least 30TB of storage for pruned bridge nodes. With this CIP, it is reduced to 14TB making it less costly to serve data to the network. This may also promote the introduction of archival storage services or namespace pinning.

The current light node syncing logic involves performing sequential verification from genesis. Outside from the time and storage costs from syncing from genesis, it's also vulnerable to long range attacks as headers beyond the trusting period are based on validators with "nothing at stake". While the header pruning CIP, addresses these concerns, the safety issue is only addressed so long as the sampling window is equal to the trusting period (currently defaults as 14 days). Having a sampling window or header pruning window greater than the trusting period will compromise the security of a long range attack unless the node uses something like backwards sync.

The one hour requires adequate tolerance to ensure that all nodes contains the headers needed to verify and sample the network.

## Backwards Compatibility

Nodes should first lower the sampling window to 14 days and once the majority of the network has upgraded, lower the pruning window to 14 days + 1 hour.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
