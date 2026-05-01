import { open, showHUD } from "@raycast/api";

export default async function Command() {
  await open("nextmeeting://refresh");
  await showHUD("NextMeeting: refreshed");
}
