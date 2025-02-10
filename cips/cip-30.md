| cip           | 30                                                                                         |
|---------------|--------------------------------------------------------------------------------------------|
| title         | Prevent Auto-Claiming of Staking Rewards                                                   |
| description   | This CIP proposes removing the automatic claiming of staking rewards when modifying delegations. Instead, rewards are to be stored until manually claimed. |
| author        | Dean Eigenmann ([@decanus](https://github.com/decanus)), Marko Baricevic ([@tac0turtle](https://github.com/tac0turtle)) |
| discussions-to | [Forum Discussion](https://forum.celestia.org/t/cip-prevent-auto-claiming-of-staking-rewards/1905) |
| status        | Draft                                                                                      |
| type          | Standards Track                                                                            |
| category      | Core                                                                                       |
| created       | 2025-02-07                                                                                 `|

## Abstract

Currently, when delegators modify their staking positions (e.g., redelegate or undelegate), the distribution module automatically claims all accrued staking rewards. This CIP proposes removing that automatic functionality, thereby allowing users to intentionally choose *when* to claim their rewards. Specifically, the distribution module will no longer auto-claim rewards on delegation-share changes. Instead, it will store the accrued rewards until a user explicitly calls `MsgWithdrawDelegatorReward`. This avoids unintended reward-claiming events that can trigger immediate tax or regulatory obligations.

## Motivation

Many delegators face tax or regulatory requirements forcing them to sell or otherwise handle any staking rewards the moment those rewards are claimed. Because the current system automatically claims rewards whenever a delegation is modified, users frequently have to deal with surprise or unintended taxable events, as well as unwanted administrative overhead. By decoupling reward claims from delegation operations, users can manage claiming events more intentionally.

## Specification

### Overview

- **Existing Behavior**:
  - When a delegator changes their delegation (e.g., via `MsgDelegate`, `MsgBeginRedelegate`, `MsgUndelegate`), the distribution module automatically triggers a reward claim for the delegator.
  
- **Proposed Behavior**:
  - Remove or modify the distribution module’s “auto-claim” hook so that **no** rewards are automatically claimed on delegation changes.
  - Delegators **only** claim their rewards by sending a `MsgWithdrawDelegatorReward` transaction (or the equivalent in the Celestia ecosystem).
  - Pending rewards accumulate in the distribution module until explicitly claimed.

### Detailed Design

1. **Distribution Module Hook Changes**:
   - Modify the existing hook(s) or condition(s) that trigger an automatic reward withdrawal during delegation modifications.
   - Ensure that the reward calculation logic remains untouched (i.e., it continues to track and update the delegator’s reward pool share). Only the *withdrawal action* is changed.

2. **Reward Storage**:
   - The distribution module **continues** to store accrued rewards in the same internal accounting structures, just as it currently does before automatic withdrawals.
   - No additional data structure is necessary beyond removing the forced withdrawal step.

3. **Claiming Rewards**:
   - A delegator **MUST** explicitly invoke a claim (e.g., via `MsgWithdrawDelegatorReward`) to withdraw pending rewards.
   - This approach gives delegators full control over their claiming schedule to better manage obligations (tax, compliance, regulatory).

4. **Backward Compatibility**:
   - This CIP introduces a **breaking change** in the sense that reward withdrawal will no longer happen automatically upon delegation changes.
   - Existing and future delegators will need to manually claim their rewards if they wish to realize them on-chain or transfer them out.

5. **New/Updated Modules**:
   - Only the distribution module logic is updated. No changes are required in other modules, aside from references to the distribution hook.

## Parameters

No new parameters are introduced. This CIP only modifies existing distribution module behavior. Governance parameters remain unchanged.

## Rationale

The main driver of this proposal is user flexibility and compliance management:

- **Tax Considerations**: Auto-claiming can unintentionally create taxable events.
- **Regulatory Considerations**: Certain jurisdictions may require immediate disposal or reporting of rewards once claimed, which auto-claiming forcibly triggers.
- **User Control**: Delegators deserve the option to claim rewards on their own schedule.

Alternate designs were considered, such as introducing a toggle for auto-claim. Ultimately, removing automatic withdrawals entirely is simpler, requires fewer user decisions, and aligns with manual control over other staking actions.

## Backwards Compatibility

This proposal removes existing auto-claim behavior on delegation operations. While there is no fundamental architectural or data structure incompatibility, it **does** change user experience and expectations:

- Users who are accustomed to seeing updated balances immediately upon redelegation or undelegation must now explicitly claim.
- Any automated scripts or frontends that expected balances to update immediately upon delegation changes will need to adapt.

## Test Cases

1. **Redelegate/Undelegate Without Claim**:
   - **Before CIP-30**: Redelegation triggers automatic rewards claim. The user’s available balance increases.
   - **After CIP-30**: Redelegation does *not* trigger automatic rewards claim. Pending rewards remain in the distribution module. The user’s available balance remains unchanged until explicitly claimed.

2. **Manual Claim**:
   - User sends `MsgWithdrawDelegatorReward` with a valid delegator address.
   - Check that the user’s previously unclaimed rewards are transferred to the user’s wallet.

3. **No Changes in Reward Computation**:
   - Ensure the distribution module’s reward accumulation logic is unaffected (only the withdrawal step is removed).

## Reference Implementation

A high-level pseudo-diff (illustrative) of the distribution module:

```diff
 func OnDelegationSharesModified(ctx Context, delAddr AccAddress, valAddr ValAddress) {
-    // Old behavior: auto-claim rewards
-    WithdrawDelegationRewards(ctx, delAddr, valAddr)
-
+    // New behavior: do nothing related to claiming.
+    // Rewards remain in the distribution module until user calls WithdrawDelegatorReward explicitly.
 }
```

## Security Considerations

 • Users holding large amounts of unclaimed rewards could become more attractive targets for potential exploits if a vulnerability existed in the distribution module. However, this scenario already exists between automatic claim intervals or across multiple validators.
 • Removing auto-claim does not introduce new vectors for abuse; it merely defers the claim to a user-initiated transaction.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
