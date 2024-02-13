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

Current Data Availability Sampling (DAS) network protocol is inefficient. A _single_ sample operation takes O(log2(N)) network
round-trips(where N is the square size). This is not practical and does not scale for theoretically unlimited data square
Celestia network enables. The main motive here is a protocol with O(1) round-trip for _multiple_ samples, preserving 
the assumption of having a 1/N honest peers connected.

Initially, the Bitswap and IPLD were adopted as a base for the DA network protocols, including DAS, 
block synchronization (BS) and blob/namespace data retrieval (ND). They gave battle tested protocols and tooling with 
plugability to rapidly scaffold Celestia's DA network. However, it came with the price of scalability limits and 
round-trips resulting in BS slower than block production. Before network launch, the transition 
to the optimized [ShrEx protocol][shrex] for BS and integrating [CAR and DAGStore-based storage][storage] happened 
optimizing BS and ND. However, DAS was left untouched preserving its weak scalability and roundtrip inefficiency. Shwap 
specifically addresses these and additionally provides an extensible and flexible framework for BS, ND and beyond. 

## Specification

[Shwap Protocol Specification][spec]

## Backwards Compatibility

Shwap in incompatible with old sampling protocol. 

After rigorous investigation, celestia-node team decided against _implementing_ backwards compatibility with 
the old protocol into the node client due to immense complications it brings. Instead, the simple and time efficient 
strategy is to transiently deploy infrastructure for old and new versions, allowing network participants to gradually 
migrate to the new version. Once, we know that majority has migrated, we will terminate old infrastructure and deprecate 
old version.

## Reference Implementation

- [Go reference implementation][gimpl]
- [Rust implementation][rimpl]

## Security Considerations

Shwap does not change the security model of Celestia's Data Availability network and changes the underlying 
protocol for data retrieval.

Largely, the network and its codebase get simplified and requires less code and infrastructure to operate. This in turn 
decreases amount of implementation vulnerabilities, DOS vectors, message amplification and resource exhaustion attacks. 

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).

[shrex]: https://github.com/celestiaorg/celestia-node/blob/0abd16bbb05bf3016595498844a588ef55c63d2d/docs/adr/adr-013-blocksync-overhaul-part-2.md
[storage]: https://github.com/celestiaorg/celestia-node/blob/a33c80e20da684d656c7213580be7878bcd27cf4/docs/adr/adr-011-blocksync-overhaul-part-1.md
[gimpl]: https://github.com/celestiaorg/celestia-node/pull/2675
[rimpl]: https://github.com/eigerco/lumina/blob/561640072114fa5c4ed807e94882473476a41dda/node/src/p2p/shwap.rs
[spec]: https://www.youtube.com/watch?v=dQw4w9WgXcQ