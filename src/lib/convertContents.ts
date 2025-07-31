import { AppConfig } from "./types";
import { convertContentsZennToQiita } from "./convertZennToQiita";
import { convertContentsQiitaToZenn } from "./convertQiitaToZenn";

export const getConvertContentsFunc = (config: AppConfig): Array<CallableFunction> => {
  if (config.toQiita) {
    return convertContentsZennToQiita(config);
  } else {
    return convertContentsQiitaToZenn(config);
  }
};
