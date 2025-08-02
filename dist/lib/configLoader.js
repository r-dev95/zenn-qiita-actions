"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAppConfig = void 0;
exports.loadAppConfig = loadAppConfig;
const fs_1 = __importDefault(require("fs"));
const types_1 = require("./types");
/**
 * Complements user-configurable values in the app config.
 *
 * @param data config.
 * @returns App config.
 */
function complementUserConfig(data) {
    const res = types_1.defaultConfig;
    if (typeof data.deleteOn === "boolean")
        res.deleteOn = data.deleteOn;
    if (typeof data.imageFormat === "string")
        res.imageFormat = data.imageFormat;
    return res;
}
/**
 * Load the app config.
 *
 * @param fPath File path.
 * @returns App config.
 */
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
    return complementUserConfig(data);
}
/**
 * Log output app config.
 */
const logAppConfig = (config) => {
    const maxKeyLen = Math.max(...Object.keys(config).map((k) => k.length)) + 1;
    console.log("--------------------------------------------------");
    console.log("App config:");
    console.log("--------------------------------------------------");
    Object.entries(config).forEach((values, num) => {
        console.log(values[0].padEnd(maxKeyLen, " ") + ": " + values[1]);
    });
    console.log("--------------------------------------------------");
};
exports.logAppConfig = logAppConfig;
