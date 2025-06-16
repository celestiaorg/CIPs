| cip | XX (assigned by Editors) |
| - | - |
| title | Lower unbonding period to ~14 days |
| description | Reduce the validator unbonding period from 21 days to 14 days and 1 hour to improve capital efficiency while maintaining network security |
| author | Callum (@cmwaters) |
| discussions-to | URL |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2025-06-16 |

## Abstract

This CIP proposes reducing Celestia's validator unbonding period from the current 21 days to 14 days and 1 hour (337 hours total). This change aims to improve capital efficiency for validators while maintaining the security guarantees required by the network's trust model. The proposed unbonding period ensures compatibility with IBC light clients that currently use a 14-day trusting period and provides adequate buffer time for detecting and responding to validator misbehavior.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

1. **Unbonding Period Reduction**: The validator unbonding period SHALL be reduced from 21 days (504 hours) to 14 days and 1 hour (337 hours total).

2. **Minimum Duration Constraint**: The unbonding period MUST remain greater than the maximum trusting period used by any IBC light clients connected to Celestia. Currently, this is 14 days for IBC connections. If these connections can be updated, it is possible for the `UnbondingTime` to be reduced further.

3. **Grace Period**: The additional 1 hour beyond 14 days provides a grace period to ensure the unbonding period strictly exceeds any 14-day trusting periods, accounting for potential timing variations and ensuring robust security guarantees.

4. **Evidence Parameter Updates**: The `MaxAgeDuration` and `MaxAgeNumBlocks` must be updated to mirror the changes in the unbonding period. Noticeably, the `MaxAgeNumBlocks` value MUST increase as it was not adjusted to account for the halving in block time and is currently at 7 days (at 5 seconds per block). As it's important that the evidence parameters mirror the `UnbondingTime` and this parameter is not changeable by governance, so to MUST these parameters not be changeable by governance. Note when either of the evidence parameters are exceeeded the evidence is deemed invalid.

## Parameters

The following parameter change is proposed for the Celestia network:

| Parameter | Current value | Proposed value | Description | Changeable via Governance |
|-----------|---------------|----------------|-------------|---------------------------|
| `staking.UnbondingTime` | 21 days (504 hours) | 14 days + 1 hour (337 hours) | The period validators must wait after unbonding before they can withdraw their stake | No |
| `consensus.evidence.MaxAgeDuration` | 21 days (504 hours) | 14 days + 1 hour (337 hours) | Maximum age of evidence that can be submitted for slashing | No |
| `consensus.evidence.MaxAgeNumBlocks` | 120,960 blocks | 242,640 blocks | Maximum number of blocks for which evidence can be submitted for slashing | No |

## Rationale

The proposed duration of 14 days and 1 hour is carefully chosen to balance security requirements with capital efficiency:

**Security Requirements:**

- **IBC Light Client Compatibility**: IBC light clients currently use a 14-day trusting period. The unbonding period must exceed this to prevent validators from escaping slashing for misbehavior discovered within the trusting period
- **Grace Period**: The additional 1 hour provides a safety buffer to ensure strict inequality (unbonding > trusting) even with timing variations
- **Long-Range Attack Prevention**: 14+ days provides sufficient time to detect and respond to sophisticated long-range attacks or consensus failures

**Capital Efficiency Benefits:**

- **33% Reduction**: Reducing from 21 to ~14 days represents a 33% improvement in capital turnover time
- **Competitive Positioning**: Aligns Celestia with industry standards (most PoS networks use 14-21 day unbonding periods)
- **Validator Attraction**: Shorter unbonding periods make validator participation more attractive, potentially increasing decentralization

## Backwards Compatibility

This change introduces modifications that require careful coordination:

1. **Network Upgrade Required**: The unbonding period change must be implemented through a coordinated network upgrade to ensure all validators adopt the new parameters simultaneously.

2. **Existing Unbonding Delegations**: Delegations already in the unbonding process at the time of upgrade will continue under the previous 21-day period to avoid disrupting existing commitments.

3. **Existing Governance Proposals to Modify Evidence Parameters**: Any existing proposal, unlikely as they are must not be allowed to change the evidence params following the coordinated upgrade.

No backward compatibility issues are expected for normal network operations, as the change only affects the timing of validator unbonding without modifying core consensus mechanisms or data structures.

## Security Considerations

As outlined in the rationale, the `UnbondingTime` can not be less than the current IBC `TrustingPeriod` of 14 days (even if the CIP to reduce the trusting period for light nodes is adopted), as this makes that bridge vulnerable to attacks by perpetrators that will no longer have anything at stake.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
