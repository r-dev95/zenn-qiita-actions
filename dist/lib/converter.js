"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
const fs_1 = __importDefault(require("fs"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const path_1 = __importDefault(require("path"));
const convertMetaData_1 = require("./convertMetaData");
const convertContents_1 = require("./convertContents");
class Converter {
    constructor(config) {
        this.config = config;
        this.convertContentsFunc = (0, convertContents_1.getConvertContentsFunc)(config);
        this.convertMetaDataFunc = (0, convertMetaData_1.getConvertMetaDataFunc)(config);
    }
    convertMetaData(md) {
        return this.convertMetaDataFunc(md);
    }
    convertContents(md) {
        return this.convertContentsFunc.reduce((acc, fn) => fn(acc), md);
    }
    convert(inFilePath, outFilePath) {
        const raw = fs_1.default.readFileSync(inFilePath, "utf-8");
        const { data, content } = (0, gray_matter_1.default)(raw);
        // convert meta data.
        let newData = this.convertMetaData(data);
        // convert content.
        const newContent = this.convertContents(content);
        // update id.
        if (fs_1.default.existsSync(outFilePath)) {
            const raw = fs_1.default.readFileSync(outFilePath, "utf-8");
            const { data, content } = (0, gray_matter_1.default)(raw);
            newData = newData.replace("id: null", `id: ${data.id}`);
        }
        fs_1.default.writeFileSync(outFilePath, `${newData}${newContent}`);
    }
    run() {
        const fNames = fs_1.default.readdirSync(this.config.inputDir).filter((f) => f.endsWith(".md"));
        fNames.forEach((fName) => {
            const inFilePath = path_1.default.join(this.config.inputDir, fName);
            const outFilePath = path_1.default.join(this.config.outputDir, fName);
            try {
                this.convert(inFilePath, outFilePath);
            }
            catch (e) {
                console.error("inFilePath: " + inFilePath);
                console.error("outFilePath: " + outFilePath);
                console.error(e.message);
            }
        });
    }
}
exports.Converter = Converter;
