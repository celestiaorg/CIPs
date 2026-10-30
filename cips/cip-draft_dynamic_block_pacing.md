| cip | XX |
| - | - |
| title | Dynamic block pacing with an 800 ms floor |
| description | Make TimeoutCommit a floor on the block interval and remove the delayed precommit. |
| author | Rachid Chami ([@rach-id](https://github.com/rach-id)) |
| discussions-to | <https://github.com/celestiaorg/celestia-app/issues/8072> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2026-10-30 |
| requires | [CIP-48](./cip-048.md) |

## Abstract

This CIP changes how a consensus node paces heights. Today a node waits `DelayedPrecommitTimeout` before it precommits and sleeps `TimeoutCommit` after it commits, so both waits add to the time spent proposing, voting and executing a block. With this CIP, `TimeoutCommit` becomes a floor on the interval between the start times of two consecutive heights: a node starts height `H+1` at `max(now, StartTime(H) + TimeoutCommit)` on its own clock, and precommits are no longer delayed. In app version 11, `TimeoutCommit` is 800 ms, `DelayedPrecommitTimeout` is 0, the base `TimeoutPropose`, `TimeoutPrevote` and `TimeoutPrecommit` values are halved, and the timeout deltas are unchanged. The upgrade height delays are rescaled to 0.8 second blocks and the IBC `MaxExpectedTimePerBlock` parameter is lowered from 13 seconds to 4 seconds.

## Motivation

[CIP-48](./cip-048.md) set the effective block time to about 2.6 seconds: `DelayedPrecommitTimeout` (2100 ms) plus `TimeoutCommit` (500 ms). Both values are waits. A block that takes 400 ms to propose, vote on and execute produces a block interval of about 3 seconds, and every millisecond of execution adds a millisecond to the interval. The two waits make the block interval long when blocks are small and longer when blocks are large.

Celestia targets 32 MiB blocks at a sub-second cadence. Reaching that target by shrinking the two waits keeps the same coupling: the interval is still the waits plus the work, so the waits must be tuned for the slowest expected block, and every block pays for them. A floor removes the coupling. When the work of a height fits in the floor, the interval is the floor. When it does not, the next height starts as soon as the block is committed, and the block pays only for its own work.

The floor also makes execution time visible in the block interval. Under the current rule, faster block execution, for example from optimistic execution of the proposal, shortens the time a node spends executing but not the interval, because the node then sleeps for the remaining waits. Under the floor, any saving on a height whose work exceeds the floor shortens the interval.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

1. **Height pacing (celestia-core)**: Let `StartTime(H)` be the time at which a node schedules round 0 of height `H`, measured on the node's own clock.
    1. After a node commits height `H`, it MUST set `StartTime(H+1) = max(now, StartTime(H) + TimeoutCommit)`. On the first height after start-up, or when the node committed `H` before `StartTime(H)`, it MUST use the commit time plus `TimeoutCommit` instead.
    1. A node MUST NOT enter round 0 of height `H+1` before `StartTime(H+1)`, unless it has received +2/3 precommits for any block or nil in round 0 of `H+1`, or it is replaying its write-ahead log. A complete proposal received before `StartTime(H+1)` MUST be held until then.
    1. A node MUST commit a block as soon as it has +2/3 precommits for it, from any step. The floor MUST NOT delay a commit.
    1. If the node's clock moves backward, the wait for `StartTime(H+1)` MUST NOT exceed `TimeoutCommit` from the current time.
    1. A node MUST NOT delay its precommit. The `DelayedPrecommitTimeout` value returned by the application SHALL be ignored, and the `skip_timeout_commit` node setting SHALL be ignored.
1. **Consensus timeouts (celestia-app)**: The application MUST return the timeouts of the app version in state in `TimeoutInfo` from `InitChain`, `FinalizeBlock` and `Info`. For app version 11 the values SHALL be:
    1. `TimeoutCommit` SHALL be increased from 500 ms to 800 ms. It is the floor on the block interval.
    1. `DelayedPrecommitTimeout` SHALL be reduced from 2100 ms to 0 ms.
    1. `TimeoutPropose` SHALL be reduced from 3000 ms to 1500 ms.
    1. `TimeoutPrevote` SHALL be reduced from 2000 ms to 1000 ms.
    1. `TimeoutPrecommit` SHALL be reduced from 3000 ms to 1500 ms.
    1. `TimeoutProposeDelta`, `TimeoutPrevoteDelta` and `TimeoutPrecommitDelta` remain 500 ms.
    1. App versions 10 and below SHALL keep the values in [CIP-48](./cip-048.md).
1. **Upgrade height delays**: The delays SHALL be rescaled to the same wall-clock durations at 0.8 seconds per block:
    1. `CortoUpgradeHeightDelay` SHALL be increased from 33,231 to 108,000 blocks (1 day).
    1. `MochaUpgradeHeightDelay` SHALL be increased from 66,462 to 216,000 blocks (2 days).
    1. `MainnetUpgradeHeightDelay` SHALL be increased from 232,616 to 756,000 blocks (7 days).
1. **IBC `MaxExpectedTimePerBlock`**: The parameter MUST be reduced from 13 seconds to 4 seconds, 5 times the 800 ms floor. The v11 upgrade handler MUST apply the new value to existing chains, and new chains MUST use it in genesis.
1. **Network upgrade**: These changes are state-breaking and MUST be activated together by the v11 network upgrade. Validators MUST run a celestia-core version that implements the pacing rule before the activation height.

## Parameters

Changed parameters:

| Parameter | Current value | Proposed value | Description | Changeable via Governance |
|-----------|---------------|----------------|-------------|---------------------------|
| `TimeoutCommit` | 500 ms | 800 ms | Floor on the interval between the start times of consecutive heights | No |
| `DelayedPrecommitTimeout` | 2100 ms | 0 ms | Ignored by celestia-core; precommits are not delayed | No |
| `TimeoutPropose` | 3000 ms | 1500 ms | Time to wait for a proposal before prevoting nil | No |
| `TimeoutPrevote` | 2000 ms | 1000 ms | Time to wait after +2/3 of any prevotes before precommitting nil | No |
| `TimeoutPrecommit` | 3000 ms | 1500 ms | Time to wait after +2/3 of any precommits before moving to the next round | No |
| `CortoUpgradeHeightDelay` | 33,231 blocks | 108,000 blocks | Blocks Corto waits after a `MsgTryUpgrade` to activate the next version (1 day) | No |
| `MochaUpgradeHeightDelay` | 66,462 blocks | 216,000 blocks | Blocks Mocha waits after a `MsgTryUpgrade` to activate the next version (2 days) | No |
| `MainnetUpgradeHeightDelay` | 232,616 blocks | 756,000 blocks | Blocks Mainnet waits after a `MsgTryUpgrade` to activate the next version (7 days) | No |
| `ibc.ConnectionGenesis.Params.MaxExpectedTimePerBlock` | 13 seconds | 4 seconds | Maximum expected time per block used by IBC connection delay periods (3-5x block time) | Yes |

Unchanged parameters (`TimeoutProposeDelta`, `TimeoutPrevoteDelta` and `TimeoutPrecommitDelta` stay at 500 ms). The following parameters are counted in blocks and are deliberately not rescaled:

| Parameter | Value | Wall clock at 2.6 s | Wall clock at 0.8 s | Reason | Changeable via Governance |
|-----------|-------|---------------------|---------------------|--------|---------------------------|
| `consensus.evidence.MaxAgeNumBlocks` | 404,400 | 12.2 days | 3.7 days | Evidence expires only when both `MaxAgeDuration` (337 hours) and `MaxAgeNumBlocks` are exceeded, so the window stays 337 hours. Rescaling would extend the window past the unbonding period whenever blocks average more than 0.92 seconds ([CIP-37](./cip-037.md)) | No |
| `slashing.SignedBlocksWindow` | 10,000 | 7.2 hours | 2.2 hours | Downtime slashing is 0% and jailing lasts 60 seconds; governance can raise the window | Yes |
| `staking.HistoricalEntries` | 10,000 | 7.2 hours | 2.2 hours | Must cover `fibre.PaymentPromiseHeightWindow`, which is also counted in blocks | Yes |
| `fibre.PaymentPromiseHeightWindow` | 1,000 | 43 minutes | 13 minutes | Clients reference a recent validator-set height; 13 minutes is enough | Yes |

Node-local defaults that are counted in blocks (`TTLNumBlocks` 36, `min-retain-blocks` 3,000, `snapshot-interval` 1,500) are also unchanged; operators can raise them.

## Rationale

**Why a floor instead of a sleep?** A sleep adds a fixed cost to every height. A floor charges it only when the height finishes early. Small blocks are produced every 800 ms, and large blocks are produced as fast as validators can propose, vote on and execute them. This is the property that lets the network target sub-second blocks at 32 MiB without tuning the waits for the slowest block.

**Why 800 ms?** It is the target block time for app version 11. It leaves room for proposal propagation and two voting rounds across a globally distributed validator set when blocks are small, and it is the value at which loaded blocks are expected to spend most of the interval on their own work.

**Why halve the round timeouts?** The round timeouts only matter when a round fails. With 2.6 second blocks, a failed round 0 cost about 3 seconds of `TimeoutPropose` before round 1. At an 800 ms floor that would be almost four blocks. Halving the base values keeps recovery proportionate while leaving the deltas, which grow the timeouts on every further round, unchanged so that a network under stress still converges.

**Why anchor on the node's previous start time?** Anchoring on `StartTime(H)` rather than the commit time makes the floor start-to-start, so voting and execution count towards the interval. Anchoring on the node's own clock rather than on the proposal timestamp means no peer can shorten or lengthen a node's floor.

**Multi-round heights.** A height that needs more than one round already took longer than the floor, so the next height starts immediately after the commit. The next start time stays within `[commit, commit + TimeoutCommit]`, and the network does not produce a burst of short heights to catch up with a schedule.

**Local clocks.** The floor is per node. Nodes that started a height at different times keep that offset, so the network-wide interval is `TimeoutCommit` on average rather than at every height. A backward clock step can hold a node for at most `TimeoutCommit`.

**Nodes that are behind.** A node commits on +2/3 precommits from any step, and the floor never delays a commit, so a node that is behind catches up at the speed of block verification. The round-0 exemption for +2/3 precommits only lets the node enter the round normally.

**Why keep `MaxAgeNumBlocks`?** See the parameter table. The value is already derived from a 3 second upper bound on block time, and a smaller block bound cannot shorten the evidence window below `MaxAgeDuration`.

## Backwards Compatibility

This change is not backwards compatible. All consensus nodes must upgrade to the new software before the v11 activation height.

The new celestia-core ignores `DelayedPrecommitTimeout` for every app version. A network still at app version 10 whose validators run the new binary therefore produces blocks at the app version 10 `TimeoutCommit` of 500 ms used as a floor, which is faster than the 2.6 seconds of [CIP-48](./cip-048.md). Validators that still run the previous celestia-core keep delaying their precommits, so the interval drops only once more than 2/3 of the voting power runs the new binary. The app version 10 upgrade height delay (232,616 blocks) then elapses in less than its nominal 7 days.

Client applications and tooling that estimate confirmation times or convert between heights and timestamps SHOULD assume an 800 ms minimum block interval and measure the actual interval, which varies with load.

## Test Cases

1. celestia-app unit tests check that `InitChain`, `FinalizeBlock` and `Info` return the app version 10 values at app version 10 and the values in this CIP at app version 11, and that the upgrade handler sets `MaxExpectedTimePerBlock` to 4 seconds.
1. A docker end-to-end test upgrades a chain from app version 10 to 11 and checks the timeouts and the IBC parameter.
1. celestia-core tests check that the interval between idle heights is `TimeoutCommit`, that a slow block starts the next height immediately, that the next height after a multi-round height starts within `[commit, commit + TimeoutCommit]`, and that a node that is behind catches up without waiting for the floor at each height.
1. A 10-validator network run checks an 800 ms ± 10 ms median idle interval and the behaviour under 32 MiB blocks. The changes will then be tested on the Corto devnet and the Mocha testnet before activation on Mainnet.

## Reference Implementation

- [celestia-core#3539](https://github.com/celestiaorg/celestia-core/pull/3539): paces heights from `TimeoutCommit` as a floor and removes the delayed precommit.
- [celestia-app#8411](https://github.com/celestiaorg/celestia-app/pull/8411): versioned consensus timeouts, upgrade height delays and the IBC parameter migration.

## Security Considerations

1. **Validator infrastructure**: Each validator must propose, vote on and execute blocks within tighter timeouts. A proposer that cannot disseminate its block within 1500 ms causes a new round. Validators with slow networks or slow block execution lengthen the interval of the heights they take part in rather than break liveness, but they may miss more proposals and votes.
1. **Remote signers**: Removing the delayed precommit puts the signing latency of remote signers and key management systems on the critical path of every height. Validators SHOULD measure their signer's prevote and precommit latency before the upgrade.
1. **LastCommit inclusion**: A validator whose precommit reaches the next proposer later than `TimeoutCommit` minus the time spent on the round and on execution may be absent from the next block's `LastCommit`. This is the same as with any short `TimeoutCommit`. It affects reward distribution and the signed-blocks window, not safety.
1. **Peer influence on pacing**: `StartTime` is computed from the node's own clock. Every exemption from the floor requires +2/3 signed precommits, so a peer cannot shorten or extend another node's floor.
1. **Evidence window**: `MaxAgeDuration` remains equal to the unbonding period, and the evidence window remains 337 hours, as in [CIP-37](./cip-037.md).
1. **Upgrade coordination**: All parameters MUST be activated together, and the celestia-core binary that implements the pacing rule MUST be deployed before activation. See Backwards Compatibility for the effect of deploying it while the network is still at app version 10.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
