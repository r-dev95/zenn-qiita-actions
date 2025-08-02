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
   * - If the output file exists, it will be given the same ID.
   *
   * @param newData Metadata to be updated.
   * @param outFilePath Output file path.
   * @returns Updated metadata.
   */
  updateId(newData: string, outFilePath: string): string {
    if (this.config.toQiita && fs.existsSync(outFilePath)) {
      const raw = fs.readFileSync(outFilePath, "utf-8");
      const { data, content } = matter(raw);
      newData = newData.replace("id: null", `id: ${data.id}`);
    }
    return newData;
  }

  /**
   * Convert inFilePath to outFilePath.
   *
   * @param inFilePath Input file path.
   * @param outFilePath Output file path.
   */
  convert(inFilePath: string, outFilePath: string) {
    const raw = fs.readFileSync(inFilePath, "utf-8");
    const { data, content } = matter(raw);

    // convert meta data.
    let newData = this.convertMetaData(data);
    // update id.
    newData = this.updateId(newData, outFilePath);

    // convert content.
    const newContent = this.convertContents(content);

    fs.writeFileSync(outFilePath, `${newData}${newContent}`);
  }

  /**
   * Delete any existing output files.
   *
   * - If the input file does not exist and the output file does exist, delete it.
   *
   * @param inFilePath Input file path.
   * @param outFilePath Output file path.
   */
  delete(inFilePath: string, outFilePath: string) {
    if (!fs.existsSync(inFilePath) && fs.existsSync(outFilePath)) {
      fs.rmSync(outFilePath);
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
      const inFilePath = path.join(this.config.inputDir, file.fName);
      const outFilePath = path.join(this.config.outputDir, file.fName);
      try {
        switch (file.status) {
          case "A":
          case "M":
            this.convert(inFilePath, outFilePath);
            console.log("✅ [Success] - convert " + inFilePath + " to " + outFilePath);
            break;
          case "D":
            if (this.config.deleteOn) {
              this.delete(inFilePath, outFilePath);
              console.log("✅ [Success] - delete " + outFilePath);
            }
            break;
          default:
            console.error(
              "❌ [Failure] - Processing when the status is " + file.status + " is not implemented."
            );
            break;
        }
      } catch (err: any) {
        console.error("❌ [Failure] - " + inFilePath + " / " + outFilePath);
        console.error(err.message);
      }
    });
  }
}
