| cip | XX |
| - | - |
| title | Dynamic block pacing with an 800 ms floor |
| description | Add a dynamic timeout commit that floors the block interval, and rescale block-count parameters to 0.8 second blocks. |
| author | Rachid Chami ([@rach-id](https://github.com/rach-id)) |
| discussions-to | <https://github.com/celestiaorg/celestia-app/issues/8072> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2026-10-30 |
| requires | [CIP-48](./cip-048.md) |

## Abstract

This CIP adds a new consensus timeout, `DynamicTimeoutCommit`, that the application returns in `TimeoutInfo` next to the existing timeouts. When it is non-zero, a node schedules height `H+1` no earlier than `DynamicTimeoutCommit` after it started height `H` (or after it committed `H`, if that came first), measured on its own clock, instead of waiting a fixed time after each phase. When it is zero, nodes pace heights exactly as today, so chains and app versions that do not set it are unaffected. `TimeoutCommit` and `DelayedPrecommitTimeout` keep their current meaning. In app version 11, `DynamicTimeoutCommit` is 800 ms, `TimeoutCommit` is 1 ns, `DelayedPrecommitTimeout` is 0, and the base `TimeoutPropose`, `TimeoutPrevote` and `TimeoutPrecommit` values are halved. The parameters counted in blocks are rescaled by 3.25, the ratio of the current 2.6 second block interval to 0.8 seconds, so that they keep their durations, and the IBC `MaxExpectedTimePerBlock` parameter is lowered from 13 seconds to 4 seconds.

## Motivation

[CIP-48](./cip-048.md) set the block interval to about 2.6 seconds. A node precommits no earlier than `DelayedPrecommitTimeout` (2100 ms) after the height starts, and starts the next height `TimeoutCommit` (500 ms) after it sees +2/3 precommits, or as soon as it has executed the block if that takes longer. Both values are waits. Blocks are about 2.6 seconds apart however little work they carry (2.85 seconds measured on Mainnet), and work that overruns one wait is not offset by slack in the other.

Celestia targets 32 MiB blocks at a sub-second cadence. Reaching that target by shrinking the two waits keeps the same structure: each wait must be tuned for the slowest expected phase it covers, and every block pays both in full. A floor removes the coupling. When the work of a height fits in the floor, the interval is the floor. When it does not, the next height starts as soon as the block is committed and executed, and the block pays only for its own work.

The floor also makes execution time visible in the block interval. Under the current rule, faster block execution shortens the time a node spends executing but not the interval, because the node then sleeps for the remaining waits. Under the floor, any saving on a height whose work exceeds the floor shortens the interval.

The floor is a new value rather than a new meaning for `TimeoutCommit` so that a node running the new celestia-core keeps the exact behaviour of every app version that does not opt in. App version 10 keeps its 2.6 second blocks on the new software until the network activates app version 11.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

1. **ABCI**: `TimeoutInfo` gains field 9, `google.protobuf.Duration dynamic_timeout_commit`. celestia-core MUST store it in its state with the other timeouts at every site where it stores them: `InitChain`, every `FinalizeBlock`, and the `Info` response used to complete state sync.
1. **Height pacing (celestia-core)**: Let `StartTime(H)` be the time at which a node schedules round 0 of height `H`, and `CommitTime(H)` the time at which it sees +2/3 precommits for a block at height `H`, both on the node's own clock. `TimeoutCommit` is the value the application returned in `TimeoutInfo`, or the node's local `timeout_commit` setting if that value is zero.
    1. If `DynamicTimeoutCommit` is 0, a node MUST set `StartTime(H+1) = CommitTime(H) + TimeoutCommit`, as today, and rules 2.3 and 2.5 do not apply.
    1. If `DynamicTimeoutCommit` is greater than 0, after a node commits and executes height `H` it MUST set `StartTime(H+1) = max(now, CommitTime(H) + TimeoutCommit, Anchor(H) + DynamicTimeoutCommit)`. `Anchor(H)` is `StartTime(H)`, except that it is `CommitTime(H)` on the first height committed after start-up, on the first height for which `DynamicTimeoutCommit` is non-zero after being 0, and when `CommitTime(H)` is before `StartTime(H)`. At start-up, before it has committed a height, a node MUST set `StartTime = now + max(TimeoutCommit, DynamicTimeoutCommit)`.
    1. A node MUST NOT enter round 0 of height `H+1` before `StartTime(H+1)`, unless it has received precommits from +2/3 of the voting power in round 0 of `H+1`, for any mix of blocks and nil, or it is replaying its write-ahead log. A complete proposal received before `StartTime(H+1)` MUST be held until then. The gate applies only to round 0: a node enters a higher round on +2/3 votes for it as usual. With `skip_timeout_commit` enabled, receiving all precommits for `H` no longer starts round 0 of `H+1` early; round 0 still waits for `StartTime(H+1)`.
    1. A node MUST commit a block as soon as it has +2/3 precommits for it, from any step. The floor MUST NOT delay a commit.
    1. If the node's clock moves backward, the wait for `StartTime(H+1)` MUST NOT exceed `max(DynamicTimeoutCommit, TimeoutCommit)` from the current time.
    1. `DelayedPrecommitTimeout` keeps its meaning for every value of `DynamicTimeoutCommit`: a node precommits no earlier than `DelayedPrecommitTimeout` after `StartTime(H)`, and 0 disables the delay.
    1. The `DynamicTimeoutCommit` returned for height `H` applies to `StartTime(H+1)`. The other timeouts keep their current lag.
1. **Consensus timeouts (celestia-app)**: The application MUST return the timeouts of the app version in state after the block's state transition in `TimeoutInfo` from `InitChain`, `FinalizeBlock` and `Info`.
    1. App version 10 SHALL keep the values in [CIP-48](./cip-048.md), and app versions 10 and below SHALL return `DynamicTimeoutCommit = 0`.
    1. For app version 11, `DynamicTimeoutCommit` SHALL be 800 ms.
    1. For app version 11, `TimeoutCommit` SHALL be 1 ns. A zero `TimeoutCommit` would fall back to the node's local `timeout_commit` setting.
    1. For app version 11, `DelayedPrecommitTimeout` SHALL be 0.
    1. For app version 11, `TimeoutPropose`, `TimeoutPrevote` and `TimeoutPrecommit` SHALL be 1500 ms, 1000 ms and 1500 ms. `TimeoutProposeDelta`, `TimeoutPrevoteDelta` and `TimeoutPrecommitDelta` remain 500 ms.
1. **Block-count parameters**: The block-count parameters in the table below SHALL be set to their app version 10 values multiplied by 3.25 (2.6 s / 0.8 s), or, for the upgrade height delays, to their duration divided by 0.8 s, so that they keep their durations. The v11 upgrade handler MUST set the on-chain values on existing chains, replacing any current value, and new chains MUST use them in genesis. The node-local values are defaults and startup minimums of the v11 binary. Parameters counted in time are unchanged, except those defined as a multiple of the block interval (`MaxExpectedTimePerBlock` and the Fibre `HostRefreshInterval` default).
1. **IBC `MaxExpectedTimePerBlock`**: The parameter MUST be reduced from 13 seconds to 4 seconds, 5 times the 800 ms floor, by the v11 upgrade handler and in genesis.
1. **Network upgrade**: These changes are state-breaking and MUST be activated together by the v11 network upgrade. Every validator MUST run a celestia-core version that implements `DynamicTimeoutCommit` before the activation height.

## Parameters

| Parameter | App version 10 | App version 11 | Where it is set | Changeable via Governance |
|-----------|----------------|----------------|-----------------|---------------------------|
| `DynamicTimeoutCommit` (new) | 0 (disabled) | 800 ms | Versioned constant | No |
| `TimeoutCommit` | 500 ms | 1 ns | Versioned constant | No |
| `DelayedPrecommitTimeout` | 2100 ms | 0 ms | Versioned constant | No |
| `TimeoutPropose` | 3000 ms | 1500 ms | Versioned constant | No |
| `TimeoutPrevote` | 2000 ms | 1000 ms | Versioned constant | No |
| `TimeoutPrecommit` | 3000 ms | 1500 ms | Versioned constant | No |
| `TimeoutProposeDelta`, `TimeoutPrevoteDelta`, `TimeoutPrecommitDelta` | 500 ms | 500 ms | Versioned constant | No |
| `consensus.evidence.MaxAgeNumBlocks` | 404,400 | 1,314,300 | v11 upgrade handler, genesis | No |
| `slashing.SignedBlocksWindow` | 10,000 | 32,500 | v11 upgrade handler, genesis | Yes |
| `staking.HistoricalEntries` | 10,000 | 32,500 | v11 upgrade handler, genesis | Yes |
| `fibre.PaymentPromiseHeightWindow` | 1,000 | 3,250 | v11 upgrade handler, genesis | Yes |
| `CortoUpgradeHeightDelay` | 33,231 | 108,000 | Constant (1 day) | No |
| `MochaUpgradeHeightDelay` | 66,462 | 216,000 | Constant (2 days) | No |
| `MainnetUpgradeHeightDelay` | 232,616 | 756,000 | Constant (7 days) | No |
| `ibc.ConnectionGenesis.Params.MaxExpectedTimePerBlock` | 13 s | 4 s | v11 upgrade handler, genesis | Yes |
| Mempool `ttl-num-blocks` (minimum) | 36 | 117 | Node default, raised at startup | Node-local |
| `min-retain-blocks` (minimum) | 3,000 | 9,750 | Node default, raised at startup | Node-local |
| State sync `snapshot-interval` | 1,500 | 4,875 | Default for new `app.toml` files | Node-local |
| Fibre validator-set cache size | 512 heights | 1,664 heights | Constant | No |
| Fibre client `HostRefreshInterval` default | 2.6 s | 0.8 s | Constant (one block) | Client-local |

Parameters counted in time keep their values, except the two defined as a multiple of the block interval above. Unchanged: `MaxAgeDuration` and `UnbondingTime` (337 hours), `DowntimeJailDuration`, the governance periods, the Fibre `WithdrawalDelay`, `PaymentPromiseTimeout` and `ShardRetention`, the inflation schedule, and the mempool `MaxGossipDelay`. The SDK pruning default (`keep-recent` 362,880 heights) is not set by the application and is left to operators. The 2.6 second figure is nominal; Mainnet measures about 2.85 seconds.

## Rationale

**Why a floor instead of two waits?** Two per-phase waits are each paid in full. A floor is charged only when the height finishes early. Small blocks are produced every 800 ms, and large blocks are produced as fast as validators can propose, vote on and execute them. This is the property that lets the network target sub-second blocks at 32 MiB without tuning the waits for the slowest block.

**Why a new field?** Giving `TimeoutCommit` the floor meaning would change the block time of every chain and app version that runs the new celestia-core, including app version 10 before the v11 activation. A separate value that is zero by default leaves every existing configuration exactly as it is and lets the application switch pacing at an app version boundary.

**Why 800 ms?** It is the target block time for app version 11. It leaves room for proposal propagation and the prevote and precommit steps across a globally distributed validator set when blocks are small.

**Why 1 ns and not 0 for `TimeoutCommit`?** celestia-core reads a zero `TimeoutCommit` as "use the node's `timeout_commit` setting", which existing nodes have set to 500 ms. 1 ns removes the sleep after commit on every node regardless of its configuration. `DelayedPrecommitTimeout` has no such fallback, so 0 disables it.

**Why halve the round timeouts?** The round timeouts only matter when a round fails. With 2.6 second blocks, a failed round 0 cost about 3 seconds of `TimeoutPropose` before round 1. At an 800 ms floor that would be almost four blocks. Halving the base values keeps recovery proportionate while leaving the deltas, which grow the timeouts on every further round, unchanged so that a network under stress still converges.

**Why anchor on the node's previous start time?** Anchoring on `StartTime(H)` rather than the commit time makes the floor start-to-start, so voting and execution count towards the interval. Anchoring on the node's own clock rather than on the proposal timestamp means no peer can shorten or lengthen a node's floor.

**Multi-round heights.** A height that needs more than one round usually takes longer than the floor, so the next height starts immediately after the commit; if it does not, the floor applies as usual. Either way, the network does not produce a burst of short heights to catch up with a schedule.

**Local clocks.** The floor is per node. Nodes that started a height at different times keep that offset, so the network-wide interval averages `DynamicTimeoutCommit` when each height's work fits in the floor, rather than equalling it at every height.

**Nodes that are behind.** A node commits on +2/3 precommits from any step, and the floor never delays a commit, so a node that is behind catches up at the speed of block verification.

**Why rescale the block counts?** Each of these parameters stands for a duration: a liveness window, an evidence window, a promise window, a retention window or an upgrade notice period. Keeping the block counts would shorten each of them by 3.25 times. For example, the Fibre payment promise window would drop from 43 minutes to 13 minutes and the mempool TTL from 94 seconds to 29 seconds. Rescaling keeps the durations that were chosen for them.

**`MaxAgeNumBlocks` and the unbonding period.** Evidence expires only once both `MaxAgeDuration` and `MaxAgeNumBlocks` are exceeded, so the block bound must not outlast the unbonding period ([CIP-37](./cip-037.md)). The app version 10 value, 404,400, is 337 hours divided by a 3 second upper bound on block time. 1,314,300 keeps that bound only while blocks average at most 0.923 seconds. The 800 ms floor leaves 123 ms of headroom. If the average interval rises above 0.923 seconds, evidence can be submitted after the stake it would slash has unbonded. A follow-up can lower the value if measured block times approach that bound.

## Backwards Compatibility

This change is not backwards compatible. All consensus nodes must upgrade to the new software before the v11 activation height.

App version 10 and below return `DynamicTimeoutCommit = 0`. A network still at app version 10 whose validators run the new celestia-core therefore keeps the pacing of [CIP-48](./cip-048.md), about 2.6 seconds per block, and mixes nodes on the previous and the new celestia-core without effect on pacing. The block-count parameters change only at the v11 activation, together with the timeouts.

celestia-core versions that predate this CIP ignore field 9. With the app version 11 values (`TimeoutCommit` 1 ns, `DelayedPrecommitTimeout` 0) they would run with no floor at all, so every validator MUST run the new celestia-core before the activation height. This is the case for any v11 binary.

On a node that runs the v11 binary before the activation height, the node-local minimums (`ttl-num-blocks` 117, `min-retain-blocks` 9,750) apply at 2.6 second blocks until activation. They keep transactions and blocks longer than before, which is harmless.

Changing `slashing.SignedBlocksWindow` keeps each validator's missed-block counter and bitmap. Entries recorded at the old window size age out over the first new window.

Client applications and tooling that estimate confirmation times or convert between heights and timestamps should assume an 800 ms minimum block interval from app version 11 and measure the actual interval, which varies with load.

## Test Cases

1. celestia-core tests check that with `DynamicTimeoutCommit = 0` the start time, round 0, proposals and `skip_timeout_commit` behave exactly as before, and that `DynamicTimeoutCommit` is stored from `InitChain`, `FinalizeBlock` and state sync.
1. celestia-core tests check that with `DynamicTimeoutCommit > 0` the interval between idle heights is the floor, a slow block starts the next height immediately, a multi-round height does not shorten the next one, and a node that is behind catches up without waiting for the floor at each height.
1. celestia-app unit tests check that `InitChain`, `FinalizeBlock` and `Info` return the app version 10 values at app version 10 and the values in this CIP at app version 11, and that the upgrade handler sets every rescaled parameter.
1. A docker end-to-end test upgrades a chain from app version 10 to 11 and checks the timeouts, the rescaled parameters and the IBC parameter.
1. A 10-validator network run checks the idle interval and the behaviour under 32 MiB blocks. The changes will then be tested on the Corto devnet and the Mocha testnet before activation on Mainnet.

## Reference Implementation

- [celestia-core#3539](https://github.com/celestiaorg/celestia-core/pull/3539): `TimeoutInfo.dynamic_timeout_commit` and the pacing rule.
- [celestia-app#8411](https://github.com/celestiaorg/celestia-app/pull/8411): versioned consensus timeouts, the rescaled block-count parameters and the v11 upgrade handler.

## Security Considerations

1. **Validator infrastructure**: Each validator must propose, vote on and execute blocks within tighter timeouts. A proposer that cannot disseminate its block within 1500 ms causes a new round. Validators with slow networks or slow block execution lengthen the interval of the heights they take part in rather than break liveness, but they may miss more proposals and votes.
1. **Remote signers**: Without a delayed precommit, the signing latency of remote signers and key management systems is on the critical path of every height. Validators should measure their signer's prevote and precommit latency before the upgrade.
1. **LastCommit inclusion**: With a 1 ns `TimeoutCommit`, the next proposer collects precommits for the previous block only until the floor lets it propose. A validator whose precommit arrives later may be absent from the next block's `LastCommit`. This affects reward distribution and the signed-blocks window, not safety.
1. **Peer influence on pacing**: `StartTime` is computed from the node's own clock. The only exemption from the floor requires precommits from +2/3 of the voting power in round 0 of the height, so a peer cannot shorten or extend another node's floor.
1. **Evidence window**: `MaxAgeDuration` remains equal to the unbonding period. The block bound stays within it only while blocks average at most 0.923 seconds; see Rationale.
1. **Throughput and storage**: Per-block limits are unchanged, so the maximum data rate rises with the block rate, from about 12 MiB/s to about 40 MiB/s at 32 MiB blocks. Raising `staking.HistoricalEntries` to 32,500 adds about 1.3 GB of state on Mainnet. Validators and archival nodes should size bandwidth and disk accordingly.
1. **Upgrade coordination**: All parameters MUST be activated together, and the celestia-core version that implements `DynamicTimeoutCommit` MUST be deployed on every validator before activation.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
