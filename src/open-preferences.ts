import { open, showHUD } from "@raycast/api";

export default async function Command() {
  await open("proximeeting://open-preferences");
  await showHUD("ProxiMeeting: opened Preferences");
}
