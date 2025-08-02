import fs from "fs";
import path from "path";

/**
 * Loads a file with a list of files that have changed since the last push.
 *
 * @param fPath File path.
 * @returns Changed file list.
 */
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
