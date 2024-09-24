| cip | 24 |
| - | - |
| title | Versioned Gas Scheduler Variables |
| description | Transition to hard fork-only updates for gas scheduler variables |
| author | Nina Barbakadze ([@ninabarbakadze](https://github.com/ninabarbakadze)) |
| discussions-to | <https://forum.celestia.org/t/cip-versioned-gas-scheduler-variables/1785> |
| status | Review |
| type | Standards Track |
| category | Core |
| created | 2024-07-24 |

## Abstract

Gas scheduler parameters `blob.GasPerBlobByte` and `auth.TxSizeCostPerByte` will no longer be modifiable by governance but may only change via a hard fork upgrade.

## Motivation

Versioning on-chain governance modifiable parameters `blob.GasPerBlobByte` and `auth.TxSizeCostPerByte`, aims to stabilize gas estimation by removing block-to-block variability. This allows for hardcoding these values into estimators, simplifying the gas estimation process and making transaction costs more predictable without the need for pre-transaction queries.

## Specification

Currently, `GasPerBlobByte` and `TxSizeCostPerByte` are module parameters within the `blob` and `auth` modules, allowing for their modification via `ParameterChangeProposal`. The proposed modification changes these parameters to hardcoded constants within the application, accessible via version-specific getters.

### Parameters

The proposal makes these two variables modifiable through hard fork upgrades:

Previously:

1. `blob.GasPerBlobByte`
2. `auth.TxSizeCostPerByte`

Now:

1. `appconsts.GasPerBlobByte`
1. `appconsts.TxSizeCostPerByte`

## Backwards Compatibility

Enabling this feature requires a hard fork network upgrade.

## Test Cases

Test cases should verify that gas scheduler variables are exclusively updated via hard forks, effectively preventing updates through governance mechanisms and that the gas meter uses those constants.

## Reference Implementation

Starting from v3, we updated the `PayForBlobs()` function in `x/blob/keeper.go` to use versioned `GasPerBlobByte` parameter when calculating gas based on the size of the blobs while maintaining compatibility with previous versions.

```
// GasPerBlobByte is a versioned param from version 3 onwards.
var gasToConsume uint64
if ctx.BlockHeader().Version.App <= v2.Version {
	gasToConsume = types.GasToConsume(msg.BlobSizes, k.GasPerBlobByte(ctx))
} else {
	gasToConsume = types.GasToConsume(msg.BlobSizes, appconsts.GasPerBlobByte(ctx.BlockHeader().Version.App))
}
```

Additionally, we modified the PFB gas estimation logic to use `appconsts.DefaultTxSizeCostPerByte`.

```
func DefaultEstimateGas(blobSizes []uint32) uint64 {
	return EstimateGas(blobSizes, appconsts.DefaultGasPerBlobByte, appconsts.DefaultTxSizeCostPerByte)
}
```

We also needed to update the gas consumption logic related to transaction size in the ante handler. The `AnteHandle` function within `NewConsumeGasForTxSizeDecorator` has been modified to retrieve the `TxSizeCostPerByte` value from app constants for versions v3 and later. The logic for earlier versions remains unchanged.

```
// consumeGasForTxSize consumes gas based on the size of the transaction.
// It uses different parameters depending on the app version.
func consumeGasForTxSize(ctx sdk.Context, txBytes uint64, params auth.Params) {
	// For app v2 and below we should get txSizeCostPerByte from auth module
	if ctx.BlockHeader().Version.App <= v2.Version {
		ctx.GasMeter().ConsumeGas(params.TxSizeCostPerByte*txBytes, "txSize")
	} else {
		// From v3 onwards, we should get txSizeCostPerByte from appconsts
		txSizeCostPerByte := appconsts.TxSizeCostPerByte(ctx.BlockHeader().Version.App)
		ctx.GasMeter().ConsumeGas(txSizeCostPerByte*txBytes, "txSize")
	}
}
```

## Security Considerations

This change prioritizes network stability and predictability but requires heightened vigilance against potential misconfigurations.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
