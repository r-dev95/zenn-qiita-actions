import path from "path";

import { loadAppConfig, logAppConfig } from "./lib/configLoader";
import { Converter } from "./lib/converter";

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

  const _zennImageBaseDir = path.join(path.normalize(path.dirname(zennDir)), "images");
  const _qiitaImageBaseDir = path.join(path.normalize(path.dirname(qiitaDir)), "images");

  const config = loadAppConfig(configFilePath);
  console.log(toQiitaFlag);
  console.log(typeof toQiitaFlag);
  config.toQiita = toQiitaFlag === "true";
  config.srcDir = config.toQiita ? zennDir : qiitaDir;
  config.dstDir = config.toQiita ? qiitaDir : zennDir;
  config.srcImageBaseDir = config.toQiita ? _zennImageBaseDir : _qiitaImageBaseDir;
  config.dstImageBaseDir = config.toQiita ? _qiitaImageBaseDir : _zennImageBaseDir;
  logAppConfig(config);

  const converter = new Converter(config);
  converter.run();
})();
