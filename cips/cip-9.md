---
cip: 9
title: Packet Forward Middleware
description: Adopt Packet Forward Middleware for multi-hop IBC and path unwinding
author: Alex Cheng (@akc2267)
discussions-to: https://forum.celestia.org/t/cip-packet-forward-middleware/1359
status: Draft
type: Standards Track
category: Core
created: 2023-12-01
---

## Abstract

This CIP integrates Packet Forward Middleware, the IBC middleware that enables multi-hop IBC and path unwinding to preserve fungibility for IBC-transferred tokens.

## Specification

_The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174._

The packet-forward-middleware is an IBC middleware module built for Cosmos blockchains utilizing the IBC protocol. A chain which incorporates the packet-forward-middleware is able to route incoming IBC packets from a source chain to a destination chain.

- Celestia MUST import and integrate Packet Forward Middleware. 
- This integration SHOULD use defaults for the following configs: [`Retries On Timeout`, `Timeout Period`, `Refund Timeout`, `Fee Percentage`].
 - Retries On Timeout - how many times will a forward be re-attempted in the case of a timeout.
 - Timeout Period - how long can a forward be in progress before giving up.
 - Refund Timeout - how long can a forward be in progress before issuing a refund back to the original source chain.
 - Fee Percentage - % of the forwarded packet amount which will be subtracted and distributed to the community pool.
- Celestia MAY choose different values for these configs if the community would rather have auto-retries, different timeout periods, and/or collect fees from forwarded packets.

## Rationale

The defaults set in Packet Forward Middleware ensure sensible timeouts so user funds are returned in a timely manner after incomplete transfers. `Timeout` follows IBC defaults and `Refund Timeout` is 28 days to ensure funds don't remain stuck in the packet forward module. `Retries On Timeout` is defaulted to 0, as app developers or cli users may want to control this themselves. `Fee Percentage` is defaulted to 0 for superior user experience; however, the Celestia community may decide to collect fees as a revenue source.

## Backwards Compatibility

No backward compatibility issues found.

## Reference Implementation

The integration steps include the following:
1. Import the PFM, initialize the PFM Module & Keeper, initialize the store keys and module params, and initialize the Begin/End Block logic and InitGenesis order.
2. Configure the IBC application stack (including the transfer module).
3. Configuration of additional options such as `timeout period`, number of `retries on timeout`, `refund timeout` period, and `fee percentage`.

Integration of the PFM should take approximately 20 minutes.

### Example integration of the Packet Forward Middleware

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

### Configuring the transfer application stack with Packet Forward Middleware

Here is an example of how to create an application stack using `transfer` and `packet-forward-middleware`. 
The following `transferStack` is configured in `app/app.go` and added to the IBC `Router`. 
The in-line comments describe the execution flow of packets between the application stack and IBC core.

For more information on configuring an IBC application stack see the ibc-go docs


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

### Configurable options in the Packet Forward Middleware

The Packet Forward Middleware has several configurable options available when initializing the IBC application stack. 
You can see these passed in as arguments to `packetforward.NewIBCMiddleware` and they include the number of retries that
will be performed on a forward timeout, the timeout period that will be used for a forward, and the timeout period that
will be used for performing refunds in the case that a forward is taking too long.

Additionally, there is a fee percentage parameter that can be set in `InitGenesis`, this is an optional parameter that
can be used to take a fee from each forwarded packet which will then be distributed to the community pool. In the 
`OnRecvPacket` callback `ForwardTransferPacket` is invoked which will attempt to subtract a fee from the forwarded
packet amount if the fee percentage is non-zero.

- `Retries On Timeout`: how many times will a forward be re-attempted in the case of a timeout.
- `Timeout Period`: how long can a forward be in progress before giving up.
- `Refund Timeout`: how long can a forward be in progress before issuing a refund back to the original source chain.
- `Fee Percentage`: % of the forwarded packet amount which will be subtracted and distributed to the community pool.

## Test Cases

Testing cases will be added later to this CIP

## Security Considerations

The origin sender (sender on the first chain) is retained in case of a failure to receive the packet (max-timeouts or ack error) on any chain in the sequence, so funds will be refunded to the right sender in the case of an error.

Any intermediate receivers, though, are not used anymore. PFM will receive the funds into the hashed account (hash of sender from previous chain + channel received on the current chain). This gives a deterministic account for the origin sender to see events on intermediate chains. With PFM's atomic acks, there is no possibility of funds getting stuck on an intermediate chain, they will either make it to the final destination successfully, or be refunded back to the origin sender.

We recommend that users set the intermediate receivers to a string such as "pfm" (since PFM does not care what the intermediate receiver is), so that in case users accidentally send a packet intended for PFM to a chain that does not have PFM, they will get an ack error and refunded instead of funds landing in the intermediate receiver account. This results in a PFM detection mechanism with a graceful error.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
