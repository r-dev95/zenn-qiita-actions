"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDiffFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const loadDiffFile = (fPath) => {
    try {
        const data = fs_1.default.readFileSync(fPath, "utf-8");
        const lines = data.trim().split("\n");
        return lines.map((line) => {
            const [status, ...fileParts] = line.trim().split(/\s+/);
            const fName = path_1.default.basename(fileParts.join(" "));
            return {
                status,
                fName,
            };
        });
    }
    catch (err) {
        console.warn("Loading change files failed", err);
        throw err;
    }
};
exports.loadDiffFile = loadDiffFile;
