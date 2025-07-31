/**
 * A set of functions to convert markdown from Zenn to Qiita format.
 */

import { AppConfig } from "./types";

/**
 * Convert diff code block.
 *
 * ```diff js -> ```diff_js
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertDiffCodeBlock = (md: string): string => {
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
const convertMarkdownImages = (md: string): string => {
  return (
    md
      // Remove captions after images: `![alt](url)\n*caption*`
      .replace(/(!\[.*?\]\(.*?\))\n\*.*?\*/g, "$1")
      // Remove image size specification: `![alt](url =300x)`
      .replace(/!\[(.*?)\]\((.*?)(?:\s*=\s*\d*x\d*)\)/g, "![$1]($2)")
  );
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
const convertMarkdownImagesToImgTags = (md: string): string => {
  return (
    md
      // Remove captions (e.g., *caption*) after image
      .replace(/(!\[.*?\]\(.*?\))\n\*.*?\*/g, "$1")
      // Convert markdown image to <img>, handling optional size (e.g., =300x)
      .replace(/!\[(.*?)\]\((.*?)(?:\s*=\s*(\d*)x\d*)?\)/g, (_match, alt, url, width) => {
        const widthAttr = width ? ` width="${width}"` : "";
        return `<img src="${url}" alt="${alt}"${widthAttr}>`;
      })
  );
};

/**
 * Convert service link.
 *
 * `@[service](url)` -> `url`
 *
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertServiceLink = (content: string): string => {
  return content.replace(/@\[\w+\]\((.*?)\)/g, "$1");
};

/**
 * Convert custom block.
 * `:::message` -> `:::note info`
 * `:::alert`   -> `:::note alert`
 * @param md Markdown to be converted
 * @returns Converted markdown
 */
const convertCustomBlock = (md: string): string => {
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
const convertAccordion = (md: string): string => {
  return md.replace(/^:::details\s+(.*)\n([\s\S]*?)^:::\s*$/gm, (_match, title, content) => {
    return `<details><summary>${title}</summary>\n${content.trim().replace(/\n/g, "\n\n")}\n</details>\n`;
  });
};

export const convertContentsZennToQiita = (config: AppConfig): Array<CallableFunction> => {
  let funcs = [convertDiffCodeBlock, convertServiceLink, convertCustomBlock, convertAccordion];
  if (config.imageFormat === "tag") {
    funcs.push(convertMarkdownImagesToImgTags);
  } else {
    funcs.push(convertMarkdownImages);
  }
  return funcs;
};

export const convertMetaDataZennToQiita = (data: any): string => {
  const title = `${data.emoji ? data.emoji + " " : ""}${data.title}`;
  let tags = "[]";
  if (data.topics && Array.isArray(data.topics) && data.topics.length > 0) {
    tags = "\n" + data.topics.map((tag: string) => `  - ${tag}`).join("\n");
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
