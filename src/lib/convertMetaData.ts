import { AppConfig } from "./types";
import { convertMetaDataZennToQiita } from "./convertZennToQiita";
import { convertMetaDataQiitaToZenn } from "./convertQiitaToZenn";

export const getConvertMetaDataFunc = (config: AppConfig): CallableFunction => {
  if (config.toQiita) {
    return convertMetaDataZennToQiita;
  } else {
    return convertMetaDataQiitaToZenn;
  }
};
