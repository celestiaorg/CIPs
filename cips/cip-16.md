---
cip: 16
title: Make Security Related Governance Parameters Immutable
description: Consensus-related parameters should not be modified via on-chain governance in the Celestia network.
author: Mingpei CAO (@caomingpei)
discussions-to: https://forum.celestia.org/t/cip-make-security-related-governance-parameters-immutable/1566
status: Draft
type: Standards Track
category: Core
created: 2024-02-07
requires: CIP-13
---

## Abstract

This CIP suggests that the security-critical governance parameters—`consensus.evidence.MaxAgeDuration` and `consensus.evidence.MaxAgeNumBlocks`—should be immutable to on-chain governance proposals. In light of the present Celestia specifications and the details provided in [CIP-13](cip-13.md), maintaining the mutability of those parameters could open the door to future on-chain proposals that alter their values, potentially leading to an inconsistency between the protocol and implementation. This CIP also briefly analyzes the potential security risks that may arise from the parameter modifications.

## Motivation

Consensus protocols play an important role in Celestia. As a Data Availability solution, the robustness of Celestia is crucial to the performance and reliability of higher-level applications, such as rollups. [CIP-13](cip-13.md) introduces a framework for the on-chain governance parameters. Considering that governance proposals have the potential to alter parameter values, it is essential to designate certain parameters as immutable for the on-chain governance to prevent inconsistencies and mitigate security risks.

## Specification

|  Param \ Changeable via Governance   | Current | **Proposed**  |
|:------------------------------------:|:-------:|:-------------:|
| `consensus.evidence.MaxAgeDuration`  |  True   |   **False**   |
| `consensus.evidence.MaxAgeNumBlocks` |  True   |   **False**   |

> Note:  Parameters listed in this table are identical to those module parameters specified in [CIP-13](cip-13.md). The purpose of this CIP is to modify the `Changeable via Governance` attribute of those two parameters from `True` to `False`.

## Rationale

