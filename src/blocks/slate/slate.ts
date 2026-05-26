/**
 * Slate block.
 * @module blocks/slate/slate
 */

// Internal imports
import { slateToMarkdown } from '../../helpers/markdown/markdown';

export const slate = {
  /**
   * Convert to markdown.
   * @param self The block instance.
   * @param document The document instance.
   * @returns The markdown string.
   */
  toMarkdown: (self: any, _document: any) => {
    return slateToMarkdown(self.value);
  },
};
