# Zero Knowledge (ZK) Working Group

## Meetings

| № |      Date      |                                                         Agenda                                                         |   Notes    |                                                Recording                                                |
|:-:|:--------------:|:----------------------------------------------------------------------------------------------------------------------:|:----------:|:-------------------------------------------------------------------------------------------------------:|
| 1 |  Jan 24, 2024  |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1lB8GsyMicC3W-kmT8urjq6VXvf3S0CY4/view?usp=drive_link) |
| 2 |  Feb 7, 2024   | [Agenda Link](https://docs.google.com/presentation/d/1jTf28upZBGwrrD8DiFVWTZZtNj_5XvNHhAtqIJuQWtY/edit?usp=drive_link) | Notes Link | [Recording Link](https://drive.google.com/file/d/1v9iB_mNRp9_oIZWMX6PFO652y0jnBvHD/view?usp=drive_link) |
| 3 |  Feb 21, 2024  |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1tjjbiXfgbbWcRHuo1RH51OvmLKIJPIhQ/view?usp=drive_link) |
| 4 | March 6, 2024  |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1iTa6U6BSsLMcaHJ4rB-KlLPOJInlJ7r2/view?usp=drive_link) |
| 5 | March 21, 2024 |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1vKg8qA6tSAXPopt6G0Bsgf9jdAAjeN3u/view?usp=drive_link) |
| 6 | April 4, 2024  |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1ZvPuRZc0NhA52-8dfxpULZE2K4PYKwB-/view?usp=drive_link) |
| 7 |  May 1, 2024   |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1qMjamf5Bb0qC0O3J2Ar_EPnw14_6q6os/view?usp=drive_link) |
| 8 |  May 22, 2024  |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1m_KAVIkLWYkWxF0iPkKaSByCw5HV-g-q/view?usp=drive_link) |
| 9 |  May 29, 2024  |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1bYW8yyL3rcneDDXqwcXMKJxxr7vAHdV0/view?usp=drive_link) |
| 10 |  June 19, 2024  |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1qE4Cs94PHN2d2XgocTS3eZvK0DiCtPfh/view?usp=sharing) |
| 11 |  July 3, 2024  |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1G3-neciXRTAUPj9whRVw9sCwokdzx8rk/view?usp=drive_link) |
| 11 |  July 17, 2024  |                                                      Agenda Link                                                       | Notes Link | [Recording Link](https://drive.google.com/file/d/1NUXTr8K_21Kthtf4uGDdjDf6Wlv6uJC9/view?usp=drive_link) |

## Resources

- [Overview](overview.md)
- [Shumo/Nebra's notes on GNARK](https://hackmd.io/@nebra-one/Bk2E3JfJA)
- [Uma/Succinct's post on Snark accounts](https://forum.celestia.org/t/celestia-snark-accounts-design-spec/1639)
- [John Adler's research day talk](https://www.youtube.com/watch?v=SrZ9Ux2Ktt8)

## Questions

- Do we want to support forced withdrawals or forced state transitions?
- How do we serialize deposits into rollups?
- Do we need Acks when transferring tokens between Celestia and the rollup?
- Are Acks isomorphic to Option 4 of the spec proposal?
- Do we need an on-chain light client of Celestia on the SNARK account if we want to support SNARK account <-> SNARK account bridging?
- Can SNARK accounts upgrade, and if yes what kind of changes do we have to make?
- Are there any other requirements of the rollup client on Celestia that we have to take into account?
- Do we have to support transfers other than TIA?
