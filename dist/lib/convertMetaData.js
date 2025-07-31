"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConvertMetaDataFunc = void 0;
const convertZennToQiita_1 = require("./convertZennToQiita");
const convertQiitaToZenn_1 = require("./convertQiitaToZenn");
const getConvertMetaDataFunc = (config) => {
    if (config.toQiita) {
        return convertZennToQiita_1.convertMetaDataZennToQiita;
    }
    else {
        return convertQiitaToZenn_1.convertMetaDataQiitaToZenn;
    }
};
exports.getConvertMetaDataFunc = getConvertMetaDataFunc;
