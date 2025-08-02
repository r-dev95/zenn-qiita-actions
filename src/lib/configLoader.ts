import fs from "fs";

import { AppConfig, defaultConfig } from "./types";

/**
 * Complement app config.
 *
 * @param data config.
 * @returns App config.
 */
function complement(data: any): AppConfig {
  const res: Partial<AppConfig> = {};

  res.toQiita = typeof data.toQiita === "boolean" ? data.toQiita : defaultConfig.toQiita;
  res.inputDir = typeof data.inputDir === "string" ? data.inputDir : defaultConfig.inputDir;
  res.outputDir = typeof data.outputDir === "string" ? data.outputDir : defaultConfig.outputDir;
  res.diffFilePath = typeof data.diffFilePath === "string" ? data.diffFilePath : defaultConfig.diffFilePath;

  // The following can be set by the user:
  res.deleteOn = typeof data.deleteOn === "boolean" ? data.deleteOn : defaultConfig.deleteOn;
  res.imageFormat = typeof data.imageFormat === "string" ? data.imageFormat : defaultConfig.imageFormat;

  return res as AppConfig;
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
  return complement(data);
}

/**
 * Log output app config.
 */
export const logAppConfig = (config: AppConfig) => {
  console.log("--------------------------------------------------");
  console.log("App config:");
  console.log("config.toQiita = " + config.toQiita);
  console.log("config.inputDir = " + config.inputDir);
  console.log("config.outputDir = " + config.outputDir);
  console.log("config.imageFormat = " + config.imageFormat);
  console.log("--------------------------------------------------");
};
