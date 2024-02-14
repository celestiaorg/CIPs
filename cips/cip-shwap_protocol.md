---
title: Shwap Protocol 
description: Shwap - the new extensible sampling protocol 
author: Hlib Kanunnikov (@Wondertan)
discussions-to: https://forum.celestia.org/t/cip-shwap-protocol/1551
status: Draft
type: Standards Track
category: Data Availability, Networking
created: 2024-02-02
---

## Abstract

This document describes a high level overview of the Shwap p2p protocol. Shwap provides scalable and extensible 
framework for exchanging and swapping of shared data for Celestia's Data Availability network and beyond.

## Motivation

The current Data Availability Sampling (DAS) network protocol is inefficient. A _single_ sample operation takes log2(k) network
round-trips(where k is the square size). This is not practical and does not scale for the theoretically unlimited data
square that the Celestia network enables. The main motive here is a protocol with O(1) round-trip for _multiple_ samples, preserving
the assumption of having 1/n honest peers connected.

Initially, Bitswap and IPLD were adopted as the basis for the DA network protocols, including DAS,
block synchronization (BS), and blob/namespace data retrieval (ND). They gave battle-tested protocols and tooling with
pluggability to rapidly scaffold Celestia's DA network. However, it came with the price of scalability limits and
round-trips resulting in BS slower than block production. Before the network launch, the transition
to the optimized [ShrEx protocol][shrex] for BS and integrating [CAR and DAGStore-based storage][storage] happened
optimizing BS and ND. However, DAS was left untouched, preserving its weak scalability and roundtrip inefficiency. Shwap
addresses these and provides an extensible and flexible framework for BS, ND, and beyond.

## Specification

[Shwap Protocol Specification][spec]

## Backwards Compatibility

Swap is incompatible with the old sampling protocol.

After rigorous investigation, celestia-node team decided against _implementing_ backward compatibility with
the old protocol into the node client due to the immense complications it brings. Instead, the simple and time-efficient
strategy is transiently deploying infrastructure for old and new versions, allowing network participants to migrate 
gradually to the latest version. We will first deprecate the old version, and once the majority has migrated, we will 
terminate the old infrastructure.

## Reference Implementation

- [Go reference implementation][gimpl]
- [Rust implementation][rimpl]

## Security Considerations

Shwap does not change the security model of Celestia's Data Availability network and changes the underlying
protocol for data retrieval.

Essentially, the network and its codebase get simplified and require less code and infrastructure to operate. This in turn
decreases the amount of implementation vulnerabilities, DOS vectors, message amplification, and resource exhaustion attacks.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).

[shrex]: https://github.com/celestiaorg/celestia-node/blob/0abd16bbb05bf3016595498844a588ef55c63d2d/docs/adr/adr-013-blocksync-overhaul-part-2.md
[storage]: https://github.com/celestiaorg/celestia-node/blob/a33c80e20da684d656c7213580be7878bcd27cf4/docs/adr/adr-011-blocksync-overhaul-part-1.md
[gimpl]: https://github.com/celestiaorg/celestia-node/pull/2675
[rimpl]: https://github.com/eigerco/lumina/blob/561640072114fa5c4ed807e94882473476a41dda/node/src/p2p/shwap.rs
[spec]: https://www.youtube.com/watch?v=dQw4w9WgXcQ