/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `refresh` command */
  export type Refresh = ExtensionPreferences & {}
  /** Preferences accessible in the `open-popover` command */
  export type OpenPopover = ExtensionPreferences & {}
  /** Preferences accessible in the `open-preferences` command */
  export type OpenPreferences = ExtensionPreferences & {}
  /** Preferences accessible in the `get-started` command */
  export type GetStarted = ExtensionPreferences & {}
  /** Preferences accessible in the `update` command */
  export type Update = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `refresh` command */
  export type Refresh = {}
  /** Arguments passed to the `open-popover` command */
  export type OpenPopover = {}
  /** Arguments passed to the `open-preferences` command */
  export type OpenPreferences = {}
  /** Arguments passed to the `get-started` command */
  export type GetStarted = {}
  /** Arguments passed to the `update` command */
  export type Update = {}
}

