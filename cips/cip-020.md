| cip | 20 |
| - | - |
| title | Disable Blobstream module |
| description | Disable the Blobstream state machine module |
| author | Rootul Patel ([@rootulp](https://github.com/rootulp)) |
| discussions-to | <https://forum.celestia.org/t/cip-disable-blobstream-module/1693> |
| status | Final |
| type | Standards Track |
| category | Core |
| created | 2024-04-16 |

## Abstract

The purpose of this proposal is to disable the Blobstream module in celestia-app.

## Motivation

The Blobstream module is a celestia-app specific state machine module. The Blobstream module was designed to serve as a single component in the original Blobstream architecture. The original Blobstream architecture has been deprecated in favor of [Blobstream X](https://github.com/succinctlabs/blobstreamx) so the Blobstream module is no longer needed and thus can be disabled.

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

Disabling the Blobstream module reduces the functionality of the celestia-app state machine. Disabling the Blobstream module also reduces the amount of state that needs to be stored and maintained in the celestia-app state machine.

## Backwards Compatibility

This proposal is backwards-incompatible because it is state-machine breaking. Therefore, this proposal cannot be introduced without an app version bump.

## Test Cases

> [!NOTE]
> Blobstream was previously named Quantum Gravity Bridge (QGB) and the codebase never fully adopted the name change so you may interpret instances of `qgb` as `blobstream`.

1. Ensure that celestia-app no longer accepts transactions for the Blobstream module. Example: `celestia-app tx qgb <command>` should return an error message.
1. Ensure that celestia-app no longer accepts gRPC, RPC, or CLI queries for the Blobstream module. Example: `celestia-app query qgb <command>` should return an error message.

## Reference Implementation

Celestia-app uses a versioned module manager and configurator that enables the removal of modules during app version upgrades. Concretely, the Blobstream module can be disabled via this diff in `app.go`:

```diff
{
    Module: blobstream.NewAppModule(appCodec, app.BlobstreamKeeper),
    FromVersion: v1,
-   ToVersion: v2,
+   ToVersion: v1,
},
```

The blobstream store key MUST be removed from the versioned store keys map in `app/modules.go` for app version 2:

```diff
func versionedStoreKeys() map[uint64][]string {
	return map[uint64][]string{
		1: {
            // ...
        },
        2: {
            // ...
-           blobstreamtypes.StoreKey,
        }
    }
}
```

The Blobstream module's tx commands and query CLI commands MAY be removed from the CLI in `x/blobstream/module.go`:

```diff
// GetTxCmd returns no command because the blobstream module was disabled in app
// version 2.
func (a AppModuleBasic) GetTxCmd() *cobra.Command {
-   return bscmd.GetTxCmd()
+   return nil
}

// GetQueryCmd returns no command because the blobstream module was disabled in
// app version 2.
func (AppModuleBasic) GetQueryCmd() *cobra.Command {
-   return bscmd.GetQueryCmd()
+   return nil
}
```

Lastly, the x/blobstream module registers hooks in the staking module. Since these hooks are not version-aware, they MUST be made no-ops for app versions >= 2.

## Security Considerations

This CIP generally reduces the surface area of celestia-app because it removes functionality that is no longer deemed necessary. Therefore, it could be argued that this CIP reduces the surface area for bugs or security vulnerabilities.

However, there is a slim chance that this CIP uncoveres a bug because the Celestia state machine hasn't disabled a module before. Executing this CIP involves using new components (i.e. a versioned module manager and configurator) which may uncover bugs in software outside the scope of this CIP.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
