---
title: Price enforcement
description: Enforce payment of the gas for a transaction based on a global minimum price 
author: Callum Waters (@cmwaters)
discussions-to: https://forum.celestia.org/t/cip-006-price-enforcement/1351
status: Draft
type: Standards Track
category: Core
created: 2023-11-30
---

## Abstract

Implement a global, consensus-enforced minimum gas price on all transactions. Ensure that all transactions can be decoded and have a valid signer with sufficient balance to cover the cost of the gas allocated in the transaction.

## Motivation

The Celestia network was launched with the focus on having all the necessary protocols in place to provide secure data availability first and to focus on building an effective fee market system that correctly captures that value afterwards.

This is not to say that no fee market system exists. Celestia inherited the default system provided by the Cosmos SDK. However, the present system has several inadequacies that need to be addressed in order to achieve better pricing certainty and transaction guarantees for it’s users and to find a “fair” price for both the sellers (validators) and buyers (rollups) of data availability.

This proposal should be viewed as a sub component of a more broader effort and thus it’s scope is strictly focused towards the more foundational aspect of fee enforcement: **ensuring that the value captured goes to those that provided that value**. It does not pertain to actual pricing mechanisms, tipping, refunds, futures and other possible future works.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

All transactions MUST be decodable by the network. They MUST have a recognised signer, a signature that authenticates the signer, a fee and a gas. This does not imply that they need be completely valid, they just need a minimum degree of validity that allows the network to charge the signer for the allocation of gas for performing the computation, networking and storage.

We define the gas price as the fee divided by the gas. In other words, this is the amount of utia paid per unit of gas. All transactions MUST have a gas price that is greater than or equal to a minimum network-wide agreed upon gas price.

Both of these rules are block validity rules. Correct validators will vote `nil` or against the proposal if the proposed block contains any transaction that violates these two rules.

Note that validators may in addition set their own constraints as to what they deem acceptable in a proposed block. For example, they may only propose blocks with a gas-price that is higher than the global minimum. However, correct validators, SHOULD gossip all valid transactions that are above the defined global minimum gas price and not their own local price.

This minimum gas price SHOULD be queryable by client implementations.

## Rationale

The primary rationale for this decision is to prevent the payment system for data availability from migrating off-chain and manifesting in secondary markets. As a concrete example, currently validators would earn more revenue if they convinced users to pay them out of band and set the transaction fee to 0 such that all revenue went to the proposer and none to the rest of the validators/delegators.

Having the means to enforce payment also supports the introduction of more advanced payment algorithms in the future.

Lastly, this change removes the possible incongruity that would form when it comes to gossiping transactions when consensus nodes use different minimum gas prices.

## Backwards Compatibility

This requires a modification to the block validity rules and thus breaks the state machine. It will need to be introduced in a major release.

It is important to consider that if this minimum gas price becomes more dynamic that wallets will need to be modified to continually query the network for the latest minimum gas price to be used for transaction submission.

## Test Cases

The target for testing will be to remove the ability for block proposers to offer block space to users in a way that circumvents the fee system currently in place. The exact tests cases will be expanded on later

## Reference Implementation

This section will be revised and fulfilled following its implementation

## Security Considerations

Any modification to the block validity rules (through `PrepareProposal` and `ProcessProposal`) introduces implementation risk that may cause the chain to halt.

In the initial version of this where a static value is used, changing the value because it is too high or too low will require another major upgrade and thus the value should begin quite conservative until the dynamic pricing mechanism is introduced.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
