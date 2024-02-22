---
title: Support ZK-SNARKS via GNARK in the Celestia Core cryptography
description: Add the GNARK library to the Celestia Core codebase and make it available as an implementation tool for future CIPs.
author: Sam Hart (@hxrts), Barry Plunkett (@bpiv400),Kristi Poldsam (@poldsam), Zaki Manian (@zmanian)
discussions-to: 
status: Draft
type: Standards Track
category: Core
created: 2024-02-20
---


## Abstract

This CIP proposes to add the GNARK library which contains the implementation of multiple pairing based Elleptic curves, the GROTH16 and PLONK proof systems. Adding this function to Celestia Core enables future CIPS to develop protocols that rely on proofs generated with these tools.



## Motivation

A more expressive Celestia base layer will enable rollup developers to more tightly integrate their protocols with the TIA asset and interoperate with core protocol features like staking, slashing, governance. Celestia's core value is keep the the base layer as minimal as possible. This precludes integrating an expressive smart contract language for integrating with the base layer. SNARKs provide a useful compromise. The succinctness property of a SNARK means that a developer can extend the Celestia base layer with an extremely small state footprint.

## Specification

Future CIPs that leverage SNARKs MUST use the following proof systems [GROTH16](https://eprint.iacr.org/2016/260) or [PlonK](https://eprint.iacr.org/2019/953). Future CIP SHOULD use either the BN254 or the BLS-12-377 pairing elleptic curves to instantiate the proof system.

To implement these future CIPs, the [GNARK library](https://github.com/Consensys/gnark) is reccomended as a GO implementation. celestia-core SHOULD add a release that conforms to the Security Considerations section.

Implement  a new SNARK interface in the crypto package.

```golang

type SNARK interface{
   Verify{[]bytes Proof} bool
}

```

Implement implementations of this inteface for 

Groth16-BN254, Groth16-BLS12377
PlonK-BN254, PlonK-BLS12377.







The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

## Rationale

The authors prefer these solutions.

1. GNARK is the most mature SNARK implementation in Go. Rust is by far the most popular language for ZK cryptography development. Other implementations would require embedding rust code in the celestia-core build system and making FFI calls. This will have cascading implications for the entire build, test, deploy process for Celestia. The authors prefer to defer these burdens until a future CIP.

2. BN254 is available as a Ethereum precompile as a result there a wide range of tools, trusted setup artifacts and more that target this curve.

3. BLS12-377 has the property of enabling effecient depth 1 recursions. This makes it a compelling choice for protocols that benefit from either privacy or aggregation of proofs. There is a also a wide range of tools available for this curve because of prior usage in protocols like Celo.

4. GROTH16 has been in production since ZCash's sapling protocol. It represents the MVP of SNARK proof systems. It can also act as "universal adapter" for other proof systems because there circuits that verify other proof systems available. GROTH16 requires a two phase trusted setup. The first phase is universal for a given circuit size but the second phase 

5. PlonK is a widely adapted SNARK that features a "universal" trusted setup. This means that for a target circuit size the trusted setup needs to only be performed once. This is a differentiator from Groth16 that might be of substantial interest to future CIP authors.






## Backwards Compatibility

 *"No backward compatibility issues found."*


## Test Cases

Add test vectors here.

**TODO: Add test vectors here.**

## Reference Implementation

This section is optional.

The Reference Implementation section should include a minimal implementation that assists in understanding or implementing this specification. It should not include project build files. The reference implementation is not a replacement for the Specification section, and the proposal should still be understandable without it.

If the reference implementation is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/cip-####/`. External links will not be allowed.

**TODO: Remove the previous comments before submitting**

## Security Considerations

GNARK has only had a limited audit that covers only a portion of functionality.

```
The scope of this work is a code audit of the Product written in Go, with a particular attention to safe implementation of hashing, randomness generation, protocol verification, and potential for misuse and leakage of secrets. The client has noted that constant-time analysis of the Product is out of scope of this audit. The target of the audit was the cryptographic code related to the elliptic curves BLS12- 381 and BN254 at https://github.com/ConsenSys/gnark-crypto. The BN254 curve is also named alt_bn128 in different context [6]. We audited the commit number: 450e0206211eea38bbb5b5ffddf262efe65bd011 of the repository/
```

The Audit scope required to deploy GNARK on celestia would require auditing the BLS-12-377 implementation, the GROTH16 verifier and PLONK verifier.

Production deployment should be blocked until such an audit is completed.



## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
