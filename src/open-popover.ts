import { open, showHUD } from "@raycast/api";

export default async function Command() {
  await open("nextmeeting://open-popover");
  await showHUD("NextMeeting: opened popover");
}
