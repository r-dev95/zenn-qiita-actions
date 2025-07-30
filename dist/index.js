"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const path_1 = __importDefault(require("path"));
const convert_zenn_to_qiita_1 = require("./lib/convert_zenn_to_qiita");
function convertMetaData(metaData) {
    metaData.title = `${metaData.emoji ? metaData.emoji + " " : ""}${metaData.title}`;
    if (metaData.topics) {
        metaData.topics = "\n  - " + metaData.topics.join("\n  - ");
    }
    else {
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
function convert(inFilePath, outFilePath) {
    const raw = fs_1.default.readFileSync(inFilePath, "utf-8");
    const { data, content } = (0, gray_matter_1.default)(raw);
    // convert meta data.
    let newData = convertMetaData(data);
    // convert content.
    console.log(content);
    const newContent = (0, convert_zenn_to_qiita_1.convertZennToQiita)(content);
    // update id.
    if (fs_1.default.existsSync(outFilePath)) {
        const raw = fs_1.default.readFileSync(outFilePath, "utf-8");
        const { data, content } = (0, gray_matter_1.default)(raw);
        newData = newData.replace("id: null", `id: ${data.id}`);
    }
    fs_1.default.writeFileSync(outFilePath, `${newData}${newContent}`);
}
(async () => {
    const [, , inputDir, outputDir] = process.argv;
    if (!inputDir || !outputDir) {
        console.error("Usage: node index.js <inputDir> <outputDir>");
        process.exit(1);
    }
    const fNames = fs_1.default.readdirSync(inputDir).filter((f) => f.endsWith(".md"));
    fNames.forEach((fName) => {
        const inFilePath = path_1.default.join(inputDir, fName);
        const outFilePath = path_1.default.join(outputDir, fName);
        try {
            convert(inFilePath, outFilePath);
        }
        catch (e) {
            console.log("inFilePath: " + inFilePath);
            console.log("outFilePath: " + outFilePath);
            console.log(e.message);
        }
    });
})();
