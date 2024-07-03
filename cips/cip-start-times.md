---
title: Coordinated Start Time Intervals
description: Modify vote times t
author: Callum Waters (@cmwaters)
discussions-to: URL
status: Draft
type: Standards Track
category: Core
created: 2024-03-15
---

## Abstract

Modify the block time protocol to coordinate around the start time as opposed to the commit time. This aims to achieve more consistent block time averages. Instead of a static wait time after committing a block, the wait time will adjust such that the start time of the next height is some chosen target duration after the previous start time.

## Motivation

Currently, the time it takes to commit to a block is propotional to the size of that block (largely owing to the block propagation mechansim). Celestia currently has an 11 second timeout commit which means when blocks are near empty we see block times of around 11.5 seconds, but when the network is put under load with 8MB blocks, this rises to 18 seconds. This CIP proposes adjustments such that the average interval between block times is consistent (based on a `TargetInterval` parameter). This however does not expect to impact the standard deviation of block times.

## Specification

The following modifications are proposed:

- Validators select a vote time that is their `cs.StartTime` as opposed to their current time when they vote for a block.
  - In the case, that `cs.StartTime` is after the locked or proposal block time, the validator will pick a time that is 1 millisecond later to satisfy the property of increasing block times.
  - In the case of the first block, the start time will be the current time.
- Upon receiving 2f + 1 PRECOMMIT votes, each validator calculates the **local** stake-weighted median start time from those votes. It sets the new start time of the next height to be the aforementioned calculated time plus the `TargetInterval`.
  - If the nodes local time is after the new start time, then the node will start immediately. This will be the case for heights that require multiple rounds to come to consensus.
- A proposer MUST include a block time in the header that is equal to the stake-weighted median start time of the precommit votes that are included in the LastCommit of the proposed block + the `TargetInterval`.
  - All validators MUST verify that the block time has been calculated as per the above rules. If not, the block will not be accepted.
- `TargetInterval` is part of `BlockParams` within `ConsensusParams`. A `TargetInterval` of zero signifies that this mechanism is disabled. The `TargetInterval` CAN be set in a hard fork upgrade when all nodes are running the latest version, activating the new timing mechnanism.
- The `TargetInterval` once activated will be set to 12 seconds. `TargetInterval` can not be modified via governance and SHOULD only change in major version upgrades.

## Parameters

| Parameter     | Proposed value | Description                                                                                                                | Changeable via Governance |
|---------------|---------|------------------------------------------------------------------------------------------------------------------------|---------------------------|
| BlockParams.TargetIntervalMS | 12 seconds  | The target interval between start times in milliseconds                                                            | false                     |

## Rationale

Given the asynchronous nature of networks, it's difficult to coordinate around the commit times as it's difficult to predict how long it will take to commit a block. What is more predictable is too coordinate around the start times i.e. the time that the proposer begins to propose a block. By including every validators start time in their votes, we have a relatively robust reference point for all nodes. The start time of the next height.

## Backwards Compatibility

Enabling of this mechanism must be coordinated amongst all consensus nodes in the network. It should tie in with a major upgrade. The changes themselves can be made in a backwards compatible manner to `celestia-core` by having them be disabled by default.

## Reference Implementation

To be filled out.

## Security Considerations

This modification changes the time located in the block to be the stake-weighted median of the start times of 2f + 1 validators from the previous block. `TargetInterval` is added to this as an approximation of when the current block was actually started. This is different from the how the current block time is calculated, however, this shift in the times is not expected to have any downstream impact.

Similar with traditional bft time, a malicious cabal greater than 1/3 can manipulate the block time to be any time in the future.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
