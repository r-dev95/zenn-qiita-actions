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
     * - If the destination file exists, it will be given the same ID.
     *
     * @param newData Metadata to be updated.
     * @param dstFilePath Destination file path.
     * @returns Updated metadata.
     */
    updateId(newData, dstFilePath) {
        if (this.config.toQiita && fs_1.default.existsSync(dstFilePath)) {
            const raw = fs_1.default.readFileSync(dstFilePath, "utf-8");
            const { data, content } = (0, gray_matter_1.default)(raw);
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
    convert(srcFilePath, dstFilePath) {
        const raw = fs_1.default.readFileSync(srcFilePath, "utf-8");
        const { data, content } = (0, gray_matter_1.default)(raw);
        // convert metadata.
        let newData = this.convertMetaData(data);
        // update id.
        newData = this.updateId(newData, dstFilePath);
        // convert content.
        const newContent = this.convertContents(content);
        fs_1.default.writeFileSync(dstFilePath, `${newData}${newContent}`);
    }
    /**
     * Copy the images from the source directory to the destination directory.
     *
     * @param srcDirPath Source image directory path.
     * @param dstDirPath Destination image directory path.
     */
    copyImage(srcDirPath, dstDirPath) {
        if (fs_1.default.existsSync(srcDirPath)) {
            fs_1.default.mkdirSync(dstDirPath, { recursive: true });
            fs_1.default.globSync(path_1.default.join(srcDirPath, "*.*")).forEach((file) => {
                fs_1.default.copyFileSync(file, path_1.default.join(dstDirPath, path_1.default.basename(file)));
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
    delete(srcFilePath, dstFilePath) {
        if (!fs_1.default.existsSync(srcFilePath) && fs_1.default.existsSync(dstFilePath)) {
            fs_1.default.rmSync(dstFilePath);
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
    deleteImage(srcDirPath, dstDirPath) {
        if (!fs_1.default.existsSync(srcDirPath) && fs_1.default.existsSync(dstDirPath)) {
            fs_1.default.rmSync(dstDirPath, { recursive: true });
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
            const _fName = path_1.default.basename(file.fName).split(".")[0];
            const srcFilePath = path_1.default.join(this.config.srcDir, file.fName);
            const dstFilePath = path_1.default.join(this.config.dstDir, file.fName);
            const srcImageDirPath = path_1.default.join(this.config.srcImageBaseDir, _fName);
            const dstImageDirPath = path_1.default.join(this.config.dstImageBaseDir, _fName);
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
                        console.error("❌ [Failure] - Processing when the status is " + file.status + " is not implemented.");
                        break;
                }
            }
            catch (err) {
                console.error("❌ [Failure] - " + srcFilePath + " / " + dstFilePath);
                console.error(err.message);
            }
        });
    }
}
exports.Converter = Converter;
