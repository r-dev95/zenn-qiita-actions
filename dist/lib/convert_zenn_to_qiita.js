"use strict";
/**
 * A set of functions to convert markdown from Zenn to Qiita format.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertZennToQiita = void 0;
/**
 * Convert diff code block.
 *
 * ```diff js -> ```diff_js
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertDiffCodeBlock = (md) => {
    return md.replace(/```diff\s/g, "```diff_");
};
/**
 * Remove image captions and size from Markdown image syntax.
 *
 * - `![alt](url)\n*caption*` -> `![alt](url)`
 * - `![alt](url =300x)`     -> `![alt](url)`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertMarkdownImages = (md) => {
    return (md
        // Remove captions after images: `![alt](url)\n*caption*`
        .replace(/(!\[.*?\]\(.*?\))\n\*.*?\*/g, "$1")
        // Remove image size specification: `![alt](url =300x)`
        .replace(/!\[(.*?)\]\((.*?)(?:\s*=\s*\d*x\d*)\)/g, "![$1]($2)"));
};
/**
 * Convert markdown images (with optional size or caption) to HTML <img> tags.
 *
 * Handles:
 * - `![alt](url)`
 * - `![alt](url =300x)`
 * - `![alt](url)\n*caption*`
 *
 * @param md Markdown text
 * @returns HTML-converted string
 */
const convertMarkdownImagesToImgTags = (md) => {
    return (md
        // Remove captions (e.g., *caption*) after image
        .replace(/(!\[.*?\]\(.*?\))\n\*.*?\*/g, "$1")
        // Convert markdown image to <img>, handling optional size (e.g., =300x)
        .replace(/!\[(.*?)\]\((.*?)(?:\s*=\s*(\d*)x\d*)?\)/g, (_match, alt, url, width) => {
        const widthAttr = width ? ` width="${width}"` : "";
        return `<img src="${url}" alt="${alt}"${widthAttr}>`;
    }));
};
/**
 * Convert service link.
 *
 * `@[service](url)` -> `url`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertServiceLink = (content) => {
    return content.replace(/@\[\w+\]\((.*?)\)/g, "$1");
};
/**
 * Convert custom block.
 * `:::message` -> `:::note info`
 * `:::alert`   -> `:::note alert`
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
 * `:::details title\ncontent\n:::` -> `<details><summary>title</summary>content</details>`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertAccordion = (md) => {
    return md.replace(/^:::details\s+(.*)\n([\s\S]*?)^:::\s*$/gm, (_match, title, content) => {
        console.log(" = " + content);
        return `<details><summary>${title}</summary>\n${content
            .trim()
            .replace(/\n/g, "\n\n")}\n</details>\n`;
    });
};
/**
 * Convert markdown from Zenn to Qiita format.
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertZennToQiita = (md) => {
    return [
        convertDiffCodeBlock,
        // convertMarkdownImages,
        convertMarkdownImagesToImgTags,
        convertServiceLink,
        convertCustomBlock,
        convertAccordion,
    ].reduce((acc, fn) => fn(acc), md);
};
exports.convertZennToQiita = convertZennToQiita;
