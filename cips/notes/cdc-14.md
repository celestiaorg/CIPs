# Celestia Core Devs Call 14 notes

## Overview

- Lemongrass hard fork ([CIP-17](../cip-017.md)) final release expected by end of week, to be deployed on Arabica testnet in early August
- [CIP-21](../cip-021.md) (blob with verified signers) in Last Call stage, integration with celestia-app in progress
- [CIP-22](../cip-022.md) (remove `IndexWrapper`) moved to review status, discussion on potential impacts
- [CIP-23](../cip-023.md) (coordinated prevote time) introduced to solve inconsistent block times, prototype expected in 1-2 weeks
- Celestia state machine v3 to include author blobs and delayed voting features, with potential upgrade system refactor

## Lemongrass hard fork update

- Final release of celestia-app v2.0.0 expected by end of week
- To be incorporated into celestia-node v0.16.0 (tentative)
- Deployment timeline (tentative):
  - Arabica testnet: Early August
  - Mocha testnet: Mid August
  - Mainnet: Late August (assuming no bugs)
- Services running on Celestia urged to deploy to Arabica and Mocha testnets for compatibility testing

## Blob with verified signers progress

- First release candidate of go-square cut
- Integration with celestia-app started, expected to complete in 1-2 weeks
- QA testing to follow, likely to undergo audits
- [CIP-21](../cip-021.md) to be moved to Last Call stage, pending preliminary QA before moving to Final

## Removing index wrapper proposal

- [CIP-22](../cip-022.md) moved to review status with updated specification
- Benefits:
  - Makes PFB transaction deterministic
  - Simplifies square construction
  - Prerequisite for future features like hash blocks of squares
- Potential impacts on SDK parsing logic discussed
- Evan suggested exploring implications for square layout and fraud proofs

## Coordinated prevote time introduction

- [CIP-23](../cip-023.md) introduced to address inconsistent block times
- Proposes delaying pre-vote until end of timeout propose
- Aims to provide finality on a regular cadence
- Prototype expected in 1-2 weeks
- Informal Systems to be involved in auditing

## Celestia state machine v3 features

- Confirmed features:
  - Authored blobs ([CIP-21](../cip-021.md))
  - Delayed voting ([CIP-23](../cip-023.md))
- Potential inclusion:
  - Refactor of upgrade system for Cosmos SDK compatibility
- Meta CIP for v3 features to be written and discussed in next call
- v3 upgrade planned to follow shortly after Lemongrass hard fork
