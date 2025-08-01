import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { AppConfig } from "./types";
import { loadDiffFile } from "./diffFileLoader";
import { getConvertMetaDataFunc } from "./convertMetaData";
import { getConvertContentsFunc } from "./convertContents";

export class Converter {
  readonly config: AppConfig;
  readonly convertMetaDataFunc: CallableFunction;
  readonly convertContentsFunc: Array<CallableFunction>;

  constructor(config: AppConfig) {
    this.config = config;

    this.convertMetaDataFunc = getConvertMetaDataFunc(config);
    this.convertContentsFunc = getConvertContentsFunc(config);
  }

  convertMetaData(data: any): string {
    return this.convertMetaDataFunc(data);
  }

  convertContents(md: string): string {
    return this.convertContentsFunc.reduce((acc, fn) => fn(acc), md);
  }

  updateId(newData: string, outFilePath: string): string {
    if (this.config.toQiita && fs.existsSync(outFilePath)) {
      const raw = fs.readFileSync(outFilePath, "utf-8");
      const { data, content } = matter(raw);
      newData = newData.replace("id: null", `id: ${data.id}`);
    }
    return newData;
  }

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

  delete(inFilePath: string, outFilePath: string) {
    if (!fs.existsSync(inFilePath) && fs.existsSync(outFilePath)) {
      fs.rmSync(outFilePath);
    }
  }

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
        }
      } catch (err: any) {
        console.log("❌ [Failure] - " + inFilePath + " / " + outFilePath);
        console.error(err.message);
      }
    });
  }
}
