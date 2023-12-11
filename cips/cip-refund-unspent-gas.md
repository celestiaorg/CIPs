---
title: Refund unspent gas
description: Refund allocated but unspent gas to the transaction fee payer.
author: Rootul Patel (@rootulp)
discussions-to: URL
status: Draft
type: Standards Track
category: Core
created: 2023-12-07
---

## Abstract

Refund allocated but unspent gas to the transaction fee payer.

## Motivation

When a user submits a transaction to Celestia, they MUST specify a gas limit. Regardless of how much gas is consumed in the process of executing the transaction, the user is always charged a fee based on their transaction's gas limit. This behavior is not ideal because it forces users to accurately estimate the amount of gas their transaction will consume. If the user underestimates the gas limit, their transaction will fail to execute. If the user overestimates the gas limit, they will be charged more than necessary.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

Consider adding a posthandler that:

1. Disables the gas meter so that the following operations do not consume gas or cause an out of gas error.
1. Calculate the amount of coins to refund:
    1. Calculate the transaction's `gasPrice` based on the equation `gasPrice = fees / gasLimit`.
    1. Calculate the transaction's fee based on gas consumption: `feeBasedOnGasConsumption = gasPrice * gasConsumed`.
    1. Calculate the amount to refund: `amountToRefund = fees - feeBasedOnGasConsumption`.
1. Determine the refund recipient:
    1. If the transaction had a fee granter, refund to the fee granter.
    1. If the transaction did not have a fee granter, refund to the fee payer.
1. Refund coins to the refund recipient. Note: the refund is sourced from the fee collector module account (the account that collects fees from transactions via the `DeductFeeDecorator` antehandler).

## Rationale

The entire fee specified by a transaction is deducted via an antehandler (`DeductFeeDecorator`) prior to execution. Since the transaction hasn't been executed yet, the antehandler does not know how much gas the transaction will consume and therefore can't accurately calculate a fee based on gas consumption. To avoid underestimating the transaction's gas consumption, the antehandler overcharges the fee payer by deducting the entire fee.

This proposal suggests adding a posthandler that refunds a portion of the fee for the unspent gas back to the fee payer. At the time of posthanlder execution, the gas meter reflects the true amount of gas consumed during execution. As a result, it is possible to accurately calculate the amount of fees that the transaction would be charged based on gas consumption.

The net result of the fee deduction in the antehandler and the unspent gas refund in the posthandler is that user's will observe a fee that is based on gas consumption (`gasPrice * gasConsumed`) rather than based on gas limit (`gasPrice * gasLimit`).

## Backwards Compatibility

This proposal is backwards-incompatible because it is state-machine breaking. Put another way, state machines with this proposal will process transactions differently than state machines without this proposal. Therefore, this proposal cannot be introduced without an app version bump.

## Test Cases

TBA

## Reference Implementation

TBA

## Security Considerations

### DoS attack

This proposal has implications on how many transactions can be processed in a block. Currently `consensus/max_gas = -1` which means there is no upper bound on the amount of gas consumed in a block. However, if this proposal is implemented AND the `consensus/max_gas` parameter is modified, then a single transaction could prevent other transactions from being included in the block by specifying a large gas limit and actually consuming a small amount of gas. Since the unspent gas would be refunded to the fee payer, an attacker could perform this attack for low cost. Notably, this attack vector arises because the block gas meter is deducted by `BaseApp.runTx` after transaction processing.

Proposed mitigation strategy:

Consider bounding the amount of gas that can be refunded to the fee payer. For example bound the amount of gas that can be refunded to 50% of the original gas limit.

### Gas metering during unspent gas refund

This proposal includes adding a posthandler that explicitly disables gas metering during the execution of the unspent gas refund. This is a risky change because an attacker may be able to craft a transaction that performs a large amount of computation while executing the unspent gas refund posthandler.

Proposed mitigation strategy:

1. Analyze the amount of gas consumed by the refund posthandler for a variety of transactions.
1. Define a new constant `MaxRefundGasCost` that is the maximum amount of gas that can be consumed by the refund posthandler.
1. If the transaction reaches the post handler with less remaining gas than `MaxRefundGasCost` then skip the refund.
1. If the transaction reaches the post handler with more remaining gas than `MaxRefundGasCost` then refund `gasMeter.GasRemaining() - MaxRefundGasCost`.

### Implementation risk

TBA

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
