const longestBacktickString = (str) => {
  const m = str.match(/`+/g);
  return m
    ? m.reduce((longest, current) => (
      current.length > longest.length ? current : longest
    ), '')
    : '';
};

const SHOULD_ADD_SPACE_RE = /^`|^[ \r\n].*?[^ \r\n].*[ \r\n]$|`$/;

function scanDelimiters(input) {
  const x = this.metadata;
  x.extraBacktickString = longestBacktickString(input);
  x.extraSpace = SHOULD_ADD_SPACE_RE.test(input) ? ' ' : '';
  return input;
}

function addDelimiterExtras(output) {
  const x = this.metadata;
  const before = x.extraBacktickString + x.extraSpace;
  const after = x.extraSpace + x.extraBacktickString;
  return `${before}${output}${after}`;
}

/**
 * Adjust leading and trailing code span part according to contets and
 * set metadata.
 */
export default function codeSpanReplace() {
  this.preprocessors.push(scanDelimiters);
  this.postprocessors.unshift(addDelimiterExtras);
}
