```
---
cip: 14
title: ICS-27 Interchain Accounts
description: Adding ICS-27 Interchain Accounts to Celestia to enable cross-chain account management
author:  Susannah Evans <susannah@interchain.io> (@womensrights), Aidan Salzmann <aidan@stridelabs.co> (@asalzmann), Sam Pochyly <sam@stridelabs.co> (@sampocs)
discussions-to: https://forum.celestia.org/t/moving-toward-safer-and-more-aligned-tia-liquid-staking/1422
status: Final
type: Standards Track
category: Core
created: 2023-01-04
---
```

## Abstract

This proposal outlines the integration of the Interchain Accounts (ICA) host implementation into Celestia, as defined by ICS-27. ICS-27 specifies a cross-chain account management system built on IBC. The ICS-27 implementation consists of a module at both ends of an IBC channel, enabling one chain to act as the account controller, and the other chain to act as the account manager and message recipient. Messages are sent from the controller chain and executed by the host chain. Most of the largest IBC-enabled blockchains have had ICA enabled for more than a year (Cosmos Hub, Osmosis, Neutron, Stride). The integration of the host ICA module into Celestia would enhance interoperability with external chains, specifically in the context of liquid staking and other DeFi applications.

## Motivation

ICS-27 enabled chains can programmatically create ICAs (interchain accounts) on other ICS-27 enabled chains and control ICAs via IBC transactions (instead of signing with a private key). ICAs can retain all of the capabilities of a normal account (i.e. stake, send, vote) but instead are managed by a separate chain via IBC such that the owner account on the controller chain retains full control over any interchain account(s) it registers on host chain(s). The host chain (Celestia) can restrict which messages ICAs have access to call in an “allow list”.

ICA is secure, minimal, and battle-tested. Secure: ICA one of a few core apps implemented by the ibc go team. The ICA implementation has been audited by Informal Systems. Minimal: Adding ICA to a chain is around 100 LoC, and the host module itself is lightweight. Battle-tested: ICA modules have been used in production on most large IBC enabled chains for more than a year, and ICAs currently hold hundreds of millions of dollars.

While ICAs are flexible and enable numerous use cases, they’ve mainly been used for liquid staking. Liquid staking has high product market fit in crypto, evidenced by Lido on Ethereum, which holds the highest TVL of any DeFi protocol. Its popularity stems from key advantages over native staking for many users: it gives users liquidity on their stake, while still accumulating staking rewards and decreases the DeFi hurdle rate (e.g. you can lend your stake to earn additional yield). However, these benefits come with trade-offs, such as the added protocol risk associated with an additional application layer, or the case of multisig liquid staking, the need to trust a third party.

Liquid staking providers (LSPs) can accumulate a large share of stake and impact the decentralization of the network, depending on how validators are selected. Given the high market demand for liquid staked TIA and impact LSPs can have on network decentralization, Celestia’s LSPs should align with Celestia’s core values: decentralization, trust minimization, and community governance. ICA minimizes trust by enabling the use of a Tendermint based chain for liquid staking instead of a multisig.

By enabling ICA on an accelerated timeline, Celestia can enable battle-tested protocols like Stride to provide more decentralized, trust-minimized liquid staking services that are credibly governed by the Celestia community.

## Specification

