"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
/**
 * Define the default values for app config.
 */
exports.defaultConfig = {
    toQiita: true,
    srcDir: "",
    dstDir: "",
    srcImageBaseDir: "",
    dstImageBaseDir: "",
    diffFilePath: "diff.txt",
    // The following can be set by the user:
    deleteOn: false,
    imageFormat: "normal",
};
