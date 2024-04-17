---
cip: 20
title: Disable blobstream module
description: Disable the blobstream state machine module
author: Rootul Patel (@rootulp)
discussions-to: https://forum.celestia.org/t/cip-disable-blobstream-module/1693
status: Draft
type: Standards Track
category: Core
created: 2024-04-16
---

## Abstract

The purpose of this proposal is to disable the blobstream module in celestia-app.

## Motivation

The blobstream module is a celestia-app specific state machine module. The blobstream module was designed to serve as a single component in the original blobstream architecture. The original blobstream architecture has been deprecated in favor of [Blobstream X](https://github.com/succinctlabs/blobstreamx) so the blobstream module is no longer needed and thus can be disabled.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

If this CIP is adopted:

1. The state machine MUST NOT accept new transactions that include Blobstream messages (e.g. `NewMsgRegisterEVMAddress`).
1. The state machine MUST NOT respond to queries for the Blobstream module (e.g. `AttestationRequestByNonce`, `LatestAttestationNonce`, `EarliestAttestationNonce`).

## Parameters

If this CIP is adopted, the following parameter can be removed:

| Parameter                       | Value | Description                                                            | Changeable via Governance |
|---------------------------------|-------|------------------------------------------------------------------------|---------------------------|
| blobstream.DataCommitmentWindow | 400   | Number of blocks that are included in a signed batch (DataCommitment). | True                      |

## Rationale

Disabling the blobstream module reduces the functionality of the celestia-app state machine. Disabling the Blobstream module also reduces the amount of state that needs to be stored and maintained in the celestia-app state machine.

## Backwards Compatibility

This proposal is backwards-incompatible because it is state-machine breaking. Therefore, this proposal cannot be introduced without an app version bump.

## Test Cases

> [!NOTE]
> Blobstream was previously named Quantum Gravity Bridge (QGB) and the codebase never fully adopted the name change so you may interpret instances of `qgb` as `blobstream`.

1. Ensure that celestia-app no longer accepts transactions for the blobstream module. Example: `celestia-app tx qgb <command>` should return an error message.
1. Ensure that celestia-app no longer accepts gRPC, RPC, or CLI queries for the blobstream module. Example: `celestia-app query qgb <command>` should return an error message.

## Reference Implementation

Celestia-app uses a versioned module manager and configurator that enables the removal of modules during app version upgrades. Concretely, the blobstream module can be disabled via this diff in `app.go`:

```diff
{
    Module: blobstream.NewAppModule(appCodec, app.BlobstreamKeeper),
    FromVersion: v1,
-   ToVersion: v2,
+   ToVersion: v1,
},
```

Additionally, a store migration needs to be registered during the upgrade process to ensure that the blobstream module's state is removed. Lastly, the blobstream module's tx commands and query commands should be removed from the CLI.

## Security Considerations

TBD

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
