import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { AppConfig } from "./types";
import { getConvertMetaDataFunc } from "./convertMetaData";
import { getConvertContentsFunc } from "./convertContents";

export class Converter {
  readonly config: AppConfig;
  readonly convertMetaDataFunc: CallableFunction;
  readonly convertContentsFunc: Array<CallableFunction>;

  constructor(config: AppConfig) {
    this.config = config;

    this.convertContentsFunc = getConvertContentsFunc(config);
    this.convertMetaDataFunc = getConvertMetaDataFunc(config);
  }

  convertMetaData(md: any) {
    return this.convertMetaDataFunc(md);
  }

  convertContents(md: string) {
    return this.convertContentsFunc.reduce((acc, fn) => fn(acc), md);
  }

  convert(inFilePath: string, outFilePath: string) {
    const raw = fs.readFileSync(inFilePath, "utf-8");
    const { data, content } = matter(raw);

    // convert meta data.
    let newData = this.convertMetaData(data);

    // convert content.
    const newContent = this.convertContents(content);

    // update id.
    if (fs.existsSync(outFilePath)) {
      const raw = fs.readFileSync(outFilePath, "utf-8");
      const { data, content } = matter(raw);
      newData = newData.replace("id: null", `id: ${data.id}`);
    }

    fs.writeFileSync(outFilePath, `${newData}${newContent}`);
  }

  run() {
    const fNames = fs.readdirSync(this.config.inputDir).filter((f) => f.endsWith(".md"));
    fNames.forEach((fName) => {
      const inFilePath = path.join(this.config.inputDir, fName);
      const outFilePath = path.join(this.config.outputDir, fName);
      try {
        this.convert(inFilePath, outFilePath);
      } catch (e: any) {
        console.error("inFilePath: " + inFilePath);
        console.error("outFilePath: " + outFilePath);
        console.error(e.message);
      }
    });
  }
}
