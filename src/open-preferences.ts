import { open, showHUD } from "@raycast/api";

export default async function Command() {
  await open("nextmeeting://open-preferences");
  await showHUD("NextMeeting: opened Preferences");
}
