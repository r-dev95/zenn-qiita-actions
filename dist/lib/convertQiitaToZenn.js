"use strict";
/**
 * A set of functions to convert markdown from Qiita to Zenn format.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMetaDataQiitaToZenn = exports.convertContentsQiitaToZenn = void 0;
/**
 * Convert diff code block.
 *
 * ```diff_js -> ```diff js
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertDiffCodeBlock = (md) => {
    return md.replace("```diff_", "```diff ");
};
/**
 * Convert HTML <img> tags to Markdown image syntax.
 *
 * Handles:
 * - <img src="url" alt="alt" width="300"> → ![alt](url =300x)
 *
 * @param html HTML string
 * @returns Markdown-converted string
 */
const convertImgTagsToMarkdownImages = (html) => {
    return html.replace(/<img\s+([^>]*?)\/?>/g, (_match, attrs) => {
        const srcMatch = attrs.match(/src=["'](.*?)["']/);
        const altMatch = attrs.match(/alt=["'](.*?)["']/);
        const widthMatch = attrs.match(/width=["'](\d+)["']/);
        const src = srcMatch?.[1] || "";
        const alt = altMatch?.[1] || "";
        const width = widthMatch?.[1] || "";
        const sizeSuffix = width ? ` =${width}x` : "";
        return `![${alt}](${src}${sizeSuffix})`;
    });
};
/**
 * Convert Qiita-style custom block to Zenn-style.
 *
 * - `:::note info` -> `:::message`
 * - `:::note warn` -> `:::message alert`
 * - `:::note alert` -> `:::message alert`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertCustomBlockToZenn = (md) => {
    let newContent = md.replace(/:::note alert/g, ":::message alert");
    newContent = newContent.replace(/:::note warn/g, ":::message alert");
    newContent = newContent.replace(/:::note info/g, ":::message");
    return newContent;
};
/**
 * Convert HTML <details> accordion to Zenn-style block.
 *
 * `<details><summary>title</summary>content</details>` -> `:::details title\ncontent\n:::`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertAccordionToZenn = (md) => {
    return md.replace(/<details>\s*<summary>(.*?)<\/summary>\s*([\s\S]*?)<\/details>/g, (_match, title, content) => {
        const body = content.trim().replace(/\n{2,}/g, "\n"); // normalize newlines
        return `:::details ${title}\n${body}\n:::`;
    });
};
const convertContentsQiitaToZenn = (config) => {
    let funcs = [
        convertDiffCodeBlock,
        convertImgTagsToMarkdownImages,
        convertCustomBlockToZenn,
        convertAccordionToZenn,
    ];
    return funcs;
};
exports.convertContentsQiitaToZenn = convertContentsQiitaToZenn;
const convertMetaDataQiitaToZenn = (data) => {
    const emojiMatch = data.title.match(/^([\p{Emoji_Presentation}\p{Extended_Pictographic}])\s+(.*)/u);
    const emoji = emojiMatch ? emojiMatch[1] : "";
    const title = emojiMatch ? emojiMatch[2] : data.title;
    let topics = "[]";
    if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
        topics = "\n" + data.tags.map((tag) => `  - ${tag}`).join("\n");
    }
    const published = data.private === false;
    return [
        "---",
        `title: ${title}`,
        `emoji: ${emoji}`,
        "type: 'tech'",
        `published: ${published}`,
        `topics: ${topics}`,
        "---",
        "",
    ].join("\n");
};
exports.convertMetaDataQiitaToZenn = convertMetaDataQiitaToZenn;
