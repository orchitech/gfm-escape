import { entityAmpersandRe } from '../utils/entityAmpersandRes';

/**
 * Escape entity ampersand with '&amp;'. To be used when backslash escape
 * is not an option, i.e. in CM autolinks. But also for link destinations,
 * see cmark_gfm-005.
 */
export default function entityEntityReplace() {
  this.replacer.addReplacement(entityAmpersandRe, '&amp;');
}
