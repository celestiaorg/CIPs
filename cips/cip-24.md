| cip | 24 |
| - | - |
| title | Versioned Gas Scheduler Variables |
| description | Transition to hard fork-only updates for gas scheduler variables |
| author | Nina Barbakadze ([@ninabarbakadze](https://github.com/ninabarbakadze)) |
| discussions-to | <https://forum.celestia.org/t/cip-versioned-gas-scheduler-variables/1785> |
| status | Review |
| type | Standards Track |
| category | Core |
| created | 2024-07-24 |

## Abstract

Gas scheduler parameters `blob.GasPerBlobByte` and `auth.TxSizeCostPerByte` will no longer be modifiable by governance but may only change via a hard fork upgrade.

## Motivation

Versioning on-chain governance modifiable parameters `blob.GasPerBlobByte` and `auth.TxSizeCostPerByte`, aims to stabilize gas estimation by removing block-to-block variability. This allows for hardcoding these values into estimators, simplifying the gas estimation process and making transaction costs more predictable without the need for pre-transaction queries.

## Specification

Currently, `GasPerBlobByte` and `TxSizeCostPerByte` are module parameters within the `blob` and `auth` modules, allowing for their modification via `ParameterChangeProposal`. The proposed modification changes these parameters to hardcoded constants within the application, accessible via version-specific getters.

### Parameters

The proposal makes these two variables modifiable through hard fork upgrades:

Previously:

1. `blob.GasPerBlobByte`
2. `auth.TxSizeCostPerByte`

Now:

1. `appconsts.GasPerBlobByte`
1. `appconsts.TxSizeCostPerByte`

## Backwards Compatibility

Enabling this feature requires a hard fork network upgrade.

## Test Cases

Test cases should verify that gas scheduler variables are exclusively updated via hard forks, effectively preventing updates through governance mechanisms and that the gas meter uses those constants.

## Reference Implementation

TBC

## Security Considerations

This change prioritizes network stability and predictability but requires heightened vigilance against potential misconfigurations.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
