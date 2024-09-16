| cip | 13 |
| - | - |
| title | On-chain Governance Parameters for Celestia Network |
| description | Specification of Mainnet governance parameters in the Celestia network |
| author | Yaz Khoury <yaz@celestia.org>, Evan Forbes <evan@celestia.org> |
| discussions-to | <https://forum.celestia.org/t/cip-13-mainnet-on-chain-governance-parameters/1390> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2023-12-08 |

## Abstract

This CIP outlines the on-chain governance parameters for the Celestia Mainnet. It details both global and module-specific parameters, including their default settings, summaries, and whether they are changeable via on-chain governance. This CIP serves as a reference to making on-chain governance parameters in their current status on Celestia Mainnet transparent for all contributors.

## Motivation

Given the Celestia community and core developers are adopting the CIP process, it helps to have a CIP that references all active on-chain governance parameters as well as their current values.

Because of that, the recommendation for this CIP is to move towards being a Living status for a document as on-chain governance parameters will change over time.

Furthermore, the motivation for adding on-chain governance parameters as a reference CIP in the CIP process is to ensure discussions about on-chain parameters can still happen off-chain and in the Core Devs Calls and working groups given those are steered by the core developers of the Celestia community. This does not necessarily need to apply to parameters that are not part of the Core track of the CIP process.

## Specification

These are the parameters that are active on Celestia Mainnet. Note that not all of these parameters are changeable via on-chain governance. This list also includes parameter that require a breaking network upgrade to change due to being manually hardcoded in the application or they are blocked by the `x/paramfilter` module. The Celestia Mainnet on-chain governance parameters are as follows:

### Global parameters

| Parameter     | Default | Summary                                                                                                                | Changeable via Governance |
|---------------|---------|------------------------------------------------------------------------------------------------------------------------|---------------------------|
| MaxBlockBytes | 100MiB  | Hardcoded value in CometBFT for the protobuf encoded block.                                                            | False                     |
| MaxSquareSize | 128     | Hardcoded maximum square size determined per shares per row or column for the original data square (not yet extended). | False                     |

### Module parameters

