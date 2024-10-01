| cip | TBD |
| - | - |
| title | Peppermint Network Upgrade |
| description | Reference CIPs included in the Peppermint Network Upgrade |
| author | [@jcstein](https://github.com/jcstein) |
| discussions-to | <https://forum.celestia.org/t/cip-v3-peppermint-network-upgrade/1826> |
| status | Draft |
| type | Meta |
| created | 2024-10-01 |
| requires | CIP-21, CIP-24, CIP-XX |

## Abstract

This Meta CIP lists the CIPs included in the Peppermint network upgrade.

## Specification

### Included CIPs

- [CIP-21](./cip-21.md): Introduce blob type with verified signer
- [CIP-24](./cip-24.md): Versioned Gas Scheduler Variables
- CIP-XX: limiting compute per block

All of the above CIPs are state breaking, and thus require a breaking network upgrade. The activation of this network upgrade will be different from previous network upgrades, as described in [CIP-10](./cip-10.md).

## Rationale

This CIP provides a complete list of breaking changes for the Peppermint upgrade, along with links to those CIPs.

## Security Considerations

This CIP does not have additional security concerns beyond what is already discussed in each of the listed CIPs.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
