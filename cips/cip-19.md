| cip | 19 |
| - | - |
| title | Shwap Protocol |
| description | Shwap - a new messaging framework for DA and sampling |
| author | Hlib Kanunnikov ([@Wondertan](https://github.com/Wondertan)) |
| discussions-to | <https://forum.celestia.org/t/cip-shwap-protocol/1551> |
| status | Review |
| type | Standards Track |
| category | Data Availability, Networking |
| created | 2024-02-02 |

## Abstract

This document specifies Shwap (a portmanteau of share and swap)  - the simple, expressive, and extensible messaging framework aiming to
solve critical inefficiencies and standardize messaging of Celestia's Data Availability p2p network.

Shwap defines a messaging framework to be exchanged around the DA p2p network in a trust-minimized way without enforcing
transport (QUIC/TCP or IP) or application layer protocol semantics (e.g., HTTP/x). Using this framework, Shwap
declares the most common messages and provides options for stacking them with lower-level protocols.
Shwap can be stacked together with application protocol like HTTP/x, [KadDHT][kaddht], [Bitswap][bitswap] or any custom
protocol.

## Motivation

The current Data Availability Sampling (DAS) network protocol is inefficient. A _single_ sample operation takes log₂(k)
network roundtrips (where k is the extended square size). This is not practical and does not scale for the theoretically unlimited
data square that the Celestia network enables. The main motive here is a protocol with O(1) roundtrip for _multiple_
samples, preserving the assumption of having 1/N honest peers connected possessing the data.

Initially, Bitswap and IPLD were adopted as the basis for the DA network protocols, including DAS,
block synchronization (BS), and blob/namespace data retrieval (ND). They gave battle-tested protocols and tooling with
pluggability to rapidly scaffold Celestia's DA network. However, it came with the price of scalability limits and
roundtrips, resulting in slower BS than block production. Before the network launch, we transitioned to the optimized
[ShrEx protocol][shrex] for BS and integrated [CAR and DAGStore-based storage][storage] optimizing BS and ND. However,
DAS was left untouched, preserving its weak scalability and roundtrip inefficiency.

Shwap messaging stacked together with Bitswap protocol directly addresses described inefficiency and provides a foundation
for efficient communication for BS, ND, and beyond.

## Rationale

The atomic primitive of Celestia's DA network is the share. Shwap standardizes messaging and serialization for shares.
Shares are grouped together, forming more complex data types (Rows, Blobs, etc.). These data types are encapsulated in
containers. For example, a row container groups the shares of a particular row. Containers can be identified with the share
identifiers in order to request, advertise or index the containers. The combination of containers and identifiers
provides an extensible and expressive messaging framework for groups of shares and enables efficient single roundtrip
request-response communication.

Many share groups or containers are known in the Celestia network, and systemizing this is the main reason behind setting
up this simple messaging framework. A single place with all the possible Celestia DA messages must be defined, which node
software and protocol researchers can rely on and coordinate. Besides, this framework is designed to be sustain changes
in the core protocol's data structures and proving system as long shares stay the de facto atomic data type.

Besides, there needs to be systematization and a joint knowledge base with all the edge cases for possible protocol
compositions of Shwap with lower-level protocols Bitswap, KadDHT, or Shrex, which Shwap aims to describe.

## Specification

### Terms and Definitions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in BCP
14 [RFC2119] [RFC8174] when, and only when, they appear in all
capitals, as shown here.

Commonly used terms in this document are described below.

_**Shwap**_: The protocol described by this document. Shwap is a
portmanteau name of words share and swap.

_**[Share][shares]**_: The core data structure of DataSquare **"swapped"** between peers.

_**[DataSquare][square]**_: The DA square format used by Celestia DA network.

_**[DAH][dah]**_: The Data Availability Header with Row and Column commitments.

_**[Namespace][ns]**_: The namespace grouping sets of shares.

_**Peer**_: An entity that can participate in a Shwap protocol. There are three types of peers:
client, server, and node.

_**Client**_: The Peer that requests content by share identifiers over Shwap.

_**Server**_: The Peer that responds with shares over Shwap.

_**Node**_: The peer that is both the client and the server.

_**Proof**_: A Merkle inclusion proof of the data in the DataSquare.

### Message Framework

This section defines Shwap's messaging framework. Every group of shares that needs to be exchanged over the network
MUST define its [share identifier](#share-identifiers) and [share container](#share-containers) and follow their
described rules. Every identifier and container MUST define its serialization format, which MAY NOT be consistent with
other identifiers and containers.

#### Share Containers

Share containers encapsulate a set of data shares with proof. Share containers are identified by [share identifiers](#share-identifiers).

Containers SHOULD contain shares within a single DataSquare and MAY NOT be adjacent. Containers MUST have a [DAH][dah]
inclusion proof field defined.

##### Serialization for Share Containers

Share containers are RECOMMENDED to use protobuf (proto3) encoding, and other formats MAY be used for serialization. A
container MAY define multiple serialization formats.

#### Share Identifiers

Share identifiers identify [share containers](#share-containers). Identifiers are not collision-resistant and there MAY
be different identifiers referencing the same container. There SHOULD NOT be multiple containers identified by the same
identifier.

Identifiers MAY embed each other to narrow down the scope of needed shares. For example, [SampleID](#sampleid) embeds
[RowID](#rowid) as every sample lay on a particular row.

##### Serialization for Share Identifiers

Share identifiers MUST be serialized by concatenating big-endian representations of fields in the order defined by
their respective formatting section. Serialized identifiers SHOULD have constant and predetermined lengths in bytes.

#### Versioning

If a defined share container or identifier requires an incompatible change, the new message type MAY be introduced
suffixed with a new major version starting from v1. E.g., if the Row message needs a revision, RowV1 is created.

### Messages

This section defines all the supported Shwap messages, including share identifiers and containers. All the new
future messages should be described in this section.

#### EdsID

EdsID identifies the [DataSquare][square].

EdsID identifiers are formatted as shown below:

```text
EdsID {
    Height: u64;
}
```

The fields with validity rules that form EdsID are:

**Height**: A uint64 representing the chain height with the data square. It MUST be greater than zero.

[Serialized](#serialization-for-share-identifiers) EdsID MUST have a length of 8 bytes.

#### Eds Container

Eds containers encapsulate the [DataSquare][square]. Internally, they only keep the original data (1st quadrant) of the
EDS with redundant data (2nd, 3rd and 4th quadrants) computable from the original data.

Eds containers MUST be formatted by serializing ODS left-to-right share-by-share in the row-major order.

Due to ever-growing nature of [DataSquare][square], the Eds containers SHOULD be streamed over reliable links in the
share-by-share formatting above.

#### RowID

RowID identifies the [Row shares container](#row-container) in a [DataSquare][square].

RowID identifiers are formatted as shown below:

```text
RowID {
    EdsID;
    RowIndex: u16;
}
```

The fields with validity rules that form RowID are:

[**EdsID**](#edsid): A EdsID of the Row Container. It MUST follow [EdsID](#edsid) formatting and field validity rules.

**RowIndex**: An uint16 representing row index points to a particular row. The 16 bit limit fits data squares up to 2TB.
It MUST not exceed the number of [DAH][dah] Row roots reduced by one.

[Serialized](#serialization-for-share-identifiers) RowID MUST have a length of 10 bytes.

#### Row Container

Row containers encapsulate the rows of the [DataSquare][square]. Internally, they only keep the left (original) half of
the row with right (redundant) half recomputable from the left half.

Row containers are protobuf formatted using the following proto3 schema:

```protobuf
syntax = "proto3";

message Row {
  repeated Share shares_half = 1;
  HalfSide half_side= 2;
  
  enum HalfSide {
    LEFT = 0;
    RIGHT = 1;
  }
}
```

The fields with validity rules that form Row containers are:

**SharesHalf**: A variable size [Share](#share) array representing either left or right half of a row. Which half side
is defined by **HalfSide** field. Its length MUST be equal to the number of Column roots in [DAH][dah] divided by two.
The opposite half is computed using Leopard GF16 Reed-Solomon erasure-coding. Afterward, the [NMT][nmt] is built over
both halves and the computed NMT root MUST be equal to the respective Row root in [DAH][dah].

**HalfSide**: An enum defining which side of the row **SharesHalf** field contains. It MUST be either **LEFT** or
**RIGHT**.

#### SampleID

SampleID identifies a Sample container of a single share in a [DataSquare][square].

SampleID identifiers are formatted as shown below:

```text
SampleID {
    RowID;
    ColumnIndex: u16; 
}
```

The fields with validity rules that form SampleID are:

[**RowID**](#rowid): A RowID of the sample. It MUST follow [RowID](#rowid) formatting and field validity rules.

**ColumnIndex**: A uint16 representing the column index of the sampled share; in other words, the share index in the row.
The 16 bit limit fits data squares up to 2TB. It MUST stay within the number of [DAH][dah] Column roots reduced by one.

[Serialized](#serialization-for-share-identifiers) SampleID MUST have a length of 12 bytes.

#### Sample Container

Sample containers encapsulate single shares of the [DataSquare][square].

Sample containers are protobuf formatted using the following proto3 schema:

```protobuf
syntax = "proto3";

message Sample {
    Share share = 1;
    Proof proof = 2;
    AxisType proof_type = 3;
}
```

The fields with validity rules that form Sample containers are:

**Share**: A [Share](#share) of a sample.

**Proof**: A [protobuf formated][nmt-pb] [NMT][nmt] proof of share inclusion. It MUST follow [NMT proof verification][nmt-verify]
and be verified against the respective root from the Row or Column axis in [DAH][dah]. The axis is defined by the
ProofType field.

[**AxisType**](#axistype): An enum defining which axis root the **Proof** field is coming from. It MUST be either **ROW** or
**COL**.

#### RowNamespaceDataID

RowNamespaceDataID identifies [namespace][ns] Data container of shares within a _single_ Row. That is, namespace shares spanning
over multiple Rows are identified with multiple identifiers.

RowNamespaceDataID identifiers are formatted as shown below:

```text
RowNamespaceDataID {
    RowID;
    Namespace;
}
```

The fields with validity rules that form RowNamespaceDataID are:

[**RowID**](#rowid): A RowID of the namespace data. It MUST follow [RowID](#rowid) formatting and field validity rules.

[**Namespace**][ns]: A fixed-size 29 bytes array representing the Namespace of interest. It MUST follow [Namespace][ns]
formatting and its validity rules.

[Serialized](#serialization-for-share-identifiers) RowNamespaceDataID MUST have a length of 39 bytes.

#### RowNamespaceData Container

RowNamespaceData containers encapsulate user-submitted data under [namespaces][ns] within a single [DataSquare][square]
row.

RowNamespaceData containers are protobuf formatted using the following proto3 schema:

```protobuf
syntax = "proto3";

message RowNamespaceData {
    repeated Share shares = 1;
    Proof proof = 2;
}
```

The fields with validity rules that form Data containers are:

**Shares**: A variable size [Share](#share) array representing data of a namespace in a row.

**Proof**: A [protobuf formated][nmt-pb] [NMT][nmt] proof of share inclusion. It MUST follow [NMT proof verification][nmt-verify]
and be verified against the respective root from the Row root axis in [DAH][dah].

Namespace data may span over multiple rows, in which case all the data is encapsulated in multiple RowNamespaceData
containers. This enables parallelization of namespace data retrieval and certain [compositions](#protocol-compositions)
may get advantage of that by requesting containers of a single namespace from multiple servers simultaneously.

#### RangeNamespaceDataID

RangeNamespaceDataID: encapsulates SampleID, Namespace and identifies the continuous range of shares in the DataSquare,
starting from the given [SampleID](#sampleid) and contains `Length` number of shares. Formated as below:

```text
RangeNamespaceDataID {
  SampleID;
  Namespace;
  Length: u16;
  OmitData: bool;	
}
```

The fields with validity rules that form RangeNamespaceDataID are:

[SampleID](#sampleid): it MUST follow formatting and validity rules.

[**Namespace**][ns]: A fixed-size 29 bytes array representing the Namespace of interest. It MUST follow [Namespace][ns]
formatting and its validity rules.

Length: uint16 representation of the length of the range. This number MUST NOT exceed the last original share of the DataSquare.

OmitData:  bool flag that specifies whether the user expects the original data along with the proof or not.

[Serialized](#serialization-for-share-identifiers) RangeNamespaceDataID MUST have a length of 44 bytes.

#### RangeNamespaceData

RangeNamespaceData containers encapsulate user-submitted data under [namespaces][ns] within a single or multiple
of [DataSquare][square] rows. It MAY contain [shares][shares] and [NMT][nmt] proof of share inclusion or proof only.

RangeNamespaceData are protobuf formatted using the following proto3 schema:

```protobuf
syntax = "proto3";

message RangeNamespaceData{
  repeated RowNamespaceData namespaceData = 1;
}
```

The fields with validity rules that form [RowNamespaceData](#rownamespacedata-container) container.

### Core Structures

This section is purposed for messages that do not fit into [Identifier](#share-identifiers) or [Container](#share-containers)
categories, but have to be strictly specified to be used across the categories and beyond.

#### AxisType

The [data square][square] consists of rows and columns of [shares][shares] that are committed in NMT merkle trees.
Subsequently, we have two commitments over any share in the square. AxisType helps to point to either of those in
different contexts.

```protobuf
syntax = "proto3";

enum AxisType {
    ROW = 0;
    COL = 1;
}
```

#### Share

[Share][shares] defines the atomic primitive of the [data square][square].

```protobuf
syntax = "proto3";

message Share {
   bytes data = 1;
}
```

The fields with validity rules that form Data containers are:

**Data**: A variable size byte array representing a share. It MUST follow [share formatting and validity][shares-format]
rules.

## Protocol Compositions

This section specifies compositions of Shwap with other protocols. While Shwap is transport agnostic, there are rough
edges on the protocol integration, which every composition specification has to describe.

### Bitswap

[Bitswap][bitswap] is an application-level protocol for sharing verifiable data across peer-to-peer networks.
Bitswap operates as a dynamic want-list exchange among peers in a network. Peers continuously update and share their
want lists of desired data in real time. It is promptly fetched if at least one connected peer has the needed data.
This ongoing exchange ensures that as soon as any peer acquires the sought-after data, it can instantly share it with
those in need.

Shwap is designed to be synergetic with Bitswap, as that is the primary composition to be deployed in Celestia's DA
network. Bitswap provides the 1/N peers guarantee and can parallelize fetching across multiple peers. Both of these properties
significantly contribute to Celestia's efficient DAS protocol.

Bitswap runs over the libp2p stack, which provides QUIC transport integration. Subsequently, Shwap will benefit from features
libp2p provides together with transport protocol advancements introduced in QUIC.

#### Multihashes and CIDs

Bitswap is tightly coupled with [Multihash][mh] and [CID][cid] notions, establishing the [content addressability property][content-address].
Bitswap operates over Blocks of data that are addressed and verified by CIDs. Based on that, Shwap integrates into
Bitswap by complying with both of these interfaces. The [Share Containers](#share-containers) are Blocks that are identified
via [Share Identifiers](#share-identifiers).

Even though Shwap takes inspiration from content addressability, it breaks free from the hash-based model to optimize
message sizes and data request patterns. In some way, it hacks into multihash abstraction to make it contain data that
is not, in fact, a hash. Furthermore, the protocol does not include hash digests in the multihashes. The authentication
of the messages happens using externally provided data commitment.

However, breaking-free from hashes creates issues necessary to be solved on the implementation level, particularly in
[the reference Golang implementation][gimpl], if forking and substantially diverging from the upstream is not an option.
CIDs are required to have fixed and deterministic sizes. Making share identifiers compliant with CID
prevents protobuf usage due to its reliance on varints and dynamic byte arrays serialization.

The naive question would be: "Why not make content verification after Bitswap provided it back over its API?" Intuitively,
this would simplify much and would not require "hacking" CID. However, this has an important downside - the Bitswap, in
such a case, would consider the request finalized and the content as fetched and valid, sending a DONT_WANT message to
its peers. In contrast, the message might still be invalid according to the verification rules.

Bitswap still requires multihashes and CID codecs to be registered. Therefore, we provide a table for the
required [share identifiers](#share-identifiers) with their respective multihash and CID codec codes. This table
should be extended whenever any new share identifier or new version of an existing identifier is added.

| Name               | Multihash | Codec  |
|--------------------|-----------|--------|
| EdsID*             | N/A       | N/A    |
| RowID              | 0x7801    | 0x7800 |
| SampleID           | 0x7811    | 0x7810 |
| RowNamespaceDataID | 0x7821    | 0x7820 |

*EdsID and container are excluded from Bitswap composition. Bitswap is limited to messages of size 256kb, while EDSes are
expected to be bigger. Also, it is more efficient to parallelize EDS requesting by rows.

#### Blocks

Bitswap operates over IPFS blocks (not to mix with Celestia or other blockchain blocks). An IPFS block is a blob of
arbitrary bytes addressed and identified with a [CID](#multihashes-and-cids). An IPFS block must have a CID encoded into
it, s.t. the CID can either be computed by hashing the block or by extracting it out of the block data itself.

In order for the composition to work, Shwap has to comply with the block format and for this we introduce general
_adapter_ block type. As Shwap container identifiers are not hash-based and aren't computable, we
have to encode CIDs into the block adapter for the containers.

The block adapter is protobuf encoded with the following schema:

```protobuf
syntax = "proto3";

message Block {
  bytes cid = 1;
  bytes container = 2;
}
```

The fields with validity rules that form the Block are:

**CID**: A variable size byte array representing a CID. It MUST follow [CIDv1][cidv1] specification. The encoded
multihash and codec codes inside of the CID MUST be from one of the registered IDs defined in [the table](#multihashes-and-cids).

**Container**: A variable size byte array representing a protobuf serialized Shwap Container. It MUST be of a type
defined by multihash and codec in the CID field. It MUST be validated according to validity rules of the respective Shwap
Container.

## Backwards Compatibility

Shwap is incompatible with the old sampling protocol.

After rigorous investigation, the celestia-node team decided against _implementing_ backward compatibility with
the old protocol into the node client due to the immense complications it brings. Instead, the simple and time-efficient
strategy is transiently deploying infrastructure for old and new versions, allowing network participants to migrate
gradually to the latest version. We will first deprecate the old version, and once the majority has migrated, we will
terminate the old infrastructure.

## Considerations

### Security

Shwap does not change the security model of Celestia's Data Availability network and changes the underlying
protocol for data retrieval.

Essentially, the network and its codebase get simplified and require less code and infrastructure to operate. This in turn
decreases the amount of implementation vulnerabilities, DOS vectors, message amplification, and resource exhaustion attacks.
However, new bugs may be introduced, as with any new protocol.

### Protobuf Serialization

Protobuf is recommended used to serialize [share containers](#share-containers). It is a widely adopted serialization format and is
used within Celestia's protocols. This was quite an obvious choice for consistency reasons, even though we could choose
other more efficient and advanced formats like Cap'n Proto.

### Constant-size Identifier Serialization

Share identifiers should be of a constant size according to the spec. This is needed to support [Bitswap composition](#bitswap),
which has an implementation level limitation that enforces constant size identifiers. Ideally, this should be avoided as
Shwap aims to be protocol agnostic, and future iterations of Shwap may introduce dynamically sized identifiers if constant
ever becomes problematic.

### Sampling and Reconstruction

Shwap deliberately avoids specifying sampling and reconstruction logic. The sampling concerns on randomness selection and
sample picking are out of Shwap's scope and a matter of following CIPs. Shwap only provides messaging for sampling(via
[SampleID](#sampleid) and [Sample container](#sample-container)).

## Reference Implementation

- [Go reference implementation with Bitswap composition][gimpl]
- [Rust implementation with Bitswap composition][rimpl]

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).

[shrex]: https://github.com/celestiaorg/celestia-node/blob/0abd16bbb05bf3016595498844a588ef55c63d2d/docs/adr/adr-013-blocksync-overhaul-part-2.md
[storage]: https://github.com/celestiaorg/celestia-node/blob/a33c80e20da684d656c7213580be7878bcd27cf4/docs/adr/adr-011-blocksync-overhaul-part-1.md
[bitswap]: https://docs.ipfs.tech/concepts/bitswap/
[cid]: https://docs.ipfs.tech/concepts/content-addressing/
[cidv1]: https://docs.ipfs.tech/concepts/content-addressing/#version-1-v1
[mh]: https://multiformats.io/multihash/
[content-address]: https://fission.codes/blog/content-addressing-what-it-is-and-how-it-works/
[kaddht]: https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf
[square]: https://celestiaorg.github.io/celestia-app/specs/data_structures.html#2d-reed-solomon-encoding-scheme
[shares]: https://celestiaorg.github.io/celestia-app/specs/shares.html#abstract
[shares-format]: https://celestiaorg.github.io/celestia-app/specs/shares.html#share-format
[dah]: https://celestiaorg.github.io/celestia-app/specs/data_structures.html#availabledataheader
[ns]: https://celestiaorg.github.io/celestia-app/specs/namespace.html#abstract
[nmt]: https://github.com/celestiaorg/nmt/blob/master/docs/spec/nmt.md
[nmt-pb]: https://github.com/celestiaorg/nmt/blob/f5556676429118db8eeb5fc396a2c75ab12b5f20/pb/proof.proto
[nmt-verify]: https://github.com/celestiaorg/nmt/blob/master/docs/spec/nmt.md#namespace-proof-verification
[gimpl]: https://github.com/celestiaorg/celestia-node/pull/2675
[rimpl]: https://github.com/eigerco/lumina/blob/561640072114fa5c4ed807e94882473476a41dda/node/src/p2p/shwap.rs
