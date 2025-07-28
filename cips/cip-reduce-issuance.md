| cip | XX (assigned by Editors) |
| - | - |
| title | Further reduce issuance to 2.5% and increase minimum commission to 10% |
| description | Reduce inflation to 2.5% and increase minimum validator commission to 10% to improve TIA's suitability for financial applications |
| author | Callum Waters (@cmwaters), Nashqueue (@nashqueue) |
| discussions-to | https://forum.celestia.org/t/cip-reduce-issuance-to-2-5-and-increase-minimum-commission-to-10/2103 |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2025-07-28 |

## Abstract

This CIP proposes to further reduce Celestia's inflation rate from 5% to 2.5% and increase the minimum validator commission from 5% to 10% in the next major upgrade (v5). These changes aim to make TIA more suitable for financial applications by reducing the opportunity cost of using TIA as collateral or in DeFi protocols, while ensuring validators remain adequately compensated for their services. The proposal builds upon [CIP-29](./cip-029.md) which previously reduced inflation by 33%, and maintains the same disinflation rate of 6.7% annually.

## Motivation

Even following the successful implementation of [CIP-29](./cip-029.md) which reduced inflation by 33%, high staking yields (approximately 9.09% APR at 55% bonding ratio) make it difficult for DeFi protocols, lending platforms, and other financial applications to compete effectively (these operate with an expected yield of 2-3%). This creates a barrier to TIA's broader adoption as a financial asset and limits the development of a diverse ecosystem of yield-generating applications on Celestia-secured rollups.

In addition, to ensure the validator revenue remains sufficient enough for a professional operation, the CIP proposes to balance the reduced inflation with an increase in the minimum commission.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

1. **Reduce Inflation Rate**: Decrease the current inflation rate from 5% to 2.5% in the next major upgrade (v5)
2. **Increase Minimum Commission**: Raise the minimum validator commission from 5% to 10% via governance vote
3. **Maintain Disinflation Rate**: Keep the existing 6.7% annual disinflation rate unchanged
4. **Reward Distribution**: The reward distribution mechanism remains unchanged—rewards are still allocated pro rata to stakers and validators

## Parameters

The following parameter changes are proposed for the Celestia network:

| Parameter | Current value | Proposed value | Description | Changeable via Governance |
|-----------|---------------|----------------|-------------|---------------------------|
| `InitialInflationRate` | 5.36% | 2.67% | The initial inflation rate at genesis | No |
| `MinCommissionRate` | 5% | 10% | The minimum commission rate validators can set | Yes |

### APR Impact Analysis

The following tables show the impact of the proposed changes on APR for different bonding ratios:

**Current Schedule (5% inflation, 5% minimum commission):**

| Bonding Ratio | Total Staking APR | Delegator APR | Validator APR |
|---------------|-------------------|-----------------------|----------------------------|
| 35% | 14.29% | 13.58% | 0.71% |
| 50% | 10.00% | 9.50% | 0.50% |
| 55% | 9.09% | 8.64% | 0.45% |
| 65% | 7.69% | 7.31% | 0.38% |

**Proposed Schedule (2.5% inflation, 10% minimum commission):**

| Bonding Ratio | Total Staking APR | Delegator APR | Validator APR |
|---------------|----------------|-----------------------|-------------------------|
| 35% | 7.14% | 6.43% | 0.71% |
| 50% | 5.00% | 4.50% | 0.50% |
| 55% | 4.55% | 4.10% | 0.45% |
| 65% | 3.85% | 3.46% | 0.38% |

**Note**: The Validator APR is based of the total amount staked to that validator

**Comparison of Changes:**

| Metric | Current (5% inflation) | Proposed (2.5% inflation) | Change |
|--------|------------------------|-------------------------|--------|
| Total Staking APR (55% bonding) | 9.09% | 4.55% | -50% |
| Delegator APR (55% bonding) | 8.64% | 4.10% | -53% |
| Validator APR (55% bonding) | 0.45% | 0.45% | 0% |

### Inflation Schedule Over Time

The following table shows the inflation rate progression over time, starting from the current 5% rate, transitioning to 2.5% with this CIP, and continuing with the 6.7% annual disinflation rate until reaching the 1.5% target:

| Year | Current Inflation (5%) | Proposed Inflation (2.5%) | Notes |
|------|------------------------|-------------------------|-------|
| **0** | 8.00% | 8.00% | Genesis year, no change |
| **1** | 7.20% | 7.20% | |
| **v4** | 5.00% | 5.00% | After CIP-29 reduction |
| **v5** | 4.67% | 2.50% | **Proposed CIP** |
| **2** | 4.35% | 2.33% | Regular annual disinflation applied (6.7%) |
| **3** | 4.06% | 2.17% | Regular annual disinflation applied (6.7%) |
| **4** | 3.79% | 2.02% | Regular annual disinflation applied (6.7%) |
| **5** | 3.54% | 1.88% | Regular annual disinflation applied (6.7%) |
| **6** | 3.30% | 1.75% | Regular annual disinflation applied (6.7%) |
| **7** | 3.08% | 1.63% | Regular annual disinflation applied (6.7%) |
| **8** | 2.87% | 1.52% | Regular annual disinflation applied (6.7%) |
| **9** | 2.68% | 1.50% | Target inflation reached |

**Note**: The table assumes this CIP would be implemented less than 2 years after genesis.

## Backwards Compatibility

This change introduces modifications that require careful coordination:

1. **Network Upgrade Required**: The inflation and commission changes must be implemented through a coordinated network upgrade to ensure all validators adopt the new parameters simultaneously.

2. **Validator Commission Adjustments**: This will need to be done as a governance proposal and can happen prior to or after the inflation change.

No other backward compatibility issues are expected.

## Test Cases

1. **Test Inflation Rate**:
   - Ensure that when the updated inflation parameters are applied, the on-chain inflation rate reflects the new 2.5% value instead of the previous 5% rate.

2. **Test Commission Rate Enforcement**:
   - Validate that validators cannot set commission rates below 10% after the upgrade.
   - Verify that existing validators with rates below 10% are automatically adjusted to the minimum.

3. **Test Disinflation Continuity**:
   - Ensure that the 6.7% annual disinflation rate continues to function correctly with the new base inflation rate.

## Security Considerations

This CIP has important security implications related to validator incentives and network security:

**Validator Incentives**: The 50% reduction in total issuance significantly decreases validator rewards, potentially affecting network security. However, the 10% minimum commission maintains validator compensation at current levels while reducing delegator yields.

**Bonded Ratio Impact**: Lower staking yields may lead to reduced bonding ratios as delegators are incentivised to seek alternative yield opportunities. This could affect network security if the bonding ratio falls below safe thresholds. This means there are less participants involved in selecting a secure and performant validator set.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
