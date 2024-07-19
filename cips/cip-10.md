```
---
cip: 10
title: Coordinated network upgrades
description: Protocol for coordinating major network upgrades
author: Callum Waters (@cmwaters)
discussions-to: https://forum.celestia.org/t/cip-coordinated-network-upgrades/1367
status: Final
type: Standards Track
category: Core
created: 2023-12-7
---
```

## Abstract

Use a pre-programmed height for the next major upgrade. Following major upgrades will use an in-protocol signalling mechanism. Validators will submit messages to signal their ability and preference to use the next version. Once a quorum of 5/6 has signalled the same version, the network will migrate to that version.

## Motivation

The Celestia network needs to be able to upgrade across different state machines so new features and bugs that are protocol breaking can be supported. Versions of the Celestia consensus node are required to support all prior state machines, thus nodes are able to upgrade any time ahead of the coordinated upgrade height and very little downtime is experienced in transition. The problem addressed in this CIP is to define a protocol for coordinating that upgrade height.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

The next upgrade will be coordinated using a hard coded height that is passed as a flag when the node commences. This is an exception necessary to introduce the upgrading protocol which will come into affect for the following upgrade.

The network introduces two new message types `MsgSignalVersion` and `MsgTryUpgrade`

```protobuf
message MsgSignalVersion {
  string validator_address = 1;
  uint64 version = 2;
}

message MsgTryUpgrade { string signer = 1; }
```

Only validators can submit `MsgSignalVersion`. The Celestia state machine tracks which version each validator has signalled for. The signalled version MUST either be the same version or the next. There is no support for skipping versions or downgrading.

Clients may query the tally for each version as follows:

```protobuf
message QueryVersionTallyRequest { uint64 version = 1; }

message QueryVersionTallyResponse {
  uint64 voting_power = 1;
  uint64 threshold_power = 2;
  uint64 total_voting_power = 3;
}
```

When `voting_power` is greater or equal to `theshold_power` , the network MAY upgrade. This is done through a “crank” transaction, `MsgTryUpgrade`, which can be submitted by any account. The account covers the gas required for the calculation. If the quorum is met, the chain will update the `AppVersion` in the `ConsensusParams` returned in `EndBlock`. Celestia will reset the tally and perform all necessary migrations at the end of processing that block in `Commit`. The proposer of the following height will include the new version in the block. As is currently, nodes will only vote for blocks that match the same network version as theirs.

If the network agrees to move to a version that is not supported by the node, the node will gracefully shutdown.

The `threshold_power` is calcualted as 5/6ths of the total voting power. Rationale is provided below.

## Rationale

When attempting a major upgrade, there is increased risk that the network halts. At least 2/3 in voting power of the network is needed to migrate and agree upon the next block. However this does not take into account the actions of byzantine validators. As an example, say there is 100 in total voting power. 66 have signalled v2 and 33 have yet to signal i.e. they are still signalling v1. It takes 1 byzantine voting power to pass the threshold, convincing the network to propose v2 blocks and then omitting their vote leaving the network failing to reach consensus until one of the 33 are able to upgrade. At the other end of the spectrum, increasing the necessary threshold means less voting power required to veto the upgrade. The middle point here is setting a quorum of 5/6ths which provides 1/6 byzantine fault tolerance to liveness and requiring at least 1/6th of the network to veto the upgrade.

Validators are permitted to signal for the current network version as a means of cancelling their prior decision to upgrade. This is important in the case that new information arises that convinces the network that the next version is not ready.

An on-chain tallying system was decided over an off-chain as it canonicalises the information which is important for coordination and adds accountability to validators. As a result of this decision, validators will need to pay fees to upgrade which is necessary to avoid spamming the chain.

## Backwards Compatibility

This feature modifies the functionality of the state machine in a breaking way as the state machine can now dictate version changes. This will require a major upgrade to implement (thus the protocol won’t come into affect until the following major upgrade).

As the API is additive, there is no need to consider backwards compatibility for clients.

## Test Cases

All implementations are advised to test the following scenarios:

- A version x node can run on a version y network where x >= y.
- A `MsgTryUpgrade` should not modify the app version if there has been less than 5/6th and set the new app version when that threshold has been reached.
- A version x node should gracefully shutdown and not continue to validate blocks on a version y network when y > x.
- `MsgSignal` should correctly tally the accounts voting power. Signalling multiple times by the same validator should not increase the tally. A validator should be able to resignal a different version at any time.

## Reference Implementation

The golang implementation of the `signal` module can be found [here](https://github.com/celestiaorg/celestia-app/tree/main/x/signal)

## Security Considerations

See the section on rationale for understanding the network halting risk.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
