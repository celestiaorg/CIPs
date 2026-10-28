| cip | XX (assigned by Editors) |
| - | - |
| title | Block gas limit for non-blob transactions |
| description | Bound the total gas that non-blob transactions can declare in a block. |
| author | Rootul Patel ([@rootulp](https://github.com/rootulp)) |
| discussions-to | TBA |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2026-10-28 |

## Abstract

This CIP adds a block validity rule in the v11 network upgrade: the gas limits declared by the non-blob transactions in a block MUST sum to at most `MaxSDKGas` = 100,000,000. Non-blob transactions are the transactions that are neither blob transactions nor PayForFibre transactions, the same set that the `MaxSDKMessages` limit counts. `ProcessProposal` rejects a block that exceeds the limit, `PrepareProposal` skips transactions that do not fit, and `CheckTx` rejects a transaction whose gas limit alone exceeds it. The consensus parameter `ConsensusParams.Block.MaxGas` stays at -1, because the Cosmos SDK block gas meter it enables has unsafe semantics.

## Motivation

Celestia bounds a block by its size and by message counts, but not by how much execution its messages do:

1. `ConsensusParams.Block.MaxGas` is -1, so blocks have no gas limit.
1. `MaxBytes` (32 MiB) and `MaxTxSize` (8 MiB) bound block and transaction size.
1. `MaxPFBMessages` (200) and `MaxSDKMessages` (600) bound message counts. [CIP-27](./cip-027.md) introduced these limits to keep block processing at about 0.25 seconds.

Message counts bound the fixed cost of each message, such as decoding, ante handler checks, and signature verification. They do not bound what a message does once it executes. One message can iterate over a list it carries, write many state entries, or verify a large payload. That work is metered in gas, and a transaction pays for the gas it declares, but nothing caps the gas a block can contain. The worst-case block is therefore bounded only by how much gas-dense work fits in 32 MiB and by what the attacker will pay.

The celestia-app benchmarks show that gas tracks execution time. In those benchmarks, an 8 MB block of 31,645 `MsgSend` transactions used about 2.8 billion gas, and delivering its transactions took about 7.5 seconds, roughly 2.7 nanoseconds per gas unit. `MaxSDKMessages` stopped that block shape by capping the number of messages. A message type whose gas grows with its input avoids a count limit, because it packs the same work into fewer messages.

Per-block limits so far have been added for specific transaction shapes after the shape was found to be expensive, as `MaxSDKMessages` was. This approach works for issues that are known. It does not work for issues that are not yet found, such as a new module, a dependency upgrade, or an IBC or Hyperlane code path whose gas grows with an attacker-chosen input. A block gas limit bounds all of these at once. Whatever the message, metered work in a block cannot exceed `MaxSDKGas`. A vulnerability that once allowed seconds or minutes of execution per block is limited to a fraction of a second, which gives the network time to deploy a targeted fix.

### Why not set `ConsensusParams.Block.MaxGas`

CometBFT and the Cosmos SDK already define a block gas limit, `ConsensusParams.Block.MaxGas`. Celestia cannot use it safely. When `MaxGas` is set, the SDK enforces it with a block gas meter in `FinalizeBlock`, and it charges a transaction's consumed gas to that meter after the transaction executes. A transaction that exceeds the remaining block gas:

1. has already done its execution work, so the limit does not bound work done in the block.
1. has its message writes reverted, while its fee, sequence increment, and other ante handler writes persist.
1. is still included in the block, so a block can contain transactions that fail only because of where they appear in the block.

[CIP-11](./cip-011.md) describes a related problem with unspent gas refunds. Because of these semantics, the celestia-app v10 cosmos-sdk fork prevents updates to `MaxGas` ([CIP-52](./cip-052.md)). This CIP does not change that. It enforces the limit as a block validity rule on declared gas, which validators check before a block is accepted. `FinalizeBlock` behavior does not change.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

### Definitions

1. A **blob transaction** is a transaction encoded as a `BlobTx`. Its inner transaction contains exactly one `MsgPayForBlobs`.
1. A **PayForFibre transaction** is a transaction whose only message is a `MsgPayForFibre`, as defined in [CIP-51](./cip-051.md).
1. A **non-blob transaction** is any other transaction in a block. This is the same set of transactions that the `MaxSDKMessages` limit counts.
1. The **gas limit** of a transaction is the `gas_limit` field of its `AuthInfo.Fee`.

### Block validity

1. Starting from app version 11, the sum of the gas limits of all non-blob transactions in a block MUST be less than or equal to `MaxSDKGas`.
1. `ProcessProposal` MUST reject a proposed block that violates this rule. It MUST reject a block containing a non-blob transaction that does not declare a fee, since the ante handler rejects such a transaction anyway.
1. The sum MUST be computed without integer overflow. For example, an implementation can check `gasLimit <= MaxSDKGas - sum` before adding a transaction's gas limit to `sum`. A transaction's gas limit is attacker-controlled and can be as large as 2^64 - 1.
1. Blob transactions and PayForFibre transactions MUST NOT count toward `MaxSDKGas`. `MaxPFBMessages`, `MaxPayForFibreMessages`, and the square size continue to bound them.
1. `ConsensusParams.Block.MaxGas` MUST remain -1.

### Block construction

1. `PrepareProposal` SHOULD skip a non-blob transaction whose gas limit would make the block exceed `MaxSDKGas`, and SHOULD continue to consider later transactions. A transaction with a smaller gas limit may still fit.
1. A skipped transaction is not removed from the mempool and can be included in a later block.

### Transaction admission

1. `CheckTx` SHOULD reject a non-blob, non-PayForFibre transaction whose gas limit alone exceeds `MaxSDKGas`, since no valid block can include it. This applies to both new transactions and rechecks.
1. Such a transaction is rejected with a new celestia-app error, `ErrTxExceedsMaxSDKGas`.

## Parameters

| Parameter                  | Proposed value | Description                                                                    | Changeable via Governance |
|----------------------------|----------------|--------------------------------------------------------------------------------|---------------------------|
| `appconsts.MaxSDKGas`      | 100,000,000    | Maximum sum of the gas limits of non-blob transactions in a block.             | False                     |

The following parameter does not change:

| Parameter                | Current value | Proposed value | Description                                     | Changeable via Governance |
|--------------------------|---------------|----------------|-------------------------------------------------|---------------------------|
| `consensus.block.MaxGas` | -1            | -1             | Maximum gas allowed per block (-1 is infinite). | False                     |

## Rationale

### Declared gas instead of consumed gas

The limit applies to the gas a transaction declares, not the gas it consumes:

1. Declared gas is known before execution. Validators can check the rule in `ProcessProposal` with a decode and a sum, without executing the block.
1. Declared gas is an upper bound on consumed gas. A transaction that tries to consume more runs out of gas and stops.
1. Celestia charges fees on declared gas and does not refund unspent gas ([CIP-11](./cip-011.md) was withdrawn). Reserving block gas costs as much as using it, so an attacker cannot cheaply reserve space with a large gas limit and refund the unused part.

The cost is that over-provisioned gas limits use capacity they do not spend. Clients that estimate gas and add a margin are not affected much. Users who over-provision already pay for the unspent gas.

### Excluding blob and PayForFibre transactions

A blob transaction's gas mostly pays for bytes, not execution. `MsgPayForBlobs` charges `GasPerBlobByte` (8) per blob byte, and every transaction pays `TxSizeCostPerByte` (10) per byte. A full 32 MiB block of blobs declares hundreds of millions of gas but executes quickly, because blob data is not processed by the state machine. Counting blob transactions would require a limit above the gas of a full blob block, which would allow just as much non-blob execution. That would remove most of the protection. Blob transactions contain exactly one `MsgPayForBlobs`, whose execution is fixed and small, and `MaxPFBMessages` bounds their count. PayForFibre transactions are bounded by `MaxPayForFibreMessages` and their signature checks are priced separately ([CIP-51](./cip-051.md)).

Excluding these transactions also means that blob throughput, Celestia's primary use, does not change.

### Choice of value

`MaxSDKGas` = 100,000,000 is chosen to:

1. **Bound execution time.** At the measured 2.7 to 5 nanoseconds per gas unit for typical messages, 100 million gas is about 0.27 to 0.5 seconds of execution. This is the same order as the 0.25 second processing target in [CIP-27](./cip-027.md), and well under the about 2.6 second block time.
1. **Leave headroom for current usage.** Sampled Celestia mainnet blocks use far less non-blob gas than this limit (see [Mainnet usage](#mainnet-usage)). Typical transfers, staking, governance, and IBC transactions declare 100,000 to a few million gas, so many fit in one block.
1. **Stay compatible with `MaxSDKMessages`.** A block of 600 transactions that each declare 150,000 gas, a generous limit for a token transfer, uses 90 million gas and fits.
1. **Allow large single transactions.** A single transaction can still declare up to 100 million gas.

### Mainnet usage

TBA

### Alternatives considered

1. **Set `ConsensusParams.Block.MaxGas`.** Rejected because of the SDK block gas meter semantics described in [Motivation](#why-not-set-consensusparamsblockmaxgas).
1. **Only add per-message limits.** Limits for specific message types remain useful, and celestia-app already has several. They only cover issues that are already known. A gas limit is a general backstop that complements them.
1. **Multidimensional gas, or a separate execution gas meter.** Pricing execution separately from bytes would allow one limit across all transactions. This is a larger change to fees and clients, and it can be done later. The limit in this CIP covers the transactions that have the most execution today.
1. **Make the limit a governance parameter.** A hardcoded constant matches the other per-block limits (`MaxPFBMessages`, `MaxSDKMessages`), avoids a new parameter and its validation, and prevents governance from disabling the backstop. A later network upgrade can change it.

## Backwards Compatibility

This CIP changes block validity, so it is consensus-breaking and activates with the v11 network upgrade. Validators running v11 reject proposals that exceed `MaxSDKGas`. Blocks at app version 10 and earlier are processed by the application for that version, which does not have this rule, so syncing earlier heights is not affected.

Effects on users and clients:

1. A non-blob transaction with a gas limit above 100,000,000 is rejected by `CheckTx` and can never be included in a block. No sampled mainnet transaction declares that much gas.
1. When the limit is reached, `PrepareProposal` defers remaining non-blob transactions to later blocks, the same way `MaxSDKMessages` defers them today.
1. Blob and PayForFibre transactions are not affected.

## Test Cases

1. A block of non-blob transactions whose gas limits sum to exactly `MaxSDKGas` is accepted by `ProcessProposal`.
1. A block whose non-blob gas limits sum to `MaxSDKGas + 1`, either in one transaction or across several, is rejected by `ProcessProposal`.
1. A block whose non-blob transactions sum to `MaxSDKGas` and that also contains blob transactions is accepted.
1. Given three non-blob transactions that each declare `MaxSDKGas / 2`, `PrepareProposal` includes the first two and skips the third.
1. Given a non-blob transaction that declares `MaxSDKGas + 1` followed by one that declares `MaxSDKGas / 2`, `PrepareProposal` skips the first and includes the second.
1. `CheckTx` rejects a non-blob transaction that declares `MaxSDKGas + 1` with `ErrTxExceedsMaxSDKGas`, for both new transactions and rechecks, and does not return that error for one that declares `MaxSDKGas`.
1. The overflow-safe check rejects a transaction that declares 2^64 - 1 gas when the running sum is non-zero.

## Reference Implementation

TBA

The implementation adds the `MaxSDKGas` constant to `pkg/appconsts`. It adds the overflow-safe check next to the existing `MaxSDKMessages` checks in the `PrepareProposal` filter and `ProcessProposal`, and adds a `CheckTx` check next to the other per-transaction admission limits.

## Security Considerations

### Defense in depth

This CIP turns the cost of metered non-blob execution in a block from unbounded into bounded by `MaxSDKGas` times the most expensive time per gas unit of any reachable code path. The protection is only as good as gas pricing. Work that is underpriced compared to typical messages can still take longer than the target, by the ratio of its time per gas unit to the typical value. The limit does not replace accurate gas pricing or per-message limits. It caps the damage when those are wrong. Benchmarks for new message types SHOULD measure time per gas unit and compare it to the target that `MaxSDKGas` assumes.

### Proposer behavior

`ProcessProposal` checks the limit independently, so a byzantine proposer cannot get an over-limit block accepted by honest validators. Computing the rule requires only decoding transactions and reading the fee, which `ProcessProposal` already does for every transaction. A non-blob transaction that has no fee is rejected, so a proposer cannot avoid the limit with a transaction type that declares no gas.

### Integer overflow

Gas limits are attacker-chosen 64-bit values. An implementation that adds them naively could overflow and accept a block far over the limit. The specification requires an overflow-safe comparison, and the test cases cover it.

### Block space contention

`MaxSDKGas` is a scarce per-block resource. Transactions that declare large gas limits at a high gas price can fill it and push other non-blob transactions to later blocks. This is the same tradeoff as for `MaxSDKMessages`, but priced by gas instead of by message count. Filling the limit costs `MaxSDKGas` times the gas price for each block, for example 0.4 TIA per block at the default node minimum gas price of 0.004 utia/gas, and the cost rises with fee market competition. Blob transactions do not compete for this resource, so this contention cannot censor blob submissions.

### Unchanged `FinalizeBlock` semantics

Because `ConsensusParams.Block.MaxGas` stays at -1, the SDK block gas meter stays disabled and `FinalizeBlock` never fails a transaction for exceeding block gas. Every transaction in an accepted block runs to completion or fails on its own gas meter, as it does today.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
