| cip | TBD |
| - | - |
| title | Token burn mechanism |
| description | Allow users to permanently destroy TIA tokens, reducing total supply |
| author | Manav Aggarwal ([@Manav-Aggarwal](https://github.com/Manav-Aggarwal)) |
| discussions-to | TBD |
| status | Draft |
| type | Standards Track |
| category | Core |
| created | 2025-01-14 |

## Abstract

This proposal introduces a burn module (`x/burn`) that allows users to permanently destroy TIA tokens, reducing the total circulating supply.

## Motivation

The burn mechanism enables deflationary tokenomics on Celestia. For example, rollups could burn a portion of blob fees, or applications could burn protocol revenue.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 and RFC 8174.

### New Module: `x/burn`

The burn module is intentionally stateless and relies entirely on the bank module for token operations.

### Message Type

```protobuf
message MsgBurn {
  string signer = 1;
  cosmos.base.v1beta1.Coin amount = 2;
}

message MsgBurnResponse {
  cosmos.base.v1beta1.Coin burned = 1;
}
```

### Validation Rules

- `signer` MUST be a valid bech32 address
- `amount.denom` MUST be `utia` (the native staking token)
- `amount.amount` MUST be positive

### Execution Flow

1. Validate message (including denom check)
2. Transfer tokens from signer's account to the burn module account
3. Burn tokens from the module account, reducing total supply
4. Emit `EventBurn` with signer and amount

### Event

```protobuf
message EventBurn {
  string signer = 1;  // Address that burned the tokens
  string amount = 2;  // Amount burned (e.g., "1000000utia")
}
```

### CLI Usage

```shell
celestia-appd tx burn burn 1000000utia --from mykey
```

## Parameters

This module introduces no new parameters.

## Rationale

The design prioritizes simplicity over flexibility. Rather than introducing custom state, events, or configuration parameters, the module relies entirely on the bank module's existing `BurnCoins` functionality. This minimizes implementation surface area and leverages well-audited code paths.

## Backwards Compatibility

This is a consensus-breaking change that requires a network upgrade. However, it is purely additive (new module, new message type) and does not affect existing functionality.

## Test Cases

Test cases are available in the reference implementation:

- Unit tests: `x/burn/keeper_test.go`
- Integration tests: `x/burn/test/burn_test.go`

Tests cover successful burns, insufficient balance errors, wrong denom rejection, and event emission.

## Security Considerations

1. **Denom Restriction**: Only `utia` can be burned, enforced in `ValidateBasic()`. This prevents burning of IBC tokens, Hyperlane tokens, or any other bridged assets. Burning bridged assets would cause accounting discrepancies between chains, as the source chain would still consider those tokens in circulation.

2. **Irreversibility**: Burns are permanent and cannot be undone. The UI/CLI should clearly communicate this to users.

3. **Spam Mitigation**: No rate limiting is implemented as gas costs naturally discourage spam.

## Reference Implementation

The implementation is available at: https://github.com/celestiaorg/celestia-app/pull/6379

## Copyright

Copyright and related rights waived via [CC0](https://github.com/celestiaorg/CIPs/blob/main/LICENSE).
