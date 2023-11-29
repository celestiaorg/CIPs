---
title: Packet Forward Middleware
description: Adopt Packet Forward Middleware for multi-hop IBC and path unwinding
author: Alex Cheng (@akc2267)
discussions-to: URL
status: Draft
type: Standards Track
category: Core
created: Date created on, in ISO 8601 (yyyy-mm-dd) format
---
<!-- markdownlint-disable MD013 -->

> Note:
**READ CIP-1 BEFORE USING THIS TEMPLATE!**
This is the suggested template for new CIPs. After you have filled in the requisite fields, please delete these comments. Note that an CIP number will be assigned by an editor. When opening a pull request to submit your CIP, please use an abbreviated title in the filename, `cip-draft_title_abbrev.md`. The title should be 44 characters or less. It should not repeat the CIP number in title, irrespective of the category.

**TODO: Remove the note before submitting**

## Abstract

This CIP integrates Packet Forward Middleware, the IBC middleware that enables multi-hop IBC and path unwinding to preserve fungibility for IBC-transferred tokens.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

Celestia MUST import and integrate Packet Forward Middleware. This integration SHOULD use sensible defaults for the following configs: [Retries On Timeout, Timeout Period, Refund Timeout, Fee Percentage].

## Rationale

**TODO: What are the recommended defaults?**

## Backwards Compatibility

*"No backward compatibility issues found."*

## Test Cases

This section is optional.

The Test Cases section should include expected input/output pairs, but may include a succinct set of executable tests. It should not include project build files. No new requirements may be be introduced here (meaning an implementation following only the Specification section should pass all tests here.)

If the test suite is too large to reasonably be included inline, then consider adding it as one or more files in `../assets/cip-####/`. External links will not be allowed

**TODO: Remove the previous comments before submitting**

## Reference Implementation

The integration steps include the following:
1. Import the PFM, initialize the PFM Module & Keeper, initialize the store keys and module params, and initialize the Begin/End Block logic and InitGenesis order.
2. Configure the IBC application stack including the transfer module.
3. Configuration of additional options such as timeout period, number of retries on timeout, refund timeout period, and fee percentage.

Integration of the PFM should take approximately 20 minutes.

# Example integration of the Packet Forward Middleware

```go
// app.go

// Import the packet forward middleware
import (
    "github.com/cosmos/ibc-apps/middleware/packet-forward-middleware/v7/packetforward"
    packetforwardkeeper "github.com/cosmos/ibc-apps/middleware/packet-forward-middleware/v7/packetforward/keeper"
    packetforwardtypes "github.com/cosmos/ibc-apps/middleware/packet-forward-middleware/v7/packetforward/types"
)

...

// Register the AppModule for the packet forward middleware module
ModuleBasics = module.NewBasicManager(
    ...
    packetforward.AppModuleBasic{},
    ...
)

...

// Add packet forward middleware Keeper
type App struct {
	...
	PacketForwardKeeper *packetforwardkeeper.Keeper
	...
}

...

// Create store keys 
keys := sdk.NewKVStoreKeys(
    ...
    packetforwardtypes.StoreKey,
    ...
)

...

// Initialize the packet forward middleware Keeper
// It's important to note that the PFM Keeper must be initialized before the Transfer Keeper
app.PacketForwardKeeper = packetforwardkeeper.NewKeeper(
    appCodec,
    keys[packetforwardtypes.StoreKey],
    app.GetSubspace(packetforwardtypes.ModuleName),
    app.TransferKeeper, // will be zero-value here, reference is set later on with SetTransferKeeper.
    app.IBCKeeper.ChannelKeeper,
    appKeepers.DistrKeeper,
    app.BankKeeper,
    app.IBCKeeper.ChannelKeeper,
)

// Initialize the transfer module Keeper
app.TransferKeeper = ibctransferkeeper.NewKeeper(
    appCodec,
    keys[ibctransfertypes.StoreKey],
    app.GetSubspace(ibctransfertypes.ModuleName),
    app.PacketForwardKeeper,
    app.IBCKeeper.ChannelKeeper,
    &app.IBCKeeper.PortKeeper,
    app.AccountKeeper,
    app.BankKeeper,
    scopedTransferKeeper,
)

app.PacketForwardKeeper.SetTransferKeeper(app.TransferKeeper)

// See the section below for configuring an application stack with the packet forward middleware 

...

// Register packet forward middleware AppModule
app.moduleManager = module.NewManager(
    ...
    packetforward.NewAppModule(app.PacketForwardKeeper),
)

...

// Add packet forward middleware to begin blocker logic
app.moduleManager.SetOrderBeginBlockers(
    ...
    packetforwardtypes.ModuleName,
    ...
)

// Add packet forward middleware to end blocker logic
app.moduleManager.SetOrderEndBlockers(
    ...
    packetforwardtypes.ModuleName,
    ...
)

// Add packet forward middleware to init genesis logic
app.moduleManager.SetOrderInitGenesis(
    ...
    packetforwardtypes.ModuleName,
    ...
)

// Add packet forward middleware to init params keeper
func initParamsKeeper(appCodec codec.BinaryCodec, legacyAmino *codec.LegacyAmino, key, tkey storetypes.StoreKey) paramskeeper.Keeper {
    ...
    paramsKeeper.Subspace(packetforwardtypes.ModuleName).WithKeyTable(packetforwardtypes.ParamKeyTable())
    ...
}
```

