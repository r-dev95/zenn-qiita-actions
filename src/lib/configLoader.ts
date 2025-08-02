import fs from "fs";

import { AppConfig, defaultConfig } from "./types";

/**
 * Complements user-configurable values in the app config.
 *
 * @param data config.
 * @returns App config.
 */
function complementUserConfig(data: any): AppConfig {
  const res = defaultConfig;

  if (typeof data.deleteOn === "boolean") res.deleteOn = data.deleteOn;
  if (typeof data.imageFormat === "string") res.imageFormat = data.imageFormat;

  return res;
}

/**
 * Load the app config.
 *
 * @param fPath File path.
 * @returns App config.
 */
export function loadAppConfig(fPath: string): AppConfig {
  let data: unknown;

  try {
    const contents = fs.readFileSync(fPath, "utf-8");
    data = JSON.parse(contents);
  } catch (err) {
    console.warn("Loading app config failed, using default config.", err);
    return defaultConfig;
  }
  return complementUserConfig(data);
}

/**
 * Log output app config.
 */
export const logAppConfig = (config: AppConfig) => {
  const maxKeyLen = Math.max(...Object.keys(config).map((k) => k.length)) + 1;
  console.log("--------------------------------------------------");
  console.log("App config:");
  console.log("--------------------------------------------------");
  Object.entries(config).forEach((values, num) => {
    console.log(values[0].padEnd(maxKeyLen, " ") + ": " + values[1]);
  });
  console.log("--------------------------------------------------");
};
