/**
 * Title block.
 * @module blocks/title/title
 */

export const title = {
  /**
   * Convert to markdown.
   * @param self The block instance.
   * @param document The document instance.
   * @returns The markdown string.
   */
  toMarkdown: (_self: any, document: any) => {
    return `# ${document.json.title}\n\n`;
  },
};
