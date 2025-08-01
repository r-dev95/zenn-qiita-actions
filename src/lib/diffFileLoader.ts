import fs from "fs";
import path from "path";

export const loadDiffFile = (fPath: string) => {
  try {
    const data = fs.readFileSync(fPath, "utf-8");
    const lines = data.trim().split("\n");
    return lines.map((line) => {
      const [status, ...fileParts] = line.trim().split(/\s+/);
      const fName = path.basename(fileParts.join(" "));
      return {
        status,
        fName,
      };
    });
  } catch (err) {
    console.warn("Loading change files failed", err);
    throw err;
  }
};
