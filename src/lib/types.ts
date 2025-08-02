/**
 * Define the interface for app config.
 */
export interface AppConfig {
  toQiita: boolean;
  srcDir: string;
  dstDir: string;
  srcImageBaseDir: string;
  dstImageBaseDir: string;
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
  srcDir: "",
  dstDir: "",
  srcImageBaseDir: "",
  dstImageBaseDir: "",
  diffFilePath: "diff.txt",

  // The following can be set by the user:
  deleteOn: false,
  imageFormat: "normal",
};
