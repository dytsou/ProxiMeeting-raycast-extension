import { open, showHUD } from "@raycast/api";

export default async function Command() {
  await open("proximeeting://open-popover");
  await showHUD("ProxiMeeting: opened popover");
}