# Configuring the transfer application stack with Packet Forward Middleware

Here is an example of how to create an application stack using `transfer` and `packet-forward-middleware`. 
The following `transferStack` is configured in `app/app.go` and added to the IBC `Router`. 
The in-line comments describe the execution flow of packets between the application stack and IBC core.

For more information on configuring an IBC application stack see the ibc-go docs [here](https://github.com/cosmos/ibc-go/blob/main/docs/middleware/ics29-fee/integration.md#configuring-an-application-stack-with-fee-middleware).


```go
// Create Transfer Stack
// SendPacket, since it is originating from the application to core IBC:
// transferKeeper.SendPacket -> packetforward.SendPacket -> channel.SendPacket

// RecvPacket, message that originates from core IBC and goes down to app, the flow is the other way
// channel.RecvPacket -> packetforward.OnRecvPacket -> transfer.OnRecvPacket

// transfer stack contains (from top to bottom):
// - Packet Forward Middleware
// - Transfer
var transferStack ibcporttypes.IBCModule
transferStack = transfer.NewIBCModule(app.TransferKeeper)
transferStack = packetforward.NewIBCMiddleware(
	transferStack,
	app.PacketForwardKeeper,
	0, // retries on timeout
	packetforwardkeeper.DefaultForwardTransferPacketTimeoutTimestamp, // forward timeout
	packetforwardkeeper.DefaultRefundTransferPacketTimeoutTimestamp, // refund timeout
)

// Add transfer stack to IBC Router
ibcRouter.AddRoute(ibctransfertypes.ModuleName, transferStack)
```

# Configurable options in the Packet Forward Middleware

The Packet Forward Middleware has several configurable options available when initializing the IBC application stack. 
You can see these passed in as arguments to `packetforward.NewIBCMiddleware` and they include the number of retries that
will be performed on a forward timeout, the timeout period that will be used for a forward, and the timeout period that
will be used for performing refunds in the case that a forward is taking too long.

Additionally, there is a fee percentage parameter that can be set in `InitGenesis`, this is an optional parameter that
can be used to take a fee from each forwarded packet which will then be distributed to the community pool. In the 
`OnRecvPacket` callback `ForwardTransferPacket` is invoked which will attempt to subtract a fee from the forwarded
packet amount if the fee percentage is non-zero.

- Retries On Timeout - how many times will a forward be re-attempted in the case of a timeout.
- Timeout Period - how long can a forward be in progress before giving up.
- Refund Timeout - how long can a forward be in progress before issuing a refund back to the original source chain.
- Fee Percentage - % of the forwarded packet amount which will be subtracted and distributed to the community pool.

## Security Considerations

All CIPs must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. For example, include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed. CIP submissions missing the "Security Considerations" section will be rejected. An CIP cannot proceed to status "Final" without a Security Considerations discussion deemed sufficient by the reviewers.

The current placeholder is acceptable for a draft.

**TODO: Remove the previous comments before submitting**

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
<!-- markdownlint-disable MD013 -->
