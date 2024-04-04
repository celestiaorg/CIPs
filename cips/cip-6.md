---
cip: 6
title: Mininum gas price enforcement
description: Enforce payment of the gas for a transaction based on a governance modifiable global minimum gas price 
author: Callum Waters (@cmwaters)
discussions-to: https://forum.celestia.org/t/cip-006-price-enforcement/1351
status: Review
type: Standards Track
category: Core
created: 2023-11-30
---

## Abstract

Implement a global, consensus-enforced minimum gas price on all transactions. Ensure that all transactions can be decoded and have a valid signer with sufficient balance to cover the cost of the gas allocated in the transaction. The minimum gas price can be modified via on-chain governance.

| Parameter     | Default | Summary                                                                                                                | Changeable via Governance |
|---------------|---------|------------------------------------------------------------------------------------------------------------------------|---------------------------|
| minfee.MinimumGasPrice | 0.002utia  | Globally set minimum price per unit of gas                                                            | True                     |

## Motivation

The Celestia network was launched with the focus on having all the necessary protocols in place to provide secure data availability first and to focus on building an effective fee market system that correctly captures that value afterwards.

This is not to say that no fee market system exists. Celestia inherited the default system provided by the Cosmos SDK. However, the present system has several inadequacies that need to be addressed in order to achieve better pricing certainty and transaction guarantees for it’s users and to find a “fair” price for both the sellers (validators) and buyers (rollups) of data availability.

This proposal should be viewed as a foundational component of a broader effort and thus its scope is strictly focused towards the enforcement of some minimum fee: **ensuring that the value captured goes to those that provided that value**. It does not pertain to actual pricing mechanisms, tipping, refunds, futures and other possible future works. Dynamic systems like EIP-1559 and uniform price auctions can and should be prioritised only once the network starts to experience congestion over block space.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

All transactions MUST be decodable by the network. They MUST have a recognised signer, a signature that authenticates the signer, a fee and a gas. This does not imply that they need be completely valid, they just need a minimum degree of validity that allows the network to charge the signer for the allocation of gas for performing the computation, networking and storage.

We define the gas price as the fee divided by the gas. In other words, this is the amount of utia paid per unit of gas. All transactions MUST have a gas price that is greater than or equal to a minimum network-wide agreed upon gas price.

Both of these rules are block validity rules. Correct validators will vote `nil` or against the proposal if the proposed block contains any transaction that violates these two rules.

The global minimum gas price can be modified via on-chain governance.

Note that validators may in addition set their own constraints as to what they deem acceptable in a proposed block. For example, they may only accept transaction with a gas-price that is higher than their locally configured minimum.

This minimum gas price SHOULD be queryable by client implementations.

## Rationale

The primary rationale for this decision is to prevent the payment system for data availability from migrating off-chain and manifesting in secondary markets. As a concrete example, currently validators would earn more revenue if they convinced users to pay them out of band and set the transaction fee to 0 such that all revenue went to the proposer and none to the rest of the validators/delegators. This is known as off-chain agreements (OCA)

There are two other reasons:

- Better UX as clients or wallets can query the on-chain state for the global min gas price whereas currently each node might have a separate min gas price and given the proposer is anonymous it’s difficult to know whether the user is paying a sufficient fee.
- Easier to coordinate: a governance proposal that is passed automatically updates the state machine whereas to manually change requires telling all nodes to halt, modify their config, and restart their node

Lastly, this change removes the possible incongruity that would form when it comes to gossiping transactions when consensus nodes use different minimum gas prices.

## Backwards Compatibility

This requires a modification to the block validity rules and thus breaks the state machine. It will need to be introduced in a major release.

Wallets and other transaction submitting clients will need to monitor the minimum gas price and adjust accordingly.

## Test Cases

The target for testing will be to remove the ability for block proposers to offer block space to users in a way that circumvents the fee system currently in place.

## Reference Implementation

In order to ensure transaction validity with respect to having a minimum balance to cover the gas allocated, the `celestia-app` go implementation requires a small change to `ProcessProposal`, namely:

```diff
sdkTx, err := app.txConfig.TxDecoder()(tx)
if err != nil {
- // we don't reject the block here because it is not a block validity
- // rule that all transactions included in the block data are
- // decodable
- continue
+ return reject()
}
```

This will now reject undecodable transactions. Decodable transactions will still have to pass the `AnteHandlers` before being accepted in a block so no further change is required.

A mechanism to enforce a minimum fee is already in place in the `DeductFeeDecorator`. Currently, the decorator uses a  min gas price sourced from the validator's local config. To introduce a network-wide constraint on min gas price, we introduce a new `param.Subspace=minfee`, which contains the global min gas price. If the param is unpopulated, it defaults to `0.002utia` (which matches the current local min gas price).

The `DeductFeeDecorator` antehandler will receive a new `ante.TxFeeChecker` function called `ValidateTxFee` which will have access to the same `param.Subspace`. For `CheckTx`, it will use the max of either the global min gas price or the local min gas price. For `PrepareProposal`, `ProcessProposal` and `DeliverTx` it will only check using the global min gas price and ignore the locally set min gas price.

The minimum gas price can already be queried through the gRPC client as can any other parameter.

## Security Considerations

Any modification to the block validity rules (through `PrepareProposal` and `ProcessProposal`) introduces implementation risk that may cause the chain to halt.

Given a voting period of one week, it will take at least one week for the network to update the minimum gas price. This could potentially be too slow given large swings in the underlying price of TIA.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
