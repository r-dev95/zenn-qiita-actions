"use strict";
/**
 * A set of functions to convert markdown from Zenn to Qiita format.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMetaDataZennToQiita = exports.convertContentsZennToQiita = void 0;
/**
 * Convert diff code block.
 *
 * - ` ```diff js` -> ` ```diff_js`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertDiffCodeBlock = (md) => {
    return md.replace(/```diff\s/g, "```diff_");
};
/**
 * Remove image captions and sizes and convert urls.
 *
 * - `![alt](url)\n*caption*` -> `![alt](url)`
 * - `![alt](url =300x)`     -> `![alt](url)`
 * - url: `/image/slug-name/xxx.png` -> `../image/slug-name/xxx.png`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertImgLink = (md) => {
    return (md
        // remove image captions
        .replace(/(!\[.*?\]\(.*?\))\n\*.*?\*/g, "$1")
        // remove image size
        .replace(/!\[(.*?)\]\((.*?)(?:\s*=\s*\d*x\d*)\)/g, "![$1]($2)")
        // convert url
        .replace(/(!\[.*?\])\(\s*(\/image\/[^\s)]+)\s*\)/g, (_match, alt, path) => {
        return `${alt}(${path.replace(/^\/images\//, "../images/")})`;
    }));
};
/**
 * Convert image link to HTML \<img> tag and convert urls.
 *
 * - `![alt](url)` -> `<img src="url" alt="alt">`
 * - `![alt](url)\n*caption*` -> `<img src="url" alt="alt">`
 * - `![alt](url =300x)` -> `<img src="url" alt="alt" width="300">`
 * - url: `/image/slug-name/xxx.png` -> `../image/slug-name/xxx.png`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertImgLinkToTag = (md) => {
    return (md
        // remove image captions
        .replace(/(!\[.*?\]\(.*?\))\n\*.*?\*/g, "$1")
        // convert to <img> tag and convert url
        .replace(/!\[(.*?)\]\((.*?)(?:\s*=\s*(\d*)x\d*)?\)/g, (_match, alt, url, width) => {
        url = url.replace(/^\/images\//, "../images/");
        width = width ? ` width="${width}"` : "";
        return `<img src="${url}" alt="${alt}"${width}>`;
    }));
};
/**
 * Convert embedded link to simple URL.
 *
 * - `@[service](url)` -> `url`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertEmbeddedLink = (md) => {
    return md.replace(/@\[\w+\]\((.*?)\)/g, "$1");
};
/**
 * Convert custom block.
 *
 * - `:::message` -> `:::note info`
 * - `:::alert`   -> `:::note alert`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertCustomBlock = (md) => {
    let newContent = md.replace(/:::message alert/g, ":::note alert");
    newContent = newContent.replace(/:::message/g, ":::note info");
    return newContent;
};
/**
 * Convert accordion.
 *
 * - `:::details title\ncontent\n:::` -> `<details><summary>title</summary>content</details>`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertAccordion = (md) => {
    return md.replace(/^:::details\s+(.*)\n([\s\S]*?)^:::\s*$/gm, (_match, title, content) => {
        return `<details><summary>${title}</summary>\n${content.trim().replace(/\n/g, "\n\n")}\n</details>\n`;
    });
};
/**
 * Set the conversion function.
 *
 * @param config App config.
 * @returns A list of conversion functions.
 */
const convertContentsZennToQiita = (config) => {
    let funcs = [convertDiffCodeBlock, convertEmbeddedLink, convertCustomBlock, convertAccordion];
    if (config.imageFormat === "tag") {
        funcs.push(convertImgLinkToTag);
    }
    else {
        funcs.push(convertImgLink);
    }
    return funcs;
};
exports.convertContentsZennToQiita = convertContentsZennToQiita;
/**
 * Convert markdown metadata in Zenn format to Qiita format.
 *
 * @param data Metadata to be converted.
 * @returns Converted metadata.
 */
const convertMetaDataZennToQiita = (data) => {
    const title = `${data.emoji ? data.emoji + " " : ""}${data.title}`;
    let tags = "[]";
    if (data.topics && Array.isArray(data.topics) && data.topics.length > 0) {
        tags = "\n" + data.topics.map((tag) => `  - ${tag}`).join("\n");
    }
    const privateFlag = data.published === false;
    return [
        "---",
        `title: ${title}`,
        `tags: ${tags}`,
        `private: ${privateFlag}`,
        `updated_at: ""`,
        `id: null`,
        `organization_url_name: null`,
        `slide: false`,
        `ignorePublish: false`,
        "---",
        "",
    ].join("\n");
};
exports.convertMetaDataZennToQiita = convertMetaDataZennToQiita;
