| cip           | xx                                                                                         |
|---------------|--------------------------------------------------------------------------------------------|
| title         | Add Hyperlane to Celestia                                                                  |
| description   | This CIP proposes adding Hyperlane to celestia-app.                                        |
| author        | c-node [@c-node](https://github.com/S1nus), Callum Waters (@cmwaters)                      |
| discussions-to | [forum](https://forum.celestia.org/t/cip-add-hyperlane-bridging/1909)                     |
| status        | Draft                                                                                      |
| type          | Standards Track                                                                            |
| category      | Core                                                                                       |
| created       | 2025-02-21                                                                                 |

## Abstract

Add the Hyperlane interoperability protocol to Celestia to improve the accessibility and usage of TIA.

## Motivation

Hyperlane is a popular bridging protocol that has support for EVM, currently the most popular VM for Celestia Rollups, as well as several others, creating connections between some 100+ networks. Hyperlane is already employed indirectly to transfer TIA around but is dependent on third party networks, expanding the trust assumptions. Adding Hyperlane natively allows for direct transferring of TIA and possibly other tokens in the future without expanding the trust assumptions beyond the DA network.

## Specification

The full specification of the Hyperlane protocol can be found in their [docs](https://docs.hyperlane.xyz/). The protocol has many similarities with IBC. Messages can be sent and received by writing them to the state tree. A relayer reads the state of one network and relays the messages along with some proof to another network. Warp routes is the standard application built on top of the messaging protocol that supports transferring of tokens.

### Detailed Design

Hyperlane on Celestia, more concretely, requires the addition of two SDK modules: `x/core` and `x/warp`. These are imported from https://github.com/bcp-innovations/hyperlane-cosmos. Token transfer will be enabled upon upgrade.

Similar to IBC, non-native tokens will initially not be allowed on Celestia's state machine. This is enforced by disabling the creating of [synthetic tokens](https://github.com/bcp-innovations/hyperlane-cosmos/blob/2617881125228632edb091f0663d133b76de11ee/x/warp/keeper/msg_server.go#L20).

The only ISM (Interchain Security Module) that will be initially supported is the MultiSig ISM, which relies on attestations from n of m "validators" (Note that this can be different to the PoS Validators)

## Backwards Compatibility

This is an additive change. It does not break existing user flows in any way. It does however change the state transition function and requires a major upgrade.

## Test Cases

- An E2E test that connects an EVM Rollup and Celestia with Hyperlane and successfully transfers TIA from Celestia to that Rollup and back.
- A test confirming that tokens from a counterparty chain can not be transferred to Celestia.

## Reference Implementation

TBD

## Security Considerations

The Cosmos SDK Hyperlane implementation is audited by Zellic. 

Token transferring through Hyperlane is dependent on the ISM being used and inherits there security assumptions (i.e. that n of m agents are honest).

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
