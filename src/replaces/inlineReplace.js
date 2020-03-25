import { entityAmpersandReStr } from '../utils/entityAmpersandRes';

const INLINE_RE = new RegExp([
  '[*_[\\]`<>]',
  '\\\\(?=[-!"#$%&\'()*+,./:;<=>?@\\[\\\\\\]^_`{|}~]|$)',
  entityAmpersandReStr,
].join('|'));
// $1: hard line break marker
const HARD_LINE_BREAK_RE = /([ ]{2})$/;

/**
 * Escape inlines that are necessary to be escaped.
 */
export default function inlineReplace() {
  this.replacer.addReplacement(INLINE_RE, '\\$&');
  this.replacer.addReplacement(HARD_LINE_BREAK_RE, '$1<!-- spaces -->');
}
