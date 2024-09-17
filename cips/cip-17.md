| cip | 17 |
| - | - |
| title | Lemongrass Network Upgrade |
| description | Reference specifications included in the Lemongrass Network Upgrade |
| author | [@evan-forbes](https://github.com/evan-forbes) |
| discussions-to | <https://forum.celestia.org/t/lemongrass-hardfork/1589> |
| status | Final |
| type | Meta |
| created | 2024-02-16 |
| requires | CIP-6, CIP-9, CIP-10, CIP-14, CIP-20 |

## Abstract

This Meta CIP lists the CIPs included in the Lemongrass network upgrade.

## Specification

### Included CIPs

- [CIP-6](./cip-6.md): Price Enforcement
- [CIP-9](./cip-9.md): Packet Forward Middleware
- [CIP-10](./cip-10.md): Coordinated Upgrades
- [CIP-14](./cip-14.md): Interchain Accounts
- [CIP-20](./cip-20.md): Disable Blobstream module

All of the above CIPs are state breaking, and thus require a breaking network upgrade. The activation of this network upgrade will be different from future network upgrades, as described in [CIP-10](./cip-10.md).

## Rationale

This CIP provides a complete list of breaking changes for the Lemongrass upgrade, along with links to those specs.

## Security Considerations

This CIP does not have additional security concerns beyond what is already discussed in each of the listed specs.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
