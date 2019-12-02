const BACKSLASH_BLOCK_RE = new RegExp([
  // thematic code block or `-` setext heading
  '^([-*_])[ \\t]*(?:\\1[ \\t]*){2,}$',
  // `=` setext heading
  '^=+[ \\t]*$',
  // list item or ATX heading
  '^(?:[-+*]|#{1,6})(?=\\s|$)',
  // `~` fenced code block (the rest is left for inline tilde escaping)
  '^~(?=~~)',
].join('|'));

// $1: number
const ORDERED_LIST_RE = /^(\d+)\.(?=\s|$)/;

/**
 * Escape block syntax.
 */
export default function blockReplace() {
  this.replacer.addReplacement(BACKSLASH_BLOCK_RE, '\\$&');
  this.replacer.addReplacement(ORDERED_LIST_RE, '$1\\.');
}
