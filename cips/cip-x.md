| cip | XX (assigned by Editors) |
| - |  |
| title | Header Pruning for LNs |
| description | Mechanism to retain a fixed range of headers instead of whole history |
| author | Hlib Kanunnikov ([@Wondertan](https://github.com/Wondertan)) |
| discussions-to | <https://forum.celestia.org/t/cip-header-pruning-for-lns/1958> |
| status | Draft |
| type | Standards Track |
| category | Data Availability |
| created | 2025-03-21 |

## Abstract

Currently, every DA node type synchronizes all historical headers starting from genesis (or other statically configured
historical header) until the subjectively initialized head of the chain. We change that by adding a way to sync a
constant size range of headers instead of the whole history.

## Motivation

LNs store the whole history of ExtendedHeaders in their entirety, including ValidatorSet, Commit and DAH. The motivation
is to decrease LN storage requirements by retaining only a configurable window of recent headers.

## Specification

In order to reference the last stored header, we introduce a notion of **Tail** header of the chain, complementing
**Head** header. Tail header height is estimated with [HeaderPruningWindow](#parameters), block time and Head height.

- On the first start of a node, the Tail is retrieved from trusted peers alongside with the Head, performing subjective
initialization.
  - Once retrieved, Tail becomes the point of trust for the initializing node where everything beforehand assumed valid
 (unless syncing from genesis)
  - Head, on the other hand, is not trusted and becomes a synchronization target for the node.
  - All the headers from Tail to Head are then retrieved and verified using signature-based forward verification.
- As the chain progresses, nodes continuously re-estimate Tail and cut off stored headers beyond the new Tail, retaining
roughly [HeaderPruningWindow](#parameters) amount of headers.

The estimation of Tail height is done as follows:

```go
func estimateTail(head, tail Header, blockTime, pruningWindow time.Duration) (height uint64) {
	estimatedRange = (now + pruningWindow - tail.Time()) / blockTime
	estimatedCutoffHeight = min(tail.Height() + estimatedRange, head.Height())
	return estimatedCutoffHeight
}
```

## Parameters

| Parameter           | Proposed value | Description                                                            | Changeable via Governance |
|---------------------|----------------|------------------------------------------------------------------------|---------------------------|
| HeaderPruningWindow | 14 days        | Defines how many headers to retain head backwards. Configurable per LN | No                        |

By default, HeaderPruningWindow equals to Availability/SamplingWindow and can be modified by LN operators.
// TODO: Point to the right parameter with CIP?

## Rationale

Initially, we add pruning support only to LNs to ensure reliable header retrieval for historical headers. Otherwise,
nodes configured with larger [HeaderPruningWindow](#parameters) than in connected FN/BNs won’t be able to retrieve
needed headers. We can revisit this consideration if header storage overhead ever becomes pressing for FN/BNs.

## Backwards Compatibility

The proposed change is backwards compatible with the current implementation on the protocol. However, LN operators
enabling pruning will loose the ability to retrieve historical headers beyond the [HeaderPruningWindow](#parameters).
Therefore, we will keep pruning opt-in and keep the ability to initialize from genesis or any arbitrary header in the
past. This way node operators can benefit from the storage savings if they know from which point they can safely prune.
Future protocol upgrade will solve this limitation by introducing an efficient way to retrieve historical headers.

## Security Considerations

This changes does not affect security of the protocol and its participants and is strictly an optimization for LN storage.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
