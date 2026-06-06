import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type BrewDetection =
  | { kind: "found"; brewPath: string }
  | { kind: "missing"; tried: string[] };

export async function detectBrew(): Promise<BrewDetection> {
  const tried: string[] = [];

  const candidates = ["/opt/homebrew/bin/brew", "/usr/local/bin/brew"];
  for (const candidate of candidates) {
    tried.push(candidate);
    if (await isExecutable(candidate))
      return { kind: "found", brewPath: candidate };
  }

  // Fall back to system `which` without assuming shell init scripts are loaded.
  try {
    const { stdout } = await execFileAsync("/usr/bin/which", ["brew"], {
      timeout: 1500,
      windowsHide: true,
    });
    const brewPath = stdout.trim().split("\n")[0];
    if (brewPath) {
      tried.push("which brew");
      return { kind: "found", brewPath };
    }
  } catch {
    tried.push("which brew");
  }

  return { kind: "missing", tried };
}

export async function isProxiMeetingAppPresent(): Promise<boolean> {
  // Primary v1 signal: app bundle present in /Applications.
  // Avoid requiring brew to be detectable from Raycast environment.
  try {
    await access("/Applications/ProxiMeeting.app", constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function isExecutable(path: string): Promise<boolean> {
  try {
    await access(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