Adopting an on-chain governance method comes with inherent risks of governance attacks, particularly concerning parameters related to `consensus.evidence`.
As outlined in the [decentralized governance documentation](https://docs.celestia.org/learn/staking-governance-supply), all holders of the native token TIA can propose and vote on on-chain governance proposals. It is unrealistic to expect the majority of holders to understand the technical details of the protocol and implementation thoroughly. Consequently, on-chain governance participants (a.k.a. TIA holders) may be incentivized (or, in some cases, bribed) to vote for or against a proposal without understanding the potential impact. Any changeable parameter within the `Governance Parameter for Celestia` could be targeted for changes through on-chain governance proposals. Therefore, making security-related parameters unchangeable for the on-chain governance proposal could serve as an effective solution to alleviate introduced risks.

### Inconsistency

| Module.Parameter                     | Default                    | Summary                                                                                                                             | Changeable via Governance |
|--------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| `consensus.evidence.MaxAgeDuration`  | 1814400000000000 (21 days) | The maximum age of evidence before it is considered invalid in nanoseconds. This value should be identical to the unbonding period. | True                      |
| `consensus.evidence.MaxAgeNumBlocks` | 120960                     | The maximum number of blocks before evidence is considered invalid. This value will stop CometBFT from pruning block data.          | True                      |
| ......                               | ......                     | ......                                                                                                                              | ......                    |
| `staking.UnbondingTime`              | 1814400 (21 days)          | Duration of time for unbonding in seconds.                                                                                          | False                     |

This is a part of the table introduced in [CIP-13](cip-13.md). The summary of parameter `consensus.evidence.MaxAgeDuration` states *"...This value should be identical to the unbonding period"*. Meanwhile, the parameter `staking.UnbondingTime` is NOT changeable since the `Changeable via Governance` is set to False. Suppose an on-chain governance proposal tries to modify the default value of `consensus.evidence.MaxAgeDuration` from `1814400000000000 (21 days)` to a different value. It would create an inconsistency between the description and implementation because the modified value would no longer be identical to the unbonding period.

### Security Risk

```go
func (evpool *Pool) verify(evidence types.Evidence) error {
    ...
    // check that the evidence hasn't expired
    if ageDuration > evidenceParams.MaxAgeDuration && ageNumBlocks > evidenceParams.MaxAgeNumBlocks {
        ...
    }
    ...
}
```

Those two parameters are used in the function of `verify.go`, which is responsible for verifying whether evidence has expired or not. According to the `if` statement, even without modifying `consensus.evidence.MaxAgeDuration`, it is still possible to prolong the expiration time of evidence by increasing `consensus.evidence.MaxAgeNumBlocks`, which means that older evidence will be considered valid. An extended expiration time of evidence introduces the potential risk of Resource Consumption, and a detailed discussion can be found in the Security Considerations.

Additionally, suppose that an on-chain governance proposal sets the `evidence.MaxAgeDuration` and `evidence.MaxAgeNumBlocks` to extremely low values, meaning that evidence expires quickly. If a malicious validator were to engage in Duplicate Vote or Light Client Attack, it would lead to consensus instability. Given that Celestia is a solution to data availability, this consensus instability would introduce security risk to the upper-layer applications (e.g. rollup). A detailed discussion can be found in the Security Considerations.

### Summary

In summary, configuring these two parameters as immutable values that can NOT be changed via on-chain governance can mitigate the risks of inconsistency and security issues introduced by unintentional (or malicious) governance activities. Moreover, in the face of a security incident that concerns these parameters, reliance on on-chain governance may be inadequate. Implementing modifications through a hard fork represents a more resilient approach.

## Backwards Compatibility

This CIP recommends freezing on-chain governance for two security related parameters, which introduces backward incompatibility. This incompatibility is due to any future modifications to these parameters requiring at least a hardfork.

## Reference Implementation

```diff
func (*App) BlockedParams() [][2]string {
    return [][2]string{
        ...
        // consensus.validator.PubKeyTypes
        {baseapp.Paramspace, string(baseapp.ParamStoreKeyValidatorParams)},
+       // consensus.evidence.MaxAgeDuration and .MaxAgeNumBlocks
+       {baseapp.Paramspace, string(baseapp.ParamStoreKeyEvidenceParams)},
	}
}
```

The above example serves as a conceptual illustration, and `MaxBytes` in `ParamStoreKeyEvidenceParams` should still remain changeable.

Besides, relevant documents should be updated accordingly, such as [Celestia App Specifications](https://github.com/celestiaorg/celestia-app/blob/main/specs/src/specs/params.md)

## Security Considerations

This CIP recommends setting those two parameters as immutable constants which are NOT allowed to change via on-chain governance proposals. Adopting this CIP means future changes for those two parameters require community coordination and hardforks. Although hardforks carry the community-divided risk, it is worth noting that many blockchain communities have successfully navigated multiple hardforks. The risks of division and disagreement can be minimized by thoroughly discussing and working towards widespread agreement before moving forward with a hardfork. Consequently, the risk is manageable and should not be a significant concern.

If the proposed two parameters have not been changed since genesis, the security impact of making them NOT changeable via on-chain governance is not significant. Besides, if modifications to those two parameters via on-chain governance are still allowed, this could not only result in the inconsistency between the protocol and implementation but also introduce the following potential security risks:

### Consensus Instability

```ascii
                                +---------------------+
                            ·—— | Block Header (H1)   |
                            |   +---------------------+    ......
                            |   | PayForBlobs         |
                            |   +---------------------+
+---------------------+     |
| Block Header (H0)   |     |
+---------------------+  <--|
| Block Body          |
+---------------------+  <--|
                            |
                            |
                            |   +---------------------+
                            ·—— | Block Header (H1')  |
                                +---------------------+   ......
                                | PayForBlobs'        |
                                +---------------------+
```

Assuming that `evidence.MaxAgeDuration` and `evidence.MaxAgeNumBlocks` are configured with extremely low values, such a configuration implies that evidence would expire rapidly. Under these conditions, malicious validators might exploit the system by double voting on two blocks simultaneously, potentially leading to temporary network partitions. In the context of a Data Availability solution like Celestia, any instability in consensus could compromise the blob transactions. This situation risks the security and reliability of upper-layer rollups dependent on this infrastructure.

### Resource Consumption

Resource consumption attacks targeting ComeBFT consensus algorithms aim to exploit the resource constraints of nodes within the network. The summary of `consensus.evidence.MaxAgeNumBlocks` states *"...This value will stop CometBFT from pruning block data"*. If the pruned window is set too large, nodes must store all the relevant data for the extended period, which can inundate their storage and memory capacity.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
