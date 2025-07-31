"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAppConfig = void 0;
exports.loadAppConfig = loadAppConfig;
const fs = __importStar(require("fs"));
const types_1 = require("./types");
function validate(data) {
    const result = {};
    result.toQiita = typeof data.toQiita === "boolean" ? data.toQiita : types_1.defaultConfig.toQiita;
    result.imageFormat = typeof data.imageFormat === "string" ? data.imageFormat : types_1.defaultConfig.imageFormat;
    return result;
}
function loadAppConfig(fPath) {
    let data;
    try {
        const contents = fs.readFileSync(fPath, "utf-8");
        data = JSON.parse(contents);
    }
    catch (err) {
        console.warn("Loading failed, using default config.", err);
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
