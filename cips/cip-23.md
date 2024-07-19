```
---
cip: 23
title: Coordinated prevote times
description: Scheduled prevote times for consistent blocks
author: Callum Waters (@cmwaters)
discussions-to: https://forum.celestia.org/t/coordinated-start-time-intervals/1768
status: Draft
type: Standards Track
category: Core
created: 2024-07-12
---
```

## Abstract

Block propagation speed is dependent on block size, thus larger blocks have later block times. It is desirable that regardless of block size that blocks are finalized with a consistent cadence. This CIP proposes a solution to this problem, namely, correct processes that receive a valid proposal withthold their prevote until the `ProposalTimeout` has elapsed.

## Motivation

The current network has a cap of 2MB. We have observed in testnets that larger blocks (~8MB) shift the block time by up to 7 seconds (18 seconds in total with the default 11 second `TimeoutCommit`). This range of 11 - 18 seconds for blocks 0-8MB in size is too inconsistent for users. We want to provide block finality with a consistent cadence.

## Specification

The current system relied on a fixed timeout (known as `TimeoutCommit`) after finality to dictate the interval between block times. The proposed modification targets the proposal timeout. Currently, if a correct process does not receive a proposal within a set time `TimeoutPropose` after the round's start time, the process will prevote nil. This mechanism ensures liveness in the event that the proposer fails. This CIP makes the following modification:

- Upon receiving a correct proposal, a process will not immediately PREVOTE but wait until `TimeoutPropose` before sending their vote.
- Upon receiing an invalid proposal, the process will immediately PREVOTE nil.
- If a process is locked on a block, they will send PREVOTE votes immediately (this situaiton applies after the first round).

This mechanism can be switched on and off and is controlled by the application via the `ConsensusParams` in the `EndBlock` of the ABCI interface.

In addition, `TimeoutCommit` will also move from a local variable to one controlled by the application, as outlined in [ADR115](https://github.com/cometbft/cometbft/blob/main/docs/references/architecture/adr-115-predictable-block-times.md).

It is expected that enabling this mechanism would work alongside reducing the `TimeoutCommit`.

### Parameters

The proposal adds two variables that can be controlled by the application but will not be exposed by governance:

1. `EnableCoordinatedPrevotes`
2. `TimeoutCommit` (If 0, a node's local config time will be used - for backwards compatibility)
3. `TimeoutPropose` (If 0, a node's local config time will be used - for backwards compatibility)

Given a target block rate of 12 seconds, enabling this mechanism would coincide with changes to the following timeouts:

- `TimeoutPropose` remains at 10 seconds
- `TimeoutCommit` goes from 11 seconds to 1 second
- `EnableCoordinatedPrevotes` is set to `true`.

NOTE: These numbers are subject to benchmarking

### Rationale

The variables `TimeoutCommit` and `TimeoutPropose` were previously part of a node's local configuration. Switching these variables to be coordinated by consensus itself is critical.

## Backwards Compatibility

Enabling of this mechanism must be coordinated amongst all consensus nodes in the network. It should tie in with a major upgrade. The changes themselves can be made in a backwards compatible manner to `celestia-core` by having them be disabled by default.

## Test Cases

Testing must be designed around validating that this approach does achieve more consistent block times (i.e. a 1 second standard deviation). As this modifies the voting logic, testing should also verify that correct nodes always vote.

## Reference Implementation

TBC

## Security Considerations

This modification is small in scope and logically shouldn't imapact the properties of consensus, however this still makes modifications to the consensus algorithm and thus there is implementation risk.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