| Module.Parameter                              | Default                                     | Summary                                                                                                                                                                                         | Changeable via Governance |
|-----------------------------------------------|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| auth.MaxMemoCharacters                        | 256                                         | Largest allowed size for a memo in bytes.                                                                                                                                                       | True                      |
| auth.SigVerifyCostED25519                     | 590                                         | Gas used to verify Ed25519 signature.                                                                                                                                                           | True                      |
| auth.SigVerifyCostSecp256k1                   | 1000                                        | Gas used to verify secp256k1 signature.                                                                                                                                                         | True                      |
| auth.TxSigLimit                               | 7                                           | Max number of signatures allowed in a multisig transaction.                                                                                                                                     | True                      |
| auth.TxSizeCostPerByte                        | 10                                          | Gas used per transaction byte.                                                                                                                                                                  | True                      |
| bank.SendEnabled                              | true                                        | Allow transfers.                                                                                                                                                                                | False                     |
| blob.GasPerBlobByte                           | 8                                           | Gas used per blob byte.                                                                                                                                                                         | True                      |
| blob.GovMaxSquareSize                         | 64                                          | Governance parameter for the maximum square size determined per shares per row or column for the original data square (not yet extended)s. If larger than MaxSquareSize, MaxSquareSize is used. | True                      |
| blobstream.DataCommitmentWindow               | 400                                         | Number of blocks that are included in a signed batch (DataCommitment).                                                                                                                          | True                      |
| consensus.block.MaxBytes                      | 1.88MiB                                     | Governance parameter for the maximum size of the protobuf encoded block.                                                                                                                        | True                      |
| consensus.block.MaxGas                        | -1                                          | Maximum gas allowed per block (-1 is infinite).                                                                                                                                                 | True                      |
| consensus.block.TimeIotaMs                    | 1000                                        | Minimum time added to the time in the header each block.                                                                                                                                        | False                     |
| consensus.evidence.MaxAgeDuration             | 1814400000000000 (21 days)                  | The maximum age of evidence before it is considered invalid in nanoseconds. This value should be identical to the unbonding period.                                                             | True                      |
| consensus.evidence.MaxAgeNumBlocks            | 120960                                      | The maximum number of blocks before evidence is considered invalid. This value will stop CometBFT from pruning block data.                                                                      | True                      |
| consensus.evidence.MaxBytes                   | 1MiB                                        | Maximum size in bytes used by evidence in a given block.                                                                                                                                        | True                      |
| consensus.validator.PubKeyTypes               | Ed25519                                     | The type of public key used by validators.                                                                                                                                                      | False                     |
| consensus.Version.AppVersion                  | 1                                           | Determines protocol rules used for a given height. Incremented by the application upon an upgrade.                                                                                              | True                      |
| distribution.BaseProposerReward               | 0                                           | Reward in the mint denomination for proposing a block.                                                                                                                                          | True                      |
| distribution.BonusProposerReward              | 0                                           | Extra reward in the mint denomination for proposers based on the voting power included in the commit.                                                                                           | True                      |
| distribution.CommunityTax                     | 0.02 (2%)                                   | Percentage of the inflation sent to the community pool.                                                                                                                                         | True                      |
| distribution.WithdrawAddrEnabled              | true                                        | Enables delegators to withdraw funds to a different address.                                                                                                                                    | True                      |
| gov.DepositParams.MaxDepositPeriod            | 604800000000000 (1 week)                    | Maximum period for token holders to deposit on a proposal in nanoseconds.                                                                                                                       | True                      |
| gov.DepositParams.MinDeposit                  | 10_000_000_000 utia (10,000 TIA)            | Minimum deposit for a proposal to enter voting period.                                                                                                                                          | True                      |
| gov.TallyParams.Quorum                        | 0.334 (33.4%)                               | Minimum percentage of total stake needed to vote for a result to be considered valid.                                                                                                           | True                      |
| gov.TallyParams.Threshold                     | 0.50 (50%)                                  | Minimum proportion of Yes votes for proposal to pass.                                                                                                                                           | True                      |
| gov.TallyParams.VetoThreshold                 | 0.334 (33.4%)                               | Minimum value of Veto votes to Total votes ratio for proposal to be vetoed.                                                                                                                     | True                      |
| gov.VotingParams.VotingPeriod                 | 604800000000000 (1 week)                    | Duration of the voting period in nanoseconds.                                                                                                                                                   | True                      |
| ibc.ClientGenesis.AllowedClients              | []string{"06-solomachine", "07-tendermint"} | List of allowed IBC light clients.                                                                                                                                                              | True                      |
| ibc.ConnectionGenesis.MaxExpectedTimePerBlock | 7500000000000 (75 seconds)                  | Maximum expected time per block in nanoseconds under normal operation.                                                                                                                          | True                      |
| ibc.Transfer.ReceiveEnabled                   | true                                        | Enable receiving tokens via IBC.                                                                                                                                                                | True                      |
| ibc.Transfer.SendEnabled                      | true                                        | Enable sending tokens via IBC.                                                                                                                                                                  | True                      |
| mint.BondDenom                                | utia                                        | Denomination that is inflated and sent to the distribution module account.                                                                                                                      | False                     |
| mint.DisinflationRate                         | 0.10 (10%)                                  | The rate at which the inflation rate decreases each year.                                                                                                                                       | False                     |
| mint.InitialInflationRate                     | 0.08 (8%)                                   | The inflation rate the network starts at.                                                                                                                                                       | False                     |
| mint.TargetInflationRate                      | 0.015 (1.5%)                                | The inflation rate that the network aims to stabalize at.                                                                                                                                       | False                     |
| slashing.DowntimeJailDuration                 | 1 min                                       | Duration of time a validator must stay jailed.                                                                                                                                                  | True                      |
| slashing.MinSignedPerWindow                   | 0.75 (75%)                                  | The percentage of SignedBlocksWindow that must be signed not to get jailed.                                                                                                                     | True                      |
| slashing.SignedBlocksWindow                   | 5000                                        | The range of blocks used to count for downtime.                                                                                                                                                 | True                      |
| slashing.SlashFractionDoubleSign              | 0.02 (2%)                                   | Percentage slashed after a validator is jailed for double signing.                                                                                                                              | True                      |
| slashing.SlashFractionDowntime                | 0.00 (0%)                                   | Percentage slashed after a validator is jailed for downtime.                                                                                                                                    | True                      |
| staking.BondDenom                             | utia                                        | Bondable coin denomination.                                                                                                                                                                     | False                     |
| staking.HistoricalEntries                     | 10000                                       | Number of historical entries to persist in store.                                                                                                                                               | True                      |
| staking.MaxEntries                            | 7                                           | Maximum number of entries in the redelegation queue.                                                                                                                                            | True                      |
| staking.MaxValidators                         | 100                                         | Maximum number of validators.                                                                                                                                                                   | True                      |
| staking.MinCommissionRate                     | 0.05 (5%)                                   | Minimum commission rate used by all validators.                                                                                                                                                 | True                      |
| staking.UnbondingTime                         | 1814400 (21 days)                           | Duration of time for unbonding in seconds.                                                                                                                                                      | False                     |

## Rationale

This section will cover the rationale of making a CIP to track Mainnet on-chain governance parameters to help the CIP process be the primary specification reference over time for those parameters. Parameters change over time, some can be added in future CIPs and authors can update this CIP doc with future ones to conveniently reflect the changes that are active on Celestia Mainnet.

This is the primary reason for recommending this document become a Living document. Furthermore as mentioned in the Motivation section, it helps ensure that changes to on-chain governance parameters happen off-chain due to ensuring the client teams in the Core Devs Call ensure rough consensus before proposing changes to consensus-critical on-chain governance parameters and activations that require a network upgrade.

## Backwards Compatibility

The proposed parameters are intended for the Mainnet and some of the parameters do require a breaking network upgrade, which introduces backward incompatibility after a network upgrade if one of those values needs to be changed.

## Security Considerations

Each parameter within the governance model must be scrutinized for its security implications. This would primarily happen in the Celestia Core Devs calls. Special attention should be paid to parameters that affect network consensus, as improper settings could lead to vulnerabilities.

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
