"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConvertContentsFunc = void 0;
const convertZennToQiita_1 = require("./convertZennToQiita");
const convertQiitaToZenn_1 = require("./convertQiitaToZenn");
const getConvertContentsFunc = (config) => {
    if (config.toQiita) {
        return (0, convertZennToQiita_1.convertContentsZennToQiita)(config);
    }
    else {
        return (0, convertQiitaToZenn_1.convertContentsQiitaToZenn)(config);
    }
};
exports.getConvertContentsFunc = getConvertContentsFunc;
