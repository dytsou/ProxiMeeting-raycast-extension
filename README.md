# NextMeeting Extension

## Deep links used

- **Refresh**: `nextmeeting://refresh`
- **Open popover**: `nextmeeting://open-popover`
- **Open Preferences**: `nextmeeting://open-preferences`

## Commands

- **NextMeeting — Get Started** (install via Homebrew + first-run guidance)
- **NextMeeting — Refresh**
- **NextMeeting — Open Popover**
- **NextMeeting — Open Preferences**

## Troubleshooting

- If the commands run but nothing happens, first **launch NextMeeting once** so macOS registers the `nextmeeting://` URL scheme. Then try again.

## Get Started (Homebrew install)

This command intentionally **does not** run `brew install` inside Raycast. Instead, it:

- Shows the exact Homebrew commands
- Lets you copy them to clipboard
- Opens Terminal so you can run them with full visibility (and respond to any prompts)

Homebrew commands:

```bash
brew tap dytsou/nextmeeting
brew install --cask nextmeeting
```

## Development

```bash
npm install
npm run dev
```
