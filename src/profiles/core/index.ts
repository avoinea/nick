/**
 * Profile configuration and setup.
 */

import blocks from '../../blocks';
import { slate } from '../../blocks/slate/slate';
import { title } from '../../blocks/title/title';

export function init(): void {
  // Register blocks
  blocks.register('title', title);
  blocks.register('slate', slate);
}
