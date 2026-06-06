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
import { detectBrew, isProxiMeetingAppPresent, type BrewDetection } from "./lib/detect";

const TAP_CMD = "brew tap dytsou/proximeeting";
const INSTALL_CMD = "brew install --cask proximeeting";
const INSTALL_BLOCK = [TAP_CMD, INSTALL_CMD].join("\n");

type StepState =
  | { kind: "loading" }
  | { kind: "ready"; brew: BrewDetection; appPresent: boolean }
  | { kind: "error"; message: string };

export default function Command() {
  const [state, setState] = useState<StepState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [brew, appPresent] = await Promise.all([detectBrew(), isProxiMeetingAppPresent()]);
        if (!cancelled) setState({ kind: "ready", brew, appPresent });
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
        navigationTitle="ProxiMeeting — Get Started"
        markdown={["## Something went wrong", "", state.message].join("\n")}
      />
    );
  }

  if (state.kind === "loading") {
    return (
      <List isLoading navigationTitle="ProxiMeeting — Get Started">
        <List.EmptyView title="Checking your system…" icon={Icon.Gear} />
      </List>
    );
  }

  const { brew, appPresent } = state;
  const installPrimaryTitle = appPresent ? "Open ProxiMeeting (menu bar app)" : "Install ProxiMeeting via Homebrew";

  return (
    <List navigationTitle="ProxiMeeting — Get Started">
      <List.Item
        title={installPrimaryTitle}
        subtitle={appPresent ? "Already installed" : "Copy commands + open Terminal"}
        icon={appPresent ? Icon.AppWindow : Icon.Download}
        actions={
          <ActionPanel>
            {appPresent ? (
              <>
                <Action title="Open ProxiMeeting" icon={Icon.Play} onAction={openProxiMeeting} />
                <Action.Push title="Where is it?" icon={Icon.MagnifyingGlass} target={<MenuBarExplainer />} />
                <Action.Push title="First launch & security" icon={Icon.Shield} target={<FirstLaunchSecurity />} />
              </>
            ) : (
              <>
                <Action.Push
                  title="Review install commands"
                  icon={Icon.Clipboard}
                  target={<ConfirmInstallCommands brew={brew} />}
                />
                <Action
                  title="Copy install commands"
                  icon={Icon.CopyClipboard}
                  onAction={async () => {
                    await copyTextToClipboard(INSTALL_BLOCK);
                    await showToast({ style: Toast.Style.Success, title: "Copied Homebrew commands" });
                  }}
                />
                <Action title="Open Terminal" icon={Icon.Terminal} onAction={openTerminal} />
              </>
            )}
            <Action.OpenInBrowser title="Open Homebrew website" url="https://brew.sh" />
            <Action.OpenInBrowser
              title="Open ProxiMeeting install docs (README)"
              url="https://github.com/dytsou/ProxiMeeting#2-install-with-homebrew"
            />
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
                  onAction={async () => {
                    await copyTextToClipboard(brew.brewPath);
                    await showToast({ style: Toast.Style.Success, title: "Copied brew path" });
                  }}
                />
              ) : (
                <>
                  <Action.OpenInBrowser title="Install Homebrew" url="https://brew.sh" />
                  <Action title="Open Terminal" icon={Icon.Terminal} onAction={openTerminal} />
                </>
              )}
            </ActionPanel>
          }
        />
        <List.Item
          title="ProxiMeeting.app"
          icon={appPresent ? Icon.CheckCircle : Icon.XMarkCircle}
          subtitle={appPresent ? "/Applications/ProxiMeeting.app" : "Not found in /Applications"}
          actions={
            <ActionPanel>
              {appPresent ? (
                <Action title="Open ProxiMeeting" icon={Icon.Play} onAction={openProxiMeeting} />
              ) : (
                <Action.Push title="Review install commands" icon={Icon.Clipboard} target={<ConfirmInstallCommands brew={brew} />} />
              )}
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}

function ConfirmInstallCommands({ brew }: { brew: BrewDetection }) {
  const brewNote = useMemo(() => {
    if (brew.kind === "found") return `Homebrew detected at: \`${brew.brewPath}\``;
    return "Homebrew wasn’t detected from Raycast. If `brew` works in your Terminal, you can still run the commands below there.";
  }, [brew]);

  return (
    <Detail
      navigationTitle="Install ProxiMeeting"
      markdown={[
        "## We’ll run two Homebrew commands",
        "",
        brewNote,
        "",
        "```bash",
        INSTALL_BLOCK,
        "```",
        "",
        "This will install a macOS app. You’ll run these commands in Terminal so you can see output and respond to any prompts.",
        "",
        "Prefer not to run it now? Copy the commands and do it later."
      ].join("\n")}
      actions={
        <ActionPanel>
          <Action
            title="Copy install commands"
            icon={Icon.CopyClipboard}
            onAction={async () => {
              await copyTextToClipboard(INSTALL_BLOCK);
              await showToast({ style: Toast.Style.Success, title: "Copied Homebrew commands" });
            }}
          />
          <Action title="Open Terminal" icon={Icon.Terminal} onAction={openTerminal} />
          <Action.OpenInBrowser title="Open install docs (README)" url="https://github.com/dytsou/ProxiMeeting#2-install-with-homebrew" />
        </ActionPanel>
      }
    />
  );
}

function MenuBarExplainer() {
  return (
    <Detail
      navigationTitle="Where is ProxiMeeting?"
      markdown={[
        "## ProxiMeeting is a menu bar app",
        "",
        "- Look for the ProxiMeeting icon in the macOS **menu bar** (top-right, near the clock).",
        "- It may not appear in the Dock after launch — that’s normal for menu bar apps."
      ].join("\n")}
      actions={
        <ActionPanel>
          <Action title="Open ProxiMeeting" icon={Icon.Play} onAction={openProxiMeeting} />
        </ActionPanel>
      }
    />
  );
}

function FirstLaunchSecurity() {
  return (
    <Detail
      navigationTitle="First launch & security"
      markdown={[
        "## First launch and macOS security",
        "",
        "On first launch, macOS may show a Gatekeeper warning for apps that aren’t notarized.",
        "",
        "Use the standard macOS flow:",
        "- Finder → Applications → ProxiMeeting → Control-click → **Open**",
        "- Or System Settings → Privacy & Security → **Open Anyway** (when shown)",
        "",
        "We won’t bypass macOS security — this is the normal “Open Anyway” path."
      ].join("\n")}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            title="Open full README security section"
            url="https://github.com/dytsou/ProxiMeeting#first-launch-and-security"
          />
        </ActionPanel>
      }
    />
  );
}

async function openTerminal() {
  // Don’t AppleScript/automate Terminal in v1 (avoids Automation permission prompts).
  await open("/System/Applications/Utilities/Terminal.app");
}

async function openProxiMeeting() {
  await open("/Applications/ProxiMeeting.app");
}

