import { entityAmpersandRe } from '../utils/entityAmpersandRes';

/**
 * Backslash-escape entity ampersand'. To be used when backslash escape
 * is not an option, i.e. in CM autolinks.
 */
export default function entityBackslashReplace() {
  this.replaces.push([entityAmpersandRe, '\\&']);
}
