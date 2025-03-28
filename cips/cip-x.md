| cip | XX (assigned by Editors) |
| - | - |
| title | Header Pruning for Light Nodes |
| description | Mechanism to retain a fixed range of headers instead of whole history |
| author | Hlib Kanunnikov ([@Wondertan](https://github.com/Wondertan)) |
| discussions-to | <https://forum.celestia.org/t/cip-header-pruning-for-lns/1958> |
| status | Draft |
| type | Standards Track |
| category | Data Availability |
| created | 2025-03-21 |

## Abstract

Currently, every data availability (DA) node type synchronizes all historical headers starting from genesis (or other statically configured
historical header) until the subjectively initialized head of the chain. We change that by adding a way to sync a
constant size range of headers instead of the whole history.

## Motivation

Light nodes (LNs) currently store the entire history of ExtendedHeaders, including the ValidatorSet, Commit, and
Data Availability Header (DAH). This started as technical debt but has now become a product issue. The goal is to
reduce LN storage requirements by retaining only the most recent headers—specifically, at least the number defined by
SampleWindow in [CIP-004](./cip-004.md).

## Specification

In order to reference the last stored header, we introduce a notion of **Tail** header of the chain, complementing
**Head** header. Tail header height is estimated with [HeaderPruningWindow](#parameters), block time and Head height.

- On the first start of a node, the Tail is retrieved from trusted peers alongside with the Head, performing subjective
initialization.
  - Once retrieved, Tail becomes the point of trust for the initializing node where everything beforehand assumed valid
 (unless syncing from genesis)
  - Head is cross-checked with the Tail and becomes a synchronization target for the node.
  - All the headers from Tail to Head are then retrieved and verified using signature-based forward verification.
- As the chain progresses, nodes continuously re-estimate Tail and cut off stored headers beyond the new Tail, retaining
roughly [HeaderPruningWindow](#parameters) amount of headers.

The estimation of Tail height is done as follows:

```go
func estimateTail(head Header, blockTime, headerPruningWindow time.Duration) (height uint64) {
    headersToRetain := headerPruningWindow / blockTime
    tail := head.Height() - headersToRetain
    return tail
}
```

## Parameters

| Parameter           | Proposed value | Description                                   | Changeable via Governance |
|---------------------|----------------|-----------------------------------------------|---------------------------|
| HeaderPruningWindow | 30 days        | Defines the length of time to retain headers  | No                        |

By default, HeaderPruningWindow (HPW) equals to SamplingWindow (SW) from [CIP-004](./cip-004.md). It can be modified per LN, but
it must be more or equal to the SamplingWindow. As there is currently way to sync history beyond HPW, the HPW less than
SW will fail sampling.

## Rationale

Initially, we add pruning support only to LNs to ensure reliable header retrieval for historical headers. Otherwise,
nodes configured with larger [HeaderPruningWindow](#parameters) than in connected full nodes (FN)/bridge nodes (BNs) won’t be able to retrieve
needed headers. We can revisit this consideration if header storage overhead ever becomes pressing for FN/BNs.

## Backwards Compatibility

The proposed change is backwards compatible with the current implementation on the protocol. However, LN operators
enabling pruning will lose the ability to retrieve historical headers beyond the [HeaderPruningWindow](#parameters).
Therefore, we will keep pruning opt-in and keep the ability to initialize from genesis or any arbitrary header in the
past. This way node operators can benefit from the storage savings if they know from which point they can safely prune.
Future protocol upgrade will solve this limitation by introducing an efficient way to retrieve historical headers.

## Security Considerations

This changes does not affect security of the protocol and its participants and is strictly an optimization for LN storage, assuming LN's respect the constraint `HeaderPruningWindow >= SamplingWindow`.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
