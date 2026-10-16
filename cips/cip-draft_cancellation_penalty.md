| cip | XX (assigned by Editors) |
| - | - |
| title | Set proposal cancellation penalty to 5% |
| description | Reduce the governance proposal cancellation penalty from 50% to a fixed 5% at v11. |
| author | Rootul Patel ([@rootulp](https://github.com/rootulp)) |
| discussions-to | TBD (Celestia Forum topic pending) |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2026-10-16 |

## Abstract

This CIP proposes reducing the governance proposal cancellation ratio from 50% to 5% in the v10-to-v11 network upgrade. From v11 onward, the ratio is no longer modifiable by governance. The change applies to cancellations during both the deposit and voting periods and preserves all other governance parameters.

## Motivation

A recent mainnet governance proposal withdrawal highlighted the cost of cancellation: a submitter can lose half their deposit even when withdrawing a legitimate proposal. Under the 50% penalty, cancelling a proposal with a 1,000 TIA deposit costs 500 TIA. With a 10,000 TIA deposit, the loss is 5,000 TIA.

Submitters may need to withdraw proposals to correct mistakes or respond to new information. A penalty of this size can discourage them from submitting proposals or correcting them promptly.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

### Upgrade activation

The v10-to-v11 upgrade handler MUST set the stored governance parameter `proposal_cancel_ratio` to `0.050000000000000000` after module migrations. It MUST preserve every other governance parameter, including `proposal_cancel_dest` and the separate quorum, prevote and veto burn settings.

The change MUST activate at the v11 upgrade boundary. It MUST NOT change cancellation behavior at pre-v11 heights. A v11 genesis MUST initialize the cancellation ratio to 5%.

### Cancellation accounting

For cancellations executed from v11 onward, the cancellation charge for each depositor and denomination MUST be:

```text
charge = floor(deposit_amount * 5 / 100)
refund = deposit_amount - charge
```

Amounts are integers in the denomination's smallest unit; one TIA is 1,000,000 utia. This preserves the existing rounding behavior and applies during both the deposit and voting periods.

The ratio in effect when the cancellation executes MUST apply, including to deposits associated with proposals submitted before v11. Existing rules for who may cancel, eligible proposal states and cancellation deadlines remain unchanged.

Charge disposition remains unchanged: an empty `proposal_cancel_dest` burns the charge; a configured destination receives it according to existing rules. Transaction fees remain separate. Previously burned deposits MUST NOT be reimbursed by this change.

### Governance restriction

From app version 11 onward, governance parameter updates MUST retain a cancellation ratio numerically equal to `0.05`. Updates that change the ratio MUST be rejected. Updates to other governance parameters MUST remain possible if they retain the fixed ratio.

The restriction MUST be enforced when proposal messages execute, including for proposals submitted before v11. Checking only proposal submission is insufficient. New v1 governance submissions containing a conflicting governance parameter update MUST also be rejected.

Changing the fixed ratio in the future requires a subsequent coordinated protocol upgrade.

## Parameters

| Parameter | Current value | Proposed value | Description | Changeable via Governance |
| - | - | - | - | - |
| `gov.ProposalCancelRatio` (`proposal_cancel_ratio`) | `0.500000000000000000` (50%) | `0.050000000000000000` (5%) | Fraction of each deposit charged on voluntary proposal cancellation | No from v11; previously Yes |

No other parameters are changed. Once this CIP is accepted and deployed to mainnet, the parameter inventory in [CIP-13](./cip-013.md) MUST be updated to reflect the new value and governance restriction.

## Rationale

A 5% charge reduces the cancellation penalty by 90% while retaining a cost for repeatedly submitting and cancelling proposals. Eliminating the charge entirely would allow the same deposit to be recycled for transaction fees alone.

A fixed ratio makes the cancellation policy an explicit protocol rule. Future changes require the coordinated upgrade process rather than an ordinary governance parameter update. Enforcing the rule at execution also prevents proposals queued before v11 from restoring a different value after activation.

Keeping a single ratio for both proposal stages avoids changing SDK cancellation logic or adding stage-specific parameters. Existing proposal messages, storage formats and other governance settings can be retained.

## Backwards Compatibility

This is a consensus-breaking change and requires a coordinated v11 network upgrade. All nodes MUST apply the parameter initialization and governance restriction at the same activation boundary. Historical replay before v11 MUST retain the previous behavior.

Outstanding proposals are not exempt: cancellations after activation use 5%, and queued parameter updates that attempt to change the ratio fail when executed after activation. Proposers preparing full governance parameter updates for v11 MUST retain the new ratio.

No transaction encoding or protobuf changes are required.

## Test Cases

An implementation should cover:

- The v11 upgrade changes the cancellation ratio from 50% to 5% and preserves every other governance parameter.
- Pre-v11 governance parameter updates retain their existing behavior.
- From v11, updates attempting to set the ratio to 0%, 10% or 50% are rejected.
- Numerically equivalent 5% values, such as `0.05` and `0.050000000000000000`, are accepted when updating unrelated parameters.
- A conflicting parameter proposal submitted before v11 is rejected when executed after activation.
- A 1,000 TIA deposit incurs a 50 TIA charge and a 950 TIA refund; a 10,000 TIA deposit incurs a 500 TIA charge and a 9,500 TIA refund.
- Rounding is applied independently per depositor and denomination. A 19 utia deposit incurs a 0 utia charge and a 19 utia refund; a 20 utia deposit incurs a 1 utia charge and a 19 utia refund.
- The same accounting applies during deposit and voting periods, including for proposals submitted before activation and cancelled afterward.

## Reference Implementation

The proposed implementation is celestia-app pull request #8201. Its v11 handler updates the existing stored parameter, and the app's governance message server enforces the version-gated restriction at submission and execution. No Cosmos SDK source changes are required.

## Security Considerations

Reducing the charge makes repeated proposal submission and cancellation less expensive. A 5% charge retains a deterrent, but does not establish that governance spam is uneconomic in every circumstance. Transaction gas fees and existing deposit requirements still apply.

A proposer may cancel during voting before a potential veto burn. The 5% charge preserves a cost for doing so, but cancellation can still cost less than losing the entire deposit to a veto. This proposal does not eliminate that incentive.

Integer rounding can produce a zero charge for sufficiently small deposits. This is inherited from the existing accounting; the proposal does not introduce a new minimum charge.

The governance restriction MUST cover execution of proposals queued before activation. All nodes must derive activation from the same committed app version so historical replay and live execution agree. The cancellation destination and other governance controls retain their existing policies; only the ratio becomes non-modifiable by governance.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
