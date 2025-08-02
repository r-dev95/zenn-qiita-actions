"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
const fs_1 = __importDefault(require("fs"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const path_1 = __importDefault(require("path"));
const diffFileLoader_1 = require("./diffFileLoader");
const convertMetaData_1 = require("./convertMetaData");
const convertContents_1 = require("./convertContents");
/**
 * Markdown converter.
 */
class Converter {
    /**
     * Initializes a new instance of this class.
     *
     * @param config The app config.
     */
    constructor(config) {
        this.config = config;
        this.convertMetaDataFunc = (0, convertMetaData_1.getConvertMetaDataFunc)(config);
        this.convertContentsFunc = (0, convertContents_1.getConvertContentsFunc)(config);
    }
    /**
     * Converts markdown metadata (front matter).
     *
     * @param data Metadata to be converted.
     * @returns Converted metadata.
     */
    convertMetaData(data) {
        return this.convertMetaDataFunc(data);
    }
    /**
     * Converts markdown content.
     *
     * @param md Content to be converted.
     * @returns Converted content.
     */
    convertContents(md) {
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
    updateId(newData, outFilePath) {
        if (this.config.toQiita && fs_1.default.existsSync(outFilePath)) {
            const raw = fs_1.default.readFileSync(outFilePath, "utf-8");
            const { data, content } = (0, gray_matter_1.default)(raw);
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
    convert(inFilePath, outFilePath) {
        const raw = fs_1.default.readFileSync(inFilePath, "utf-8");
        const { data, content } = (0, gray_matter_1.default)(raw);
        // convert meta data.
        let newData = this.convertMetaData(data);
        // update id.
        newData = this.updateId(newData, outFilePath);
        // convert content.
        const newContent = this.convertContents(content);
        fs_1.default.writeFileSync(outFilePath, `${newData}${newContent}`);
    }
    /**
     * Delete any existing output files.
     *
     * - If the input file does not exist and the output file does exist, delete it.
     *
     * @param inFilePath Input file path.
     * @param outFilePath Output file path.
     */
    delete(inFilePath, outFilePath) {
        if (!fs_1.default.existsSync(inFilePath) && fs_1.default.existsSync(outFilePath)) {
            fs_1.default.rmSync(outFilePath);
        }
    }
    /**
     * Run the conversion process.
     *
     * - It will only process markdown files that have changed since the last push.
     */
    run() {
        const changeFiles = (0, diffFileLoader_1.loadDiffFile)(this.config.diffFilePath);
        changeFiles.forEach((file) => {
            const inFilePath = path_1.default.join(this.config.inputDir, file.fName);
            const outFilePath = path_1.default.join(this.config.outputDir, file.fName);
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
                        console.error("❌ [Failure] - Processing when the status is " + file.status + " is not implemented.");
                        break;
                }
            }
            catch (err) {
                console.error("❌ [Failure] - " + inFilePath + " / " + outFilePath);
                console.error(err.message);
            }
        });
    }
}
exports.Converter = Converter;
