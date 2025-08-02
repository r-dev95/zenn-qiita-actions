import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { AppConfig } from "./types";
import { loadDiffFile } from "./diffFileLoader";
import { getConvertMetaDataFunc } from "./convertMetaData";
import { getConvertContentsFunc } from "./convertContents";

/**
 * Markdown converter.
 */
export class Converter {
  readonly config: AppConfig;
  readonly convertMetaDataFunc: CallableFunction;
  readonly convertContentsFunc: Array<CallableFunction>;

  /**
   * Initializes a new instance of this class.
   *
   * @param config The app config.
   */
  constructor(config: AppConfig) {
    this.config = config;

    this.convertMetaDataFunc = getConvertMetaDataFunc(config);
    this.convertContentsFunc = getConvertContentsFunc(config);
  }

  /**
   * Converts markdown metadata (front matter).
   *
   * @param data Metadata to be converted.
   * @returns Converted metadata.
   */
  convertMetaData(data: any): string {
    return this.convertMetaDataFunc(data);
  }

  /**
   * Converts markdown content.
   *
   * @param md Content to be converted.
   * @returns Converted content.
   */
  convertContents(md: string): string {
    return this.convertContentsFunc.reduce((acc, fn) => fn(acc), md);
  }

  /**
   * Updates the ID of the markdown metadata.
   *
   * - Only for Zenn -> Qiita.
   * - If the destination file exists, it will be given the same ID.
   *
   * @param newData Metadata to be updated.
   * @param dstFilePath Destination file path.
   * @returns Updated metadata.
   */
  updateId(newData: string, dstFilePath: string): string {
    if (this.config.toQiita && fs.existsSync(dstFilePath)) {
      const raw = fs.readFileSync(dstFilePath, "utf-8");
      const { data, content } = matter(raw);
      newData = newData.replace("id: null", `id: ${data.id}`);
    }
    return newData;
  }

  /**
   * Convert and save files from the source directory to the destination directory.
   *
   * @param srcFilePath Source file path.
   * @param dstFilePath Destination file path.
   */
  convert(srcFilePath: string, dstFilePath: string) {
    const raw = fs.readFileSync(srcFilePath, "utf-8");
    const { data, content } = matter(raw);

    // convert metadata.
    let newData = this.convertMetaData(data);
    // update id.
    newData = this.updateId(newData, dstFilePath);

    // convert content.
    const newContent = this.convertContents(content);

    fs.writeFileSync(dstFilePath, `${newData}${newContent}`);
  }

  /**
   * Copy the images from the source directory to the destination directory.
   *
   * @param srcDirPath Source image directory path.
   * @param dstDirPath Destination image directory path.
   */
  copyImage(srcDirPath: string, dstDirPath: string) {
    if (fs.existsSync(srcDirPath)) {
      fs.mkdirSync(dstDirPath, { recursive: true });
      fs.globSync(path.join(srcDirPath, "*.*")).forEach((file) => {
        fs.copyFileSync(file, path.join(dstDirPath, path.basename(file)));
      });
    }
  }

  /**
   * Delete the destination file.
   *
   * - If the source file does not exist but the destination file does exist, delete it.
   *
   * @param srcFilePath Source file path.
   * @param dstFilePath Destination file path.
   */
  delete(srcFilePath: string, dstFilePath: string) {
    if (!fs.existsSync(srcFilePath) && fs.existsSync(dstFilePath)) {
      fs.rmSync(dstFilePath);
    }
  }

  /**
   * Delete the images in the destination directory.
   *
   * - If the source image directory does not exist but the destination image directory exists, delete it.
   *
   * @param srcFilePath Source directory path.
   * @param dstFilePath Destination directory path.
   */
  deleteImage(srcDirPath: string, dstDirPath: string) {
    if (!fs.existsSync(srcDirPath) && fs.existsSync(dstDirPath)) {
      fs.rmSync(dstDirPath, { recursive: true });
    }
  }

  /**
   * Run the conversion process.
   *
   * - It will only process markdown files that have changed since the last push.
   */
  run() {
    const changeFiles = loadDiffFile(this.config.diffFilePath);
    changeFiles.forEach((file) => {
      const _fName = path.basename(file.fName).split(".")[0];

      const srcFilePath = path.join(this.config.srcDir, file.fName);
      const dstFilePath = path.join(this.config.dstDir, file.fName);
      const srcImageDirPath = path.join(this.config.srcImageBaseDir, _fName);
      const dstImageDirPath = path.join(this.config.dstImageBaseDir, _fName);

      try {
        switch (file.status) {
          case "A":
          case "M":
            this.convert(srcFilePath, dstFilePath);
            console.log("✅ [Success] - convert " + srcFilePath + " to " + dstFilePath);
            this.copyImage(srcImageDirPath, dstImageDirPath);
            console.log("✅ [Success] - copy image " + srcFilePath + " to " + dstFilePath);
            break;
          case "D":
            if (this.config.deleteOn) {
              this.delete(srcFilePath, dstFilePath);
              console.log("✅ [Success] - delete " + dstFilePath);
              this.deleteImage(srcImageDirPath, dstImageDirPath);
              console.log("✅ [Success] - delete image " + dstImageDirPath);
            }
            break;
          default:
            console.error(
              "❌ [Failure] - Processing when the status is " + file.status + " is not implemented."
            );
            break;
        }
      } catch (err: any) {
        console.error("❌ [Failure] - " + srcFilePath + " / " + dstFilePath);
        console.error(err.message);
      }
    });
  }
}
