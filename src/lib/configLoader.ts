import fs from "fs";

import { AppConfig, defaultConfig } from "./types";

function validate(data: any): AppConfig {
  const result: Partial<AppConfig> = {};

  result.toQiita = typeof data.toQiita === "boolean" ? data.toQiita : defaultConfig.toQiita;
  result.imageFormat = typeof data.imageFormat === "string" ? data.imageFormat : defaultConfig.imageFormat;

  return result as AppConfig;
}

export function loadAppConfig(fPath: string): AppConfig {
  let data: unknown;

  try {
    const contents = fs.readFileSync(fPath, "utf-8");
    data = JSON.parse(contents);
  } catch (err) {
    console.warn("Loading failed, using default config.", err);
    return defaultConfig;
  }
  return validate(data);
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
