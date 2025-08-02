"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const configLoader_1 = require("./lib/configLoader");
const converter_1 = require("./lib/converter");
(async () => {
    const [, , toQiitaFlag, zennDir, qiitaDir, configFilePath] = process.argv;
    if (!toQiitaFlag || !zennDir || !qiitaDir || !configFilePath) {
        console.error("Usage: node index.js <toQiitaFlag> <zennDir> <qiitaDir>");
        console.error("- <toQiitaFlag>: true: Zenn -> Qiita, otherwise: Qiita -> Zenn");
        console.error("- <zennDir>: Zenn directory");
        console.error("- <qiitaDir>: Qiita directory");
        console.error("- <configFilePath>: Config file path");
        process.exit(1);
    }
    const _zennImageBaseDir = path_1.default.join(path_1.default.normalize(path_1.default.dirname(zennDir)), "images");
    const _qiitaImageBaseDir = path_1.default.join(path_1.default.normalize(path_1.default.dirname(qiitaDir)), "images");
    const config = (0, configLoader_1.loadAppConfig)(configFilePath);
    console.log(toQiitaFlag);
    console.log(typeof toQiitaFlag);
    config.toQiita = toQiitaFlag === "true";
    config.srcDir = config.toQiita ? zennDir : qiitaDir;
    config.dstDir = config.toQiita ? qiitaDir : zennDir;
    config.srcImageBaseDir = config.toQiita ? _zennImageBaseDir : _qiitaImageBaseDir;
    config.dstImageBaseDir = config.toQiita ? _qiitaImageBaseDir : _zennImageBaseDir;
    (0, configLoader_1.logAppConfig)(config);
    const converter = new converter_1.Converter(config);
    converter.run();
})();
