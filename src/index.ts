import { loadAppConfig, logAppConfig } from "./lib/configLoader";
import { Converter } from "./lib/converter";

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

  const config = loadAppConfig(configFilePath);
  config.toQiita = Number(toQiitaFlag) === 0;
  config.inputDir = inputDir;
  config.outputDir = outputDir;
  logAppConfig(config);

  const converter = new Converter(config);
  converter.run();
})();
