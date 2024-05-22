---
title: Support ZK-SNARKS via GNARK in the Celestia Core cryptography
description: Add the GNARK library to the Celestia Core codebase and make it available as an implementation tool for future CIPs.
author: Sam Hart (@hxrts), Barry Plunkett (@bpiv400), Kristi Poldsam (@poldsam), Zaki Manian (@zmanian)
discussions-to:
status: Draft
type: Standards Track
category: Core
created: 2024-02-20
---

## Abstract

This CIP proposed to standardize the use of succinct zero knowledge proofs in the Celestia core codebase. The CIP defines a set of cryptographic components that should be available to future CIPs that leverage zero knowledge proofs. The CIP also defines a set of proof systems that should be used in future CIPs. The CIP also defines a set of elliptic curves that should be used in future CIPs. The CIP also defines a set of security considerations that should be used in future CIPs.

## Motivation

A more expressive Celestia baselayer will enable rollup developers to more tightly integrate their protocols with the TIA asset and interoperate with core protocol features like staking, slashing, governance. Celestia's core value is keep the the base layer as minimal as possible. This precludes integrating an expressive smart contract language for integrating with the base layer. SNARKs provide a useful compromise. The succinctness property of a SNARK means that a developer can extend the Celestia base layer with an extremely small state footprint.

The selections made in this CIP were driven by availability and compatibility of tools and libraries. Another factor was stability and maturity of the proof systems and elliptic curves. The authors believe that the selections made in this CIP will provide a solid foundation for future CIPs that leverage zero knowledge proofs.

## Specification

### Proof Systems

Future CIPs that leverage SNARKs MUST use the following proof systems [GROTH16](https://eprint.iacr.org/2016/260) or [PlonK](https://eprint.iacr.org/2019/953).

Groth16 has two concrete implementations.

There is a hybrid implementation of Groth16 and LegoSNARK developed by the Gnark Consensys team. This implementation is appealing because of the fast prover that exists in the Go language. The authors believe that this implementation is the best choice for the Celestia core codebase.

We also reccomend adoption of a Circom/Arkworks compatible implementation of Groth16. This implementation is appealing because it is compatible with the Circom language and the Arkworks library. This form of Groth16 has seen wide use over many years in Ethereum and blockchain protocols. Circuits that verify other proofs systems like Risc0 and SP1 are available within this proof system.

PlonK is a newer proof system that has a universal trusted setup. This means that for a given circuit size the trusted setup only needs to be performed once. This is a differentiator from Groth16 that might be of substantial interest to future CIP authors.

### Elliptic Curves

Groth16 and Plonk are concretely implemented over pairing friendly elliptic curves. The authors reccomend the use of the BN254 curve and BLS12-377 curve. The BN254 curve is available as an Ethereum precompile. The BLS12-377 curve is appealing because it enables effecient depth 1 recursions. This makes it a compelling choice for protocols that benefit from either privacy or aggregation of proofs.

## Rationale

Two GROTH16 implementations allow picking between compatibility and state of the art prover performance. These choices are made to ensure that the Celestia core codebase can leverage existing circuits and trusted setups. Fortunately there are readilty available implementations of both Groth16 implementations suitable for integration with Celestia Core.

The BN254 curve is a well known curve that is available as an Ethereum precompile. The BLS12-377 curve is a newer curve that is appealing because it enables effecient depth 1 recursions. This makes it a compelling choice for protocols that benefit from either privacy or aggregation of proofs.

## Backwards Compatibility

_"No backward compatibility issues found."_

## Test Cases

Add test vectors here.

**TODO: Add test vectors here.**

## Reference Implementation

This section is optional.

The Reference Implementation section should include a minimal implementation that assists in understanding or implementing this specification. It should not include project build files. The reference implementation is not a replacement for the Specification section, and the proposal should still be understandable without it.

If the reference implementation is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/cip-####/`. External links will not be allowed.

**TODO: Remove the previous comments before submitting**

## Security Considerations

These are time tested cryptographic primitives and should be safe to use in the Celestia core codebase. There will be implementation specific security considerations that will need to be addressed in future CIPs.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
