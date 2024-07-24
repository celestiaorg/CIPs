| cip | 24 |
| - | - |
| title | Versioned Gas Scheduler Variables |
| description | Gas scheduler variables hard fork modifiable  |
| author | Nina Barbakadze (@ninabarbakadze) |
| discussions-to |  |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2024-07-24 |

## Abstract

Introduce versioning for on-chain governance modifiable gas scheduler parameters, such as `blob.GasPerBlobByte` and `auth.TxSizeCostPerByte`, to only allow changes during hard fork upgrades.

## Motivation

Versioning on-chain governance modifiable parameters, such as `blob.GasPerBlobByte` and `auth.TxSizeCostPerByte`, aims to stabilize gas estimation by removing block-to-block variability.

## Specification

Currently, `GasPerBlobByte` and `TxSizeCostPerByte` are module parameters within the `blob` and `auth` modules, allowing for their modification via ParameterChangeProposal. The proposed modification changes these parameters to hardcoded constants within the application, accessible via version-specific getters.

### Parameters

The proposal makes these two variables modifiable through hard fork upgrades:

Previously:

1. `blob.GasPerBlobByte`
2. `auth.TxSizeCostPerByte`

Now:

1. `appconsts.GasPerBlobByte`
1. `appconsts.TxSizeCostPerByte`

### Rationale

Versioned Gas Scheduler Variables allow for hardcoding these values into estimators, simplifying the gas estimation process and making transaction costs more predictable without the need for pre-transaction queries.

## Backwards Compatibility

Enabling this feature requires a hard fork network upgrade.

## Test Cases

Test cases should verify that gas scheduler variables are exclusively updated via hard fork, effectively preventing updates through governance mechanisms.

## Reference Implementation

TBC

## Security Considerations

This change prioritizes network stability and predictability but requires heightened vigilance against potential misconfigurations.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
