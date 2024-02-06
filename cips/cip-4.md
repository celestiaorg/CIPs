---
cip: 4
title: Standardize data expiry time for pruned nodes
description: Standardize default data expiry time for pruned nodes to 30 days + 1 hour worth of seconds (2595600 seconds).
author: Mustafa Al-Bassam (@musalbas), Rene Lubov (@renaynay), Ramin Keene (@ramin)
discussions-to: https://forum.celestia.org/t/cip-standardize-data-expiry-time-for-pruned-nodes/1326
status: Final
type: Standards Track
category: Data Availability
created: 2023-11-23
---

## Abstract

This CIP standardizes the default expiry time of historical blocks for pruned (non-archival) nodes to 30 days + 1 hour worth of seconds (2595600 seconds).

## Motivation

The purpose of data availability layers such as Celestia is to ensure that block data is provably published to the Internet, so that applications and rollups can know what the state of their chain is, and store that data. Once the data is published, data availability layers [do not inherently guarantee that historical data will be permanently stored and remain retrievable](https://notes.ethereum.org/@vbuterin/proto_danksharding_faq#If-data-is-deleted-after-30-days-how-would-users-access-older-blobs). This task is left to block archival nodes on the network, which may be ran by professional service providers.

Block archival nodes are nodes that store a full copy of the historical chain, whereas pruned nodes store only the latest blocks. Consensus nodes running Tendermint are able to prune blocks by specifying a `min-retain-blocks` parameter in their configuration. Data availability nodes running celestia-node will also [soon have the ability to prune blocks](https://github.com/celestiaorg/celestia-node/pull/3150/).

It is useful to standardize a default expiry time for blocks for pruned nodes, so that:
* Rollups and applications have an expectation of how long data will be retrievable from pruned nodes before it can only be retrieved from block archival nodes.
* Light nodes that want to query data in namespaces can discover pruned nodes over the peer-to-peer network and know which blocks they likely have, versus non-pruned nodes.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

Nodes that prune block data SHOULD store and distribute data in blocks that were created in the last 30 days + 1 hour worth of seconds (2595600 seconds). The additional 1 hour acts as a buffer to account for clock drift.

On the Celestia data availability network, both pruned and non-pruned nodes MAY advertise themselves under the existing `full` peer discovery tag, in which case the nodes MUST store and distribute data in blocks that were created in the last 30 days + 1 hour worth of seconds (2595600 seconds).

Non-pruned nodes MAY advertise themselves under a new `archival` tag, in which case the nodes MUST store and distribute data in all blocks.

Data availability sampling light nodes SHOULD sample blocks created in the last 30 days + 1 hour worth of seconds (the sampling window of 2595600 seconds).

## Rationale

30 days + 1 hour worth of seconds (2595600 seconds) is chosen for the following reasons:
* Data availability sampling light nodes need to at least sample data within the Tendermint weak subjectivity period of 21 days in order to independently verify the data availability of the chain, and so they need to be able to sample data up to at least 21 days old.
* 30 days + 1 hour worth of seconds (2595600 seconds) ought to be a reasonable amount of time for data to be downloaded from the chain by any application that needs it, accounting for clock drift.

## Backwards Compatibility

The implementation of pruned nodes will break backwards compatibility in a few ways:

1. Light nodes running on older software (without the sampling window) will not be able to sample historical data (blocks older than 30 days + 1 hour) as nodes advertising on the `full` tag will no longer be expected to provide historical blocks.
2. Similarly, full nodes running on older software will not be able to sync historical blocks without discovering non-pruned nodes on the `archival` tag.
3. Requesting blobs from historical blocks via a light node or full node will not be possible without discovering non-pruned nodes on the `archival` tag.

## Reference Implementation

### Data Availability Sampling Window (light nodes)

Implementation for light nodes can be quite simple, where a satisfactory implementation merely behaves in that the choice to sample headers should not occur for headers whose timestamp is outside the given sampling window.

Given a hypothetical "sample" function that performs data availability sampling of incoming extended headers from the network, the decision to sample or not should be taken by inspecting the header's timestamp, and ignoring it in any sampling operation if the duration between the header's timestamp and the current time exceeds the duration of the sampling window. For example:

```go
const windowSize = time.Second * 86400 * 30 + (1 * 60 * 60) // 30 days + 1 hour worth of seconds (2595600 seconds)

func sample(header Header) error{
    if time.Since(header.Time()) > windowSize {
        return nil // do not perform any sampling
    }

    // continue with rest of sampling operation
}
```

[Example implementation by celestia node](https://github.com/celestiaorg/celestia-node/pull/2991)

### Storage Pruning

Pruning of data outside the availability window will be highly implementation specific and dependent on how data storage is engineered.

A satisfactory implementation would be where any node implementing storage pruning may, if NOT advertising oneself to peers as an archival node on the 'full' topic, discard stored data outside the 30 day + 1 hour worth of seconds (2595600 seconds) availability window. A variety of options exist for how any implementation might schedule pruning of data, and there are no requirements around how this is implemented. The only requirement is merely that the time guarantees around data within the availability window are properly respected, and that data availability nodes correctly advertise themselves to peers.

[An example implementation of storage pruning (WIP at time of writing) in celestia node](https://github.com/celestiaorg/celestia-node/pull/3150/files)

## Security Considerations

As discussed in Rationale, data availability sampling light nodes need to at least sample data within the Tendermint weak subjectivity period of 21 days in order to independently verify the data availability of the chain. 30 days + 1 hour of seconds (2595600 seconds) exceeds this.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
