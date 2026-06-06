import { open, showHUD } from "@raycast/api";

export default async function Command() {
  await open("proximeeting://refresh");
  await showHUD("ProxiMeeting: refreshed");
}
