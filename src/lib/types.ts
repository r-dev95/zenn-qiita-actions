/**
 * Define the types.
 */

/**
 * Define the interface for app config.
 */
export interface AppConfig {
  toQiita: boolean;
  inputDir: string;
  outputDir: string;
  imageFormat: string;
}

/**
 * Define the default values for app config.
 */
export const defaultConfig: AppConfig = {
  toQiita: true,
  inputDir: "",
  outputDir: "",
  imageFormat: "normal",
};
