---
cip: 18
title: Standardised Gas and Pricing Estimation Interface
description: A standardised interface for estimating gas usage and gas pricing for transactions
author: Callum Waters (@cmwaters)
discussions-to: https://forum.celestia.org/t/cip-standardised-gas-and-pricing-estimation-interface/1621
status: Draft
type: Standards Track
category: Interface
created: 2024-03-12
---

## Abstract

Introduce a standardised querying interface for clients to use to estimate gas usage and gas pricing for transactions. This is designed to promote the entry of third party providers specialising in this service and competing to offer the most reliable and accurate estimations.

## Motivation

The general motivation is improving user experience around transaction submission.

Currently, all clients wishing to submit transactions to the network need to obtain two things:

- An estimation of the amount of gas required to execute the transaction
- An estimation of the gas-price that will be sufficient to be included in a block.
  
All other aspects of signing and submission can remain local i.e. chainID, account number or sequence number.

Currently both these things can be provided if you have access to a trusted full node (which can simulate the transaction and return the global min gas price - which is sufficient in non-congested periods). This could be improved on in a few dimensions:

- Estimating the gas by simulating the execution of a transaction is a heavy procedure
- The minimum gas price is insufficient when there is congestion
- Not all nodes expose these endpoints and it may not be so simple to find endpoints that are trusted

In addition, Keplr provides some form of gas estimation but no gas price estimation. Users have to pick from "low", "medium", or "high"

## Specification

The following API is proposed for the standardised gas estimation service.

```proto
service GasEstimator {
    rpc EstimateGasUsage(EstimateGasUsageRequest) returns (EstimateGasUsageResponse) {}
    rpc EstimateGasPrice(EstimateGasPriceRequest) returns (EstimateGasPriceResponse) {}
}

message EstimateGasUsageRequest {
    cosmos.tx.Tx tx = 1;
}

message EstimateGasUsageResponse {
    uint64 estimated_gas_used = 1;
}

message EstimateGasPriceRequest {}

message EstimateGasPriceResponse {
    double estimated_gas_price = 1;
}
```

Given it's wide usage both in the Cosmos SDK and more broadly, the service would be implemented using gRPC. RESTful endpoints may optionally be supported in the future using something like `grpc-gateway`.

Given the expected reliance on clients, all future changes must be done in a strictly non-breaking way.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

## Rationale

Most of the rationale behind the necessity of a standard interface and it's definition is captured in the motivation section.

The notion of urgency, or within how many blocks does the user want their transaction to be submitted may be a useful parameter in the future but is currently left out of the original interface.

## Backwards Compatibility

As this is a new interface, no consideration for backwards compatibility is necessary

## Reference Implementation

The effectiveness of a "standardised" interface depends on the willingness of current and future clients to adopt it as well as the willingness of teams to provide those services. To set a sufficient precendent, both the Node API within `celestia-node` and the consensus node within `celestia-app` will implement client and server implementations respectively, creating an interface between the existing line of communication. That way by default, light nodes will use that API with the trusted provider they are already using for transaction submission.

The consensus node will use the SimulateTx method to estimate the gas used and use the `min_gas_price` parameter within state as the `estimated_gas_price`

The Node API will optionally allow a user to pass a url in the constructor. If this is not provided, the default will be to use the gRPC server of the consensus node. Users will still be able to manually set the gas used and gas price which will override any automated estimation.

## Security Considerations

It must be noted that this current service is trust-based. The service operates on a best-effort basis as it tries to most accurately predict the gas used and the gas price such that the transaction is included and the user has not needed to overpay. However, there is nothing preventing a "bad" service provider from providing estimates multitudes greater than is necessary. Guardrails on the client side should be in place to prevent significant waste of funds.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
