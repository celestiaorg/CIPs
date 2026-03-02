# Gemini Code Assist Configuration

This directory contains configuration to disable Gemini Code Assist for this repository.

## Current Status

Gemini Code Assist is currently **disabled** via the `config.yaml` file in this directory.

## Why is this disabled?

As discussed in [PR #391 review](https://github.com/celestiaorg/CIPs/pull/391#pullrequestreview-3878157393), the team decided to remove Gemini Code Assist from this repository.

## Configuration

The `config.yaml` file contains:
```yaml
code_review:
  disable: true
```

This prevents Gemini Code Assist from automatically reviewing pull requests.

## Complete Removal (Optional)

If you want to completely uninstall the Gemini Code Assist GitHub App (rather than just disabling it):

1. Go to the repository or organization Settings on GitHub
2. Navigate to **Integrations** → **Applications** in the left sidebar
3. Find **Gemini Code Assist** in the list
4. Click **Configure**
5. Remove the app from this repository or uninstall it completely

You can also manage installed apps at:
- Organization level: `https://github.com/organizations/celestiaorg/settings/installations`
- Repository level: Repository Settings → Integrations → Applications

**Note:** Uninstalling the app requires admin permissions on the repository or organization.

## References

- [Gemini Code Assist Documentation](https://developers.google.com/gemini-code-assist/docs/customize-gemini-behavior-github)
- [Turn off Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/turn-off-gemini)
