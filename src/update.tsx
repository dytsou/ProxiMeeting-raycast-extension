import {
  Action,
  ActionPanel,
  Detail,
  Icon,
  List,
  Toast,
  copyTextToClipboard,
  open,
  showToast
} from "@raycast/api";
import { useEffect, useMemo, useState } from "react";
import { detectBrew, type BrewDetection } from "./lib/detect";

const UPGRADE_CMD = "brew upgrade --cask nextmeeting";
const REFRESH_METADATA_CMD = "brew update";

const RELEASES_URL = "https://github.com/dytsou/NextMeeting/releases";

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; brew: BrewDetection }
  | { kind: "error"; message: string };

export default function Command() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const brew = await detectBrew();
        if (!cancelled) setState({ kind: "ready", brew });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        if (!cancelled) setState({ kind: "error", message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "error") {
    return (
      <Detail
        navigationTitle="NextMeeting — Update"
        markdown={["## Something went wrong", "", state.message].join("\n")}
      />
    );
  }

  if (state.kind === "loading") {
    return (
      <List isLoading navigationTitle="NextMeeting — Update">
        <List.EmptyView title="Checking Homebrew detection…" icon={Icon.Gear} />
      </List>
    );
  }

  const { brew } = state;

  return (
    <List navigationTitle="NextMeeting — Update">
      <List.Item
        title="Update via Homebrew (recommended if you installed via cask)"
        subtitle="Copy commands + open Terminal"
        icon={Icon.Download}
        actions={
          <ActionPanel>
            <Action.Push
              title="Review upgrade commands"
              icon={Icon.Clipboard}
              target={<ConfirmHomebrewUpgrade brew={brew} />}
            />
            <Action
              title="Copy upgrade command"
              icon={Icon.CopyClipboard}
              shortcut={{ modifiers: ["cmd"], key: "c" }}
              onAction={async () => safeCopyToClipboard(UPGRADE_CMD)}
            />
            <Action title="Open Terminal" icon={Icon.Terminal} onAction={openTerminal} />
            <Action.OpenInBrowser title="Open GitHub Releases" url={RELEASES_URL} />
            <Action.OpenInBrowser title="Open README upgrade section" url="https://github.com/dytsou/NextMeeting#upgrade-with-homebrew" />
          </ActionPanel>
        }
      />

      <List.Item
        title="Update via GitHub Releases"
        subtitle="Open downloads + release notes"
        icon={Icon.Globe}
        actions={
          <ActionPanel>
            <Action.OpenInBrowser title="Open Releases" url={RELEASES_URL} />
          </ActionPanel>
        }
      />

      <List.Section title="Status">
        <List.Item
          title="Homebrew"
          icon={brew.kind === "found" ? Icon.CheckCircle : Icon.XMarkCircle}
          subtitle={brew.kind === "found" ? `Found (${brew.brewPath})` : "Not found from Raycast environment"}
          actions={
            <ActionPanel>
              {brew.kind === "found" ? (
                <Action
                  title="Copy brew path"
                  icon={Icon.CopyClipboard}
                  onAction={async () => safeCopyToClipboard(brew.brewPath)}
                />
              ) : (
                <>
                  <Action.OpenInBrowser title="Install Homebrew" url="https://brew.sh" />
                  <Action title="Open Terminal" icon={Icon.Terminal} onAction={openTerminal} />
                </>
              )}
              <Action title="Copy upgrade command anyway" icon={Icon.CopyClipboard} onAction={async () => safeCopyToClipboard(UPGRADE_CMD)} />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}

function ConfirmHomebrewUpgrade({ brew }: { brew: BrewDetection }) {
  const brewNote = useMemo(() => {
    if (brew.kind === "found") return `Homebrew detected at: \`${brew.brewPath}\``;
    return "Homebrew wasn’t detected from Raycast. If `brew` works in your Terminal, you can still run these commands below there.";
  }, [brew]);

  const troubleshootBlock = [REFRESH_METADATA_CMD, UPGRADE_CMD].join("\n");

  return (
    <Detail
      navigationTitle="Update via Homebrew"
      markdown={[
        "## Typical upgrade",
        "",
        brewNote,
        "",
        "```bash",
        UPGRADE_CMD,
        "```",
        "",
        "Raycast intentionally does **not** run `brew` for you — run this in Terminal so you can see output and respond to any prompts.",
        "",
        "## If upgrade fails",
        "",
        "Try refreshing Homebrew metadata, then upgrading again:",
        "",
        "```bash",
        troubleshootBlock,
        "```"
      ].join("\n")}
      actions={
        <ActionPanel>
          <Action title="Copy upgrade command" icon={Icon.CopyClipboard} onAction={async () => safeCopyToClipboard(UPGRADE_CMD)} />
          <Action
            title="Copy troubleshooting commands"
            icon={Icon.CopyClipboard}
            onAction={async () => safeCopyToClipboard(troubleshootBlock)}
          />
          <Action title="Open Terminal" icon={Icon.Terminal} onAction={openTerminal} />
          <Action.OpenInBrowser title="Open README troubleshooting" url="https://github.com/dytsou/NextMeeting#if-the-upgrade-fails-try" />
          <Action.OpenInBrowser title="Open GitHub Releases" url={RELEASES_URL} />
        </ActionPanel>
      }
    />
  );
}

async function safeCopyToClipboard(text: string) {
  try {
    await copyTextToClipboard(text);
    await showToast({ style: Toast.Style.Success, title: "Copied command" });
  } catch {
    await showToast({ style: Toast.Style.Failure, title: "Unable to copy to clipboard", message: "Try again." });
  }
}

async function openTerminal() {
  await open("/System/Applications/Utilities/Terminal.app");
}