For context, both the host and controller module specification are described below; however, this proposal is to integrate only the host module. For the full technical specification, see the [ICS-27 spec](https://github.com/cosmos/ibc/tree/main/spec/app/ics-027-interchain-accounts) in the ibc protocol repository.

Adoption of the host module implies the addition of new parameters:

| Module.Parameter      | Proposed value                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Description                                                                                                                                                                                                        | Changeable via Governance |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| icahost.HostEnabled   | `true`                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Controls a chains ability to service ICS-27 host specific logic.                                                                                                                                               | False                     |
| icahost.AllowMessages | `["/ibc.applications.transfer.v1.MsgTransfer", "/cosmos.bank.v1beta1.MsgSend", "/cosmos.staking.v1beta1.MsgDelegate", "/cosmos.staking.v1beta1.MsgBeginRedelegate", "/cosmos.staking.v1beta1.MsgUndelegate", "/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation", "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress", "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward", "/cosmos.distribution.v1beta1.MsgFundCommunityPool", "/cosmos.gov.v1.MsgVote", "/cosmos.feegrant.v1beta1.MsgGrantAllowance", "/cosmos.feegrant.v1beta1.MsgRevokeAllowance"]` | Provides the ability for a chain to limit the types of messages or transactions that hosted interchain accounts are authorized to execute by defining an allowlist using the Protobuf message type URL format. | False                     |

### Definitions

- `Host Chain`: The chain where the interchain account is registered. The host chain listens for IBC packets from a controller chain which contain instructions (e.g. cosmos SDK messages) that the interchain account will execute.
- `Controller Chain`: The chain registering and controlling an account on a host chain. The controller chain sends IBC packets to the host chain to control the account.
- `Interchain Account`: An account on a host chain. An interchain account has all the capabilities of a normal account. However, rather than signing transactions with a private key, a controller chain will send IBC packets to the host chain which signals what transactions the interchain account must execute.
- `Interchain Account Owner`: An account on the controller chain. Every interchain account on a host chain has a respective owner account on the controller chain.

The IBC handler interface & IBC relayer module interface are as defined in [ICS-25](../../core/ics-025-handler-interface) and [ICS-26](../../core/ics-026-routing-module), respectively.

### General design

A chain can utilize one or both parts of the interchain accounts protocol (*controlling* and *hosting*). A controller chain that registers accounts on other host chains (that support interchain accounts) does not necessarily have to allow other controller chains to register accounts on its chain, and vice versa.

This specification defines the general way to register an interchain account and send tx bytes to be executed on behalf of the owner account. The host chain is responsible for deserializing and executing the tx bytes and the controller chain must know how the host chain will handle the tx bytes in advance of sending a packet, thus this must be negotiated during channel creation.

### High level flow

#### Registering an Account

1. The controller chain binds a new IBC port for a given *interchain account owner*
2. The controller chain creates a new IBC channel for the associated account owner. Only the owner is authorized to send packets over the channel.
3. During the channel handshake, the host chain registers an *interchain account address* that is mapped to the account owner on the controller chain

#### Submitting Transactions

1. The controller chain serializes messages and sends them along the channel associated with the account
2. The host chain receives the IBC packet and deserializes the message
3. The host chain authenticates the transaction by retrieving the relevant address from the controller's portID, and confirming it matches the signer of the message
4. The host chain checks that each message type is whitelisted and executes the transaction

### Integration of host module

The interchain accounts module should be registered as an `AppModule` in the same way all SDK modules are registered on a chain, as well as an `IBCModule`.

```go
// app.go

// Register the AppModule for the Interchain Accounts module
ModuleBasics = module.NewBasicManager(
  ...
  ica.AppModuleBasic{},
  ...
)

...

// Add module account permissions for the Interchain Accounts module
// Only necessary for host chain functionality
// Each Interchain Account created on the host chain is derived from the module account created
maccPerms = map[string][]string{
  ...
  icatypes.ModuleName:            nil,
}

...

// Add Interchain Accounts Keepers for each submodule used and the authentication module
// If a submodule is being statically disabled, the associated Keeper does not need to be added.
type App struct {
  ...
  ICAHostKeeper       icahostkeeper.Keeper
  ...
}

...

// Create store keys for each submodule Keeper and the authentication module
keys := sdk.NewKVStoreKeys(
  ...
  icahosttypes.StoreKey,
  ...
)

...

// Create the scoped keepers for the host submodule
scopedICAHostKeeper := app.CapabilityKeeper.ScopeToModule(icahosttypes.SubModuleName)

...

// Create the Keeper for the host submodule
app.ICAHostKeeper = icahostkeeper.NewKeeper(
  appCodec, keys[icahosttypes.StoreKey], app.GetSubspace(icahosttypes.SubModuleName),
  app.IBCKeeper.ChannelKeeper, // may be replaced with middleware such as ics29 fee
  app.IBCKeeper.ChannelKeeper, &app.IBCKeeper.PortKeeper,
  app.AccountKeeper, scopedICAHostKeeper, app.MsgServiceRouter(),
)

// Create Interchain Accounts AppModule
// Since only the host module is registered, nil is passed as the controller keeper
icaModule := ica.NewAppModule(nil, &app.ICAHostKeeper)

// Create a host IBC module
icaHostIBCModule := icahost.NewIBCModule(app.ICAHostKeeper)

// Register host route
ibcRouter.
  AddRoute(icahosttypes.SubModuleName, icaHostIBCModule)
...

// Register Interchain Accounts AppModule
app.moduleManager = module.NewManager(
  ...
  icaModule,
)

...

// Add Interchain Accounts to begin blocker logic
app.moduleManager.SetOrderBeginBlockers(
  ...
  icatypes.ModuleName,
  ...
)

// Add Interchain Accounts to end blocker logic
app.moduleManager.SetOrderEndBlockers(
  ...
  icatypes.ModuleName,
  ...
)

// Add Interchain Accounts module InitGenesis logic
app.moduleManager.SetOrderInitGenesis(
  ...
  icatypes.ModuleName,
  ...
)

// initParamsKeeper init params keeper and its subspaces
func initParamsKeeper(appCodec codec.BinaryCodec, legacyAmino *codec.LegacyAmino, key, tkey sdk.StoreKey) paramskeeper.Keeper {
  ...
  paramsKeeper.Subspace(icahosttypes.SubModuleName)
  ...
}
```

### Host module parameters

| Key             | Type     | Default Value |
|-----------------|----------|---------------|
| `HostEnabled`   | bool     | `true`        |
| `AllowMessages` | []string | `["*"]`       |

#### HostEnabled

The `HostEnabled` parameter controls a chain's ability to service ICS-27 host specific logic.

#### AllowMessages

The `AllowMessages` parameter provides the ability for a chain to limit the types of messages or transactions that hosted interchain accounts are authorized to execute by defining an allowlist using the Protobuf message type URL format.

For example, a Cosmos SDK-based chain that elects to provide hosted Interchain Accounts with the ability of staking and unstaking will define its parameters as follows:

```json
"params": {
    "host_enabled": true,
    "allow_messages": ["/cosmos.staking.v1beta1.MsgDelegate", "/cosmos.staking.v1beta1.MsgUndelegate"]
}
```

There is also a special wildcard `"*"` value which allows any type of message to be executed by the interchain account. This must be the only value in the `allow_messages` array.

```json
"params": {
    "host_enabled": true,
    "allow_messages": ["*"]
}
```

## Rationale

- Permissionless: An interchain account may be created by any actor without the approval of a third party (e.g. chain governance). Note: Individual implementations may implement their own permissioning scheme, however the protocol must not require permissioning from a trusted party to be secure.
- Fault isolation: A controller chain must not be able to control accounts registered by other controller chains. For example, in the case of a fork attack on a controller chain, only the interchain accounts registered by the forked chain will be vulnerable.
- The ordering of transactions sent to an interchain account on a host chain must be maintained. Transactions must be executed by an interchain account in the order in which they are sent by the controller chain.
- If a channel closes, the controller chain must be able to regain access to registered interchain accounts by simply opening a new channel.
- Each interchain account is owned by a single account on the controller chain. Only the owner account on the controller chain is authorized to control the interchain account. The controller chain is responsible for enforcing this logic.
- The controller chain must store the account address of any owned interchain accounts registered on host chains.
- A host chain must have the ability to limit interchain account functionality on its chain as necessary (e.g. a host chain can decide that interchain accounts registered on the host chain cannot take part in staking).

## Backwards Compatibility

This proposal is backwards-incompatible because it is state-machine breaking. The feature must be introduced in a new major version.

## Test Cases

The following test cases are available in the [ibc-go e2e repository.](https://github.com/cosmos/ibc-go/tree/main/e2e/tests/interchain_accounts)

- Registration of an interchain account - [test link](https://github.com/cosmos/ibc-go/blob/main/e2e/tests/interchain_accounts/base_test.go#L46)
- [OPTIONAL] Transfer funds from interchain account to a different account on the same chain using an unordered channel - [test link](https://github.com/cosmos/ibc-go/blob/main/e2e/tests/interchain_accounts/base_test.go#L56). Note: requires ibc-go >= v8.1.0.
- Transfer funds from interchain account to a different account on the same chain using an ordered channel - [test link](https://github.com/cosmos/ibc-go/blob/main/e2e/tests/interchain_accounts/base_test.go#L52)
- A failed transfer of funds from interchain account to a different account on the same chain due to insufficient funds in the interchain account balance - [test link](https://github.com/cosmos/ibc-go/blob/main/e2e/tests/interchain_accounts/base_test.go#L159)
- Transfer funds from interchain account to a different account on the same chain after an ordered channel closes and a new channel is reopened to connect to the existing interchain account - [test link](https://github.com/cosmos/ibc-go/blob/main/e2e/tests/interchain_accounts/base_test.go#L249)
- A transfer of funds from an interchain account to a different account on the same chain using an x/gov sdk module based controller (on the controlling chain) - [test link](https://github.com/cosmos/ibc-go/blob/main/e2e/tests/interchain_accounts/gov_test.go)
- A transfer of funds from an interchain account to a different account on the same chain using a x/group sdk module based controller (on the controlling chain) - [test link](https://github.com/cosmos/ibc-go/blob/main/e2e/tests/interchain_accounts/groups_test.go)
- [OPTIONAL] A transfer of funds from an interchain account to a different account on the same chain using an incentivised IBC packet - [test link](https://github.com/cosmos/ibc-go/blob/main/e2e/tests/interchain_accounts/incentivized_test.go#L38). Note: requires relayer incentivization middleware.
- Query if host functionality is enabled - [test link](https://github.com/cosmos/ibc-go/blob/main/e2e/tests/interchain_accounts/params_test.go#L106)
- [OPTIONAL] Transfer funds from interchain account to a different account after upgrading the channel from ordered to unordered - [test link](https://github.com/cosmos/ibc-go/blob/main/e2e/tests/interchain_accounts/upgrades_test.go#L41). Note: requires ibc-go >= v8.1.0.

## Reference Implementation

The implementation of this specification can be found in the [ibc-go respository](https://github.com/cosmos/ibc-go).

## Security Considerations

### SDK Security Model

SDK modules on a chain are assumed to be trustworthy. For example, there are no checks to prevent an untrustworthy module from accessing the bank keeper.

The implementation of ICS-27 in ibc-go uses this assumption in its security considerations.

The implementation assumes other IBC application modules will not bind to ports within the ICS-27 namespace.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
