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
| SamplingWindow | 720 hours  | 336 hours | Defines how far back we sample to keep a continous chain  |
| PruningWindow | 721 hours | 337 hours | The minimum retention period of shares for serving the network |
| TrustingPeriod | 336 hours | - | The period, nodes will trust headers in because the validators are still economically accountable (must be less than the UnbondingPeriod) |

## Rationale

The next pending increase in throughput (32 MB blocks every 6 seconds) would require bridge nodes to store up to 1 TB per day. The current sampling window (30 days) implies that pruned bridge nodes need to have 30 TB of storage. This CIP reduces the sampling window to 14 days to reduce the storage requirement to 14 TB which makes it less costly to serve data to the network. 

The current light node syncing logic involves performing sequential verification from genesis. Outside from the time and storage costs from syncing from genesis, it's also vulnerable to long range attacks as headers beyond the trusting period are based on validators with "nothing at stake". While the header pruning CIP, addresses these concerns, the safety issue is only addressed so long as the sampling window is equal to the trusting period (currently defaults as 14 days). Having a sampling window or header pruning window greater than the trusting period will compromise the security of a long range attack unless the node uses something like backwards sync.

## Backwards Compatibility

Nodes should first lower the sampling window to 14 days and once the majority of the network has upgraded, lower the pruning window to 14 days + 1 hour.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
