"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAppConfig = void 0;
exports.loadAppConfig = loadAppConfig;
const fs_1 = __importDefault(require("fs"));
const types_1 = require("./types");
function validate(data) {
    const res = {};
    res.toQiita = typeof data.toQiita === "boolean" ? data.toQiita : types_1.defaultConfig.toQiita;
    res.inputDir = typeof data.inputDir === "string" ? data.inputDir : types_1.defaultConfig.inputDir;
    res.outputDir = typeof data.outputDir === "string" ? data.outputDir : types_1.defaultConfig.outputDir;
    res.diffFilePath = typeof data.diffFilePath === "string" ? data.diffFilePath : types_1.defaultConfig.diffFilePath;
    // The following can be set by the user:
    res.deleteOn = typeof data.deleteOn === "boolean" ? data.deleteOn : types_1.defaultConfig.deleteOn;
    res.imageFormat = typeof data.imageFormat === "string" ? data.imageFormat : types_1.defaultConfig.imageFormat;
    return res;
}
function loadAppConfig(fPath) {
    let data;
    try {
        const contents = fs_1.default.readFileSync(fPath, "utf-8");
        data = JSON.parse(contents);
    }
    catch (err) {
        console.warn("Loading app config failed, using default config.", err);
        return types_1.defaultConfig;
    }
    return validate(data);
}
/**
 * Log output app config.
 */
const logAppConfig = (config) => {
    console.log("--------------------------------------------------");
    console.log("App config:");
    console.log("config.toQiita = " + config.toQiita);
    console.log("config.inputDir = " + config.inputDir);
    console.log("config.outputDir = " + config.outputDir);
    console.log("config.imageFormat = " + config.imageFormat);
    console.log("--------------------------------------------------");
};
exports.logAppConfig = logAppConfig;
