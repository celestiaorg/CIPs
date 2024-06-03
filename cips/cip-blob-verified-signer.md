---
title: Introduce blob type with verified signer
description: Introduce a new blob type that can be submitted whereby the signer address is included and verified.
author: Callum Waters (@cmwaters)
discussions-to: https://forum.celestia.org/t/cip-blobs-with-verified-author
status: Draft
type: Standards Track
category: Core
created: 2024-05-22
---

## Abstract

Introduce a new blob type (v1 share format) that can be submitted with the author of the blob. Validators verify that the author is correct, simplifying the loop for rollups that adopt a fork-choice rule that whitelists one or more sequencers (blob publishers).

## Motivation

A common fork-choice rule for rollups is to enshrine the sequencer. In this situation, full rollup nodes, pull all the blobs on one or more namespaces and verify their authenticity through the address (i.e. `celestia1fhalcne7syg....`) that paid for those blobs, the `signer`. Currently in Celestia, the `signer` field, is located in the `MsgPayForBlobs` (PFB) which is separated from the blobs itself. Thus, the current flow is as follows:

- Retrieve all the PFBs in the `PFBNamespace`. Verify inclusion and then loop through them and find the PFBs that correspond to the namespaces that the rollup is subscribed to.
- For the PFBs of the namespaces that the rollup is subscribed to, verify the `signer` matches the sequencer.
- Use the share indexes of the `IndexWrapper` of the PFB to retrieve the blobs that match the PFB. Verify the blobs inclusion and finally process the blobs.
  
For rollups, using ZK, such as the case with Sovereign, the flow is as follows:

- Query all the blobs from the rollup namespace via RPC
- For each blob, reconstruct the blob commitment.
- Fetch the PFB namespace
- Parse the PFB namespace and create a mapping from blob commitment -> PFB
- (In circuit) Accept the list of all rollup blobs and the list of relevant PFBs as inputs
- (In circuit) Verify that the claimed list of blobs matches the block header using the namespaced merkle tree
- (In circuit) For each blob, find the PFB with the matching commitment and check that the sender is correct.
- (In circuit) For each relevant PFB, check that the bytes provided match the namespaced merkle tree

This is currently a needlessly complicated flow and more computationally heavy at constructing proofs. This CIP proposes an easier path for rollups that opt for this fork-choice rule

## Specification

This CIP introduces a new blob type (known henceforth as an authored blob):

```proto
message Blob {
  bytes namespace_id = 1;
  bytes data = 2;
  uint32 share_version = 3;
  uint32 namespace_version = 4;
  // new field
  string signer = 5;
}
```

Given proto's backwards compatibility, users could still submit the old blob type (in the `BlobTx` format) and signer would be processed as an empty string.

The new block validity rule (In `PrepareProposal` and `ProcessProposal`) would thus be that if the signer was not empty, then it must match that of the PFB that paid for it. When validating the `BlobTx`, validators would check the equivalency of the PFB's `signer` to the Blob's `signer` (as well as verification of the signature itself).

Although no version changes are required for protobuf encoded blobs, share encoding would change. Blobs containing a non empty signer string would be encoded using the new v1 share format (the first share format version is 0):

![Diagram of V1 Share Format](../assets/cip-blob-verified-signer/blob-v2-share-format.svg)

Note that in this diagram it is the `Info Byte` that contains the share version. Not to be confused with the namespace version.

Blobs with an empty `signer` string would remain encoded using the v0 format. A transaction specifying a share version of 1 and an empty signer field would be rejected. Equally so, specifying a share version of 0 and a non empty signer field would be rejected.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

## Rationale

Given the current specification change, the new loop is simplified:

- Retrieve all blobs in the subscribed namespace
- Verify that the blobs from the previous step belong to the subscribed namespace and the list is complete (i.e. there are no blobs present in the subscribed namespace that are absent from the list of retrieved blobs).
- Verify that the `signer` in each blob matches that of an allowed sequencer

As a small digression, it may be feasible to additionally introduce a new namespace version with the enforcement that all blobs in that namespace use the v1 format i.e. have a signer. However, this does not mean that the signer matches that of the sequencer (which Celestia validators would not be aware of). This would mean that full nodes would need to get and verify all blobs in the namespace anyway.

## Backwards Compatibility

This change requires a hard fork network upgrade as older nodes will not be able to verify the new blob format. The old blob format will still be supported allowing rollups to opt into the change as they please.

## Test Cases

Test cases will need to ensure that a user may not forge a incorrect signer, nor misuse the versioning. Test cases should also ensure that the properties of backwards compatibility mentioned earlier are met.

## Reference Implementation

TBC

## Security Considerations

Rollups using this pattern for verifying the enshrined sequencer make an assumption that there is at least 1/3 in voting power of the network is "correct". Note this is a more secure assumption than forking which may require up to 2/3+ of the voting power to be "correct". Rollups may decide to still retrieve the PFB's and validate the signatures themselves if they wish to avoid this assumption.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
