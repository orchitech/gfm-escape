const BACKTICK_RUN_RE = /(^`*)|(`+(?!.))|`+/;

function processBacktickRun({ match: [m, start, end] }) {
  if (start !== undefined || m.length >= this.metadata.delimiter.length) {
    this.metadata.delimiter = `${m}\``;
  }
  if (start !== undefined) {
    this.metadata.space = start.length > 0 ? ' ' : '';
  }
  if (end && !this.metadata.space) {
    this.metadata.space = ' ';
  }
  return m;
}

/**
 * Escape parentheses <, > and whitespace either as entites or in URL encoding.
 */
export default function codeSpanReplace() {
  this.replacer.addReplacement(BACKTICK_RUN_RE, processBacktickRun, true);
}
