---
title: Standardize data expiry time for pruned nodes
description: Standardize default data expiry time for pruned nodes to 30 days.
author: Mustafa Al-Bassam (@musalbas)
discussions-to: URL
status: Draft
type: Standards Track
category: Data Availability
created: 2023-11-23
---

## Abstract

This CIP standardizes the default expiry time of historical blocks for pruned (non-archival) nodes to 30 days.

## Motivation

The purpose of data availability layers such as Celestia is to ensure that block data is provably published to the Internet, so that applications and rollups can know what the state of their chain is, and store that data. Once the data is published, data availability layers [do not inherently guarantee that historical data will be permanently stored and remain retrievable](https://notes.ethereum.org/@vbuterin/proto_danksharding_faq#If-data-is-deleted-after-30-days-how-would-users-access-older-blobs). This task is left to block archival nodes on the network, which may be ran by professional service providers.

Block archival nodes are nodes that store a full copy of the historical chain, whereas pruned nodes store only the latest blocks. Consensus nodes running Tendermint are able to prune blocks by specifying a `min-retain-blocks` parameter in their configuration. Data availability nodes running celestia-node will also [soon have the ability to prune blocks](https://github.com/celestiaorg/celestia-node/pull/2738).

It is useful to standardize a default expiry time for blocks for pruned nodes, so that:
* Rollups and applications have an expectation of how long data will be retrievable from pruned nodes before it can only be retrieved from block archival nodes.
* Light nodes that want to query data in namespaces can discover pruned nodes over the peer-to-peer network and know which blocks they likely have, versus non-pruned nodes.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

Nodes that prune block data SHOULD store and distribute data in blocks that were created in the last 30 days.

## Rationale

30 days is chosen for the following reasons:
* Data availability sampling light nodes need to at least sample data within the Tendermint weak subjectivity period of 21 days in order to independently verify the data availability of the chain, and so they need to be able to sample data up to at least 21 days old.
* 30 days ought to be a reasonable amount of time for data to be downloaded from the chain by any application that needs it.
* EIP-4844 also proposes [30 days](https://notes.ethereum.org/@vbuterin/proto_danksharding_faq#If-data-is-deleted-after-30-days-how-would-users-access-older-blobs).

## Backwards Compatibility

On the Celestia data availability network, there is only one topic under which storage nodes can be discovered, where all nodes discovered under that topic are expected to be non-pruned nodes.

An additional new topic will be created for pruned nodes, so that nodes discovered under the existing topic will not unexpectedly have missing block data when being queried.

## Security Considerations

As discussed in Rationale, data availability sampling light nodes need to at least sample data within the Tendermint weak subjectivity period of 21 days in order to independently verify the data availability of the chain. 30 days exceeds this.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
<!-- markdownlint-disable MD013 -->
