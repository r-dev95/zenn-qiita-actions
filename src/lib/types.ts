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
  diffFilePath: string;

  // The following can be set by the user:
  deleteOn: boolean;
  imageFormat: "normal" | "tag";
}

/**
 * Define the default values for app config.
 */
export const defaultConfig: AppConfig = {
  toQiita: true,
  inputDir: "",
  outputDir: "",
  diffFilePath: "diff.txt",

  // The following can be set by the user:
  deleteOn: false,
  imageFormat: "normal",
};
