import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { convertZennToQiita } from "./lib/convert_zenn_to_qiita";

function convertMetaData(metaData: any): string {
  metaData.title = `${metaData.emoji ? metaData.emoji + " " : ""}${metaData.title}`;
  if (metaData.topics) {
    metaData.topics = "\n  - " + metaData.topics.join("\n  - ");
  } else {
    metaData.topics = [];
  }
  metaData.published = metaData.published === false;
  return [
    "---",
    `title: ${metaData.title}`,
    `tags: ${metaData.topics}`,
    `private: ${metaData.published}`,
    `updated_at: ""`,
    `id: null`,
    `organization_url_name: null`,
    `slide: false`,
    `ignorePublish: false`,
    "---",
    "",
  ].join("\n");
}

function convert(inFilePath: string, outFilePath: string) {
  const raw = fs.readFileSync(inFilePath, "utf-8");
  const { data, content } = matter(raw);
  // convert meta data.
  let newData = convertMetaData(data);
  // convert content.
  console.log(content);
  const newContent = convertZennToQiita(content);
  // update id.
  if (fs.existsSync(outFilePath)) {
    const raw = fs.readFileSync(outFilePath, "utf-8");
    const { data, content } = matter(raw);
    newData = newData.replace("id: null", `id: ${data.id}`);
  }
  fs.writeFileSync(outFilePath, `${newData}${newContent}`);
}

(async () => {
  const [, , inputDir, outputDir] = process.argv;
  if (!inputDir || !outputDir) {
    console.error("Usage: node index.js <inputDir> <outputDir>");
    process.exit(1);
  }

  const fNames = fs.readdirSync(inputDir).filter((f) => f.endsWith(".md"));
  fNames.forEach((fName) => {
    const inFilePath = path.join(inputDir, fName);
    const outFilePath = path.join(outputDir, fName);
    try {
      convert(inFilePath, outFilePath);
    } catch (e: any) {
      console.log("inFilePath: " + inFilePath);
      console.log("outFilePath: " + outFilePath);
      console.log(e.message);
    }
  });
})();
