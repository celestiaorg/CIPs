| cip | 22 |
| - | - |
| title | Removing the blobStartIndex |
| author | NashQueue (@Nashqueue) |
| discussions-to | <https://forum.celestia.org/t/achieving-trust-minimized-light-clients-through-zk-proofs-instead-of-fraud-proofs/1759> |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2024-06-26 |

## Abstract

A reserved namespace exists to store all PayForBlobs (PFB) transactions. These transactions are populated with metadata, including the start index of the blobs that the PFB transaction references. These indices can only be populated after the blobs are in the data square, making the creation of a deterministic square layout more complicated since protobuf uses variable-length encoding. The indices were needed to create compact fraud proofs for blob inclusion proofs in the future. By removing the indices from the metadata, we can simplify the square layout creation and make it more efficient, but we have to ZK prove the blob inclusion rules instead.

## Specification

Remove the blobStartIndex from the ['WrappedTransaction'](https://celestiaorg.github.io/celestia-app/specs/data_structures.html#wrappedtransaction).

## Rationale

The blobStartIndex had two initial purposes:

1. It was needed to create compact fraud proofs for blob inclusion proofs.
2. It was needed to create the square out of the transactions alone in the absence of any constraints on blob placement.

We are solving the first by committing to proving the correctness of the square layout in the future using a ZK proof, thereby removing the need for the blobStartIndex for fraud proofs.

The second initial purpose was removed when we moved to a [deterministic square construction](https://github.com/celestiaorg/celestia-app/blob/main/docs/architecture/adr-020-deterministic-square-construction.md). With that the blobStartIndex was no longer needed for blob placements as it can be deterministically derived from the list of transactions. Each blob has to follow the [blob share commitment rules](https://celestiaorg.github.io/celestia-app/specs/data_square_layout.html#blob-share-commitment-rules) and cannot be placed at an index that does not respect the rules.

## Backwards Compatibility

Removing the index is a breaking consensus change but should not affect anybody upstream of this change.

celestia-node does not consume this index. Although they have their own way of creating the same information, this proposal is not applicable to them.

None of the rollup teams are influenced by this change except Sovereign SDK. The circuit parsing the PFB reserved namespace would break and must be adapted. The circuit does not use the information from the blobStartIndex. If this change is accepted, the live rollup teams will have to upgrade their circuits when Celestia upgrades to the new version. Currently, no rollups are live on mainnet using Celestia, so a breaking change would not affect anyone directly.

## Security Considerations

No Celestia light nodes rely on the blobStartIndex to verify the square's correctness. No fraud proofs rely on the blobStartIndex, so removing it does not affect the network's security. Without the blobStartIndex, we won't be able to create compact fraud proofs anymore. This means that accepting this proposal is also a commitment to ZK prove the validity of the square layout.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
