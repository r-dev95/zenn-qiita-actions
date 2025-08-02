"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConvertContentsFunc = void 0;
const convertZennToQiita_1 = require("./convertZennToQiita");
const convertQiitaToZenn_1 = require("./convertQiitaToZenn");
/**
 * Depending on whether it's Zenn -> Qiita or Qiita -> Zenn, you get a function that converts the content.
 *
 * @param config App config.
 * @returns A function that converts the content.
 */
const getConvertContentsFunc = (config) => {
    if (config.toQiita) {
        return (0, convertZennToQiita_1.convertContentsZennToQiita)(config);
    }
    else {
        return (0, convertQiitaToZenn_1.convertContentsQiitaToZenn)(config);
    }
};
exports.getConvertContentsFunc = getConvertContentsFunc;
