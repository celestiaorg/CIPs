| cip | XX (assigned by Editors) |
| - | - |
| title | Lowering Trusting Period to 7 Days |
| description | This CIP proposes to reduce Celestia's trusting period (weak subjectivity period) to 7 days, consequently setting the light node sampling window to 7 days. |
| author | Nashqueue (@nashqueue) |
| discussions-to | <https://forum.celestia.org/t/frame-by-frame-unpacking-celestia-s-windows-and-parameters/2001> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2025-06-05 |

## Abstract

This CIP proposes a reduction of Celestia's `trusting period`, also known as the `weak subjectivity period`, from its current implicit value (understood to be 14 days) to `7 days`. This change directly implies that the `sampling window` required for light nodes to verify data availability will also be set to `7 days`.
The primary goal is to optimize resource usage for light clients and reduce finality times for applications, particularly rollups, built on Celestia. This also paves the way for reducing the unbonding period for validators.
This proposal explicitly decouples the `trusting period` and `sampling window` from the `data pruning window`, allowing the `pruning window` to be configured independently based on storage and data retention policies. This change supersedes aspects of `CIP-004` related to the `sampling window` duration and clarifies that pruning parameters are distinct from the `trusting period`.

## Motivation

The current `trusting period`, while ensuring a high degree of security, can lead to longer sync times for nodes rejoining the network after being offline. Reducing the `trusting period` to `7 days` aims to:

1. **Optimize Resource Usage for Light Clients:** Light clients will only need to sample data over a `7-day window` cutting total bandwidth requirements by 75%.
2. **Optimize Resource Usage for Full Nodes:** Full nodes will only need to store and distribute samples in blocks that were created in the last 7 days.
3. **Potentially reduce the unbonding period for validators:** The `unbonding period` for validators could be reduced to be closer to the new `trusting period` of `7 days`.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

0. **Trusting Period Definition:** The `trusting period` (also known as the `weak subjectivity period`) is defined as the maximum duration a node `MAY` safely remain offline and later rejoin the network by sampling historical data within this period without requiring an external trust assumption for the time it was offline.
1. **Trusting Period Reduction:** The `trusting period` for the Celestia network `SHALL` be set to `7 days`.
2. **Sampling Window Adjustment:** Consequently, the data availability `sampling window` for light nodes `SHALL` be `7 days`. Light nodes `MUST` sample data for this exact duration to verify the chain's integrity after being offline. This adjusts the `sampling window` parameter previously discussed in `CIP-004`.
3. **Unbonding Period Constraint:** The `unbonding period` for validators `MUST` be greater than or equal to the new `trusting period` of `7 days`. It is `RECOMMENDED` that the `unbonding period` be reviewed and potentially adjusted to align with this new, shorter `trusting period`, but it `MUST NOT` be less than `7 days`.
4. **Pruning Window Decoupling:** The data `pruning window` (how long full nodes retain block data) `SHALL` be decoupled from the `trusting period`. It `MAY` be set to a value different from `7 days` (e.g., 14 days or longer), based on network data retention policies and storage considerations. This CIP does not mandate a specific `pruning window` but clarifies its independence from the `trusting period`, diverging from any interpretations that couple it with data pruning parameters.

## Parameters

The following parameter change is proposed for the Celestia network:

| Parameter                 | Current value (Implicit) | Proposed value | Description                                                                                                                               | Changeable via Governance |
|---------------------------|--------------------------|----------------|-------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| `TrustingPeriod`          | 14 days                  | 7 days         | The maximum duration a node may safely remain offline and later rejoin the network without external trust; also defines the sampling window. | Yes                       |
| `MinSamplingWindow`       | 30 days (from `CIP-004`)  | 7 days         | The minimum period light clients must sample for data availability.                                                                      | Yes                       |

*(Note: The exact parameter name, e.g., `TrustingPeriod`, `WeakSubjectivityPeriod`, `SamplingWindow`, might vary across different client implementations or modules. This table reflects the conceptual change. The `MinSamplingWindow` from `CIP-004` is effectively superseded by this new `TrustingPeriod` which dictates the exact sampling duration.)*

## Rationale

The decision to reduce the `trusting period` to `7 days` is based on a balance of how long nodes can remain offline and improving  for node requirements.

