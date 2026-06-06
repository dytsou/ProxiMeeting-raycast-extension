# ProxiMeeting Extension

## Deep links used

- **Refresh**: `proximeeting://refresh`
- **Open popover**: `proximeeting://open-popover`
- **Open Preferences**: `proximeeting://open-preferences`

## Commands

- **ProxiMeeting — Get Started** (install via Homebrew + first-run guidance)
- **ProxiMeeting — Update** (upgrade via Homebrew + open GitHub Releases)
- **ProxiMeeting — Refresh**
- **ProxiMeeting — Open Popover**
- **ProxiMeeting — Open Preferences**

## Troubleshooting

- If the commands run but nothing happens, first **launch ProxiMeeting once** so macOS registers the `proximeeting://` URL scheme. Then try again.

## Get Started (Homebrew install)

This command intentionally **does not** run `brew install` inside Raycast. Instead, it:

- Shows the exact Homebrew commands
- Lets you copy them to clipboard
- Opens Terminal so you can run them with full visibility (and respond to any prompts)

Homebrew commands:

```bash
brew tap dytsou/proximeeting
brew install --cask proximeeting
```

## Development

```bash
npm install
npm run dev
```
