import { AppConfig } from "./types";
import { convertContentsZennToQiita } from "./convertZennToQiita";
import { convertContentsQiitaToZenn } from "./convertQiitaToZenn";

/**
 * Depending on whether it's Zenn -> Qiita or Qiita -> Zenn, you get a function that converts the content.
 *
 * @param config App config.
 * @returns A function that converts the content.
 */
export const getConvertContentsFunc = (config: AppConfig): Array<CallableFunction> => {
  if (config.toQiita) {
    return convertContentsZennToQiita(config);
  } else {
    return convertContentsQiitaToZenn(config);
  }
};