- **7-Day Window:** A `7-day period` is considered sufficiently long to accommodate most routine node downtimes (e.g., maintenance, temporary outages) while being significantly shorter than the previous `14-day period`. .
- **Equivalence of Sampling and Trusting Period:** The `sampling window` must be equivalent to the `trusting period`. Sampling less would expose nodes to risks from attacks during their offline period. Sampling more is unnecessary and could lead to false positives if data has been (correctly) pruned by full nodes.
- **Decoupling from Pruning Period:** The `pruning window` serves a different purpose: managing data retrieval service guarantees of full nodes. Decoupling it from the `trusting period` allows the network to set data retention policies (e.g., 14 days, 30 days, or more) based on economic incentives and data retrievability needs, without constraining the security parameters related to `weak subjectivity period`. This CIP clarifies this decoupling, ensuring that changes to the `trusting period` do not inadvertently force changes to data retention strategies, and vice-versa, moving away from any linkage with data pruning parameters in this context.
- **Impact on Unbonding Period:** The `unbonding period` must be at least as long as the `trusting period` to prevent validators from unbonding and escaping slashing for misbehavior that is discovered within the `trusting period`. Lowering the `trusting period` to `7 days` allows for a potential reduction in the `unbonding period`, which can improve capital efficiency for validators. However, this CIP only mandates the minimum constraint (>= `7 days`).

## Backwards Compatibility

This CIP introduces changes that require coordinated updates across the network:

1. **Node Updates:** All node types (light nodes, full nodes, validators) `MUST` be updated to recognize and operate with the new `7-day trusting period`.

    - Light nodes configured with the old `14-day sampling window` might attempt to sample data beyond the new `7-day window`. If full nodes adopt a `pruning window` shorter than 14 days (though still longer than `7 days`, e.g., 10 days), these older light nodes could encounter issues or raise false alarms about data unavailability. However, the primary concern is ensuring all nodes operate on the *same* understanding of the `trusting period`.
    - Nodes that do not update will operate with outdated security assumptions, potentially leading to them following a minority fork if a long-range attack scenario were to occur that is preventable by nodes aware of the correct (shorter) `trusting period`.

2. **IBC Light Clients and Bridges:** IBC light clients and bridges connected to Celestia `MUST` update their `trusting period` configurations to align with Celestia's new `7-day period`. This is critical for maintaining their security, as detailed in the Security Considerations section.

## Security Considerations

This CIP has several important security implications:

1. **IBC Light Clients and Bridges:**
    - **Context:** IBC connections rely on a Tendermint light client on the counterparty chain (or bridge module) which is initialized with a specific `trusting period`. This period defines the maximum time the light client will accept headers from Celestia's validator set without requiring a fresh, trusted checkpoint. If Celestia's on-chain `trusting period` is reduced (e.g., to `7 days`), but an IBC light client's configuration remains at an older, longer value (e.g., 14 days), a critical security mismatch occurs.
    - **Risk:** An IBC light client with an outdated (longer) `trusting period` will continue to trust headers that Celestia full nodes would consider stale and potentially insecure. This vulnerability can lead to:
        - **Long-Range Fork Acceptance:** The IBC client could be deceived into following a malicious fork of Celestia. This fork might be older than Celestia's new `7-day trusting period` (and thus rejected by Celestia nodes) but still within the IBC client's outdated, longer `trusting period`. Accepting such a fork can result in invalid cross-chain state, incorrect transaction processing, and potential asset loss or duplication on the connected chain.
        - **Inconsistent Validator Set Views:** The IBC client might trust a validator set that Celestia no longer recognizes as valid due to unbonding or slashing events that occurred after Celestia's `7-day` window but within the IBC client's longer, stale window. This discrepancy can lead to the IBC client making incorrect assumptions about the state of Celestia.
    - **Mitigation:**
        - It is `CRITICAL` that all IBC light clients and bridge modules connected to Celestia update their `trusting period` configuration to match Celestia's new `7-day period`. To account for potential network or processing latencies, this configured value `SHOULD` ideally be Celestia's `7-day period` or a slightly shorter duration.
        - This update `REQUIRES` **updating the light client state** on the counterparty chain or bridge module. The existing light client instance `MUST` be replaced with a new one configured with the correct `7-day trusting period`.
        - All bridge operators and relayer teams `MUST` be proactively informed and `MUST` participate in this coordinated upgrade. Failure to update and coordinate risks client desynchronization, the processing of invalid headers, acceptance of rejected forks, and significant security vulnerabilities for connected chains and applications.

2. **Uniform Adoption of Trusting Period:**
    - **Risk:** If different nodes in the network operate with different `trusting periods`, it can lead to network fragmentation. Nodes with a longer `trusting period` might accept a chain that nodes with the correct, shorter `trusting period` would reject.
    - **Mitigation:** The change to a `7-day trusting period` `SHOULD` be adopted uniformly by all Celestia node types (light, full, validator) through a coordinated network upgrade. You can do a slow rollout and let nodes stay in the longer trusting period as long as the unbonding period is not reduced.

3. **Unbonding Period:**
    - **Risk:** The `unbonding period` `MUST` remain greater than or equal to the `trusting period` (`7 days`). If it were shorter, a malicious validator could unbond and withdraw their stake before their misbehavior (e.g., involvement in creating a long-range attack fork) is detected by nodes that were offline and subsequently re-synced within the `trusting period`.
    - **Mitigation:** Ensure the `unbonding period` is not set below `7 days`. Any proposal to change the `unbonding period` must respect this constraint.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
