"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configLoader_1 = require("./lib/configLoader");
const converter_1 = require("./lib/converter");
(async () => {
    const [, , toQiitaFlag, inputDir, outputDir, configFilePath] = process.argv;
    if (!toQiitaFlag || !inputDir || !outputDir || !configFilePath) {
        console.error("Usage: node index.js <toQiitaFlag> <inputDir> <outputDir>");
        console.error("- <toQiitaFlag>: 0: Zenn -> Qiita, otherwise: Qiita -> Zenn");
        console.error("- <inputDir>: Source directory");
        console.error("- <outputDir>: Destination directory");
        console.error("- <configFilePath>: Config file path");
        process.exit(1);
    }
    const config = (0, configLoader_1.loadAppConfig)(configFilePath);
    config.toQiita = Number(toQiitaFlag) === 0;
    config.inputDir = inputDir;
    config.outputDir = outputDir;
    (0, configLoader_1.logAppConfig)(config);
    const converter = new converter_1.Converter(config);
    converter.run();
})();
