import { AppConfig } from "./types";
import { convertMetaDataZennToQiita } from "./convertZennToQiita";
import { convertMetaDataQiitaToZenn } from "./convertQiitaToZenn";

/**
 * Depending on whether it's Zenn -> Qiita or Qiita -> Zenn, you get a function that converts the metadata.
 *
 * @param config App config.
 * @returns A function that converts the metadata.
 */
export const getConvertMetaDataFunc = (config: AppConfig): CallableFunction => {
  if (config.toQiita) {
    return convertMetaDataZennToQiita;
  } else {
    return convertMetaDataQiitaToZenn;
  }
};
