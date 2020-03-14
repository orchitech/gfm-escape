import { entityAmpersandReStr } from '../utils/entityAmpersandRes';

const INLINE_RE = new RegExp([
  '[*_[\\]`<>]',
  '\\\\(?=[-!"#$%&\'()*+,./:;<=>?@\\[\\\\\\]^_`{|}~]|$)',
  entityAmpersandReStr,
].join('|'));

/**
 * Escape inlines that are necessary to be escaped.
 */
export default function inlineReplace() {
  this.replacer.addReplacement(INLINE_RE, '\\$&');
}
