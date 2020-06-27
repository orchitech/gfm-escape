import mergeOpts from '../utils/mergeOpts';

const DOUBLE_Q = '"';
const SINGLE_Q = '\'';
const PAREN = '()';

const defaultOpts = Object.freeze({
  delimiters: [DOUBLE_Q, SINGLE_Q, PAREN],
  alwaysEscapeDelimiters: [],
});

const LINK_TITLE_DELIMS_RE = /['"()]/g;

const charDelims = {
  '"': DOUBLE_Q,
  '\'': SINGLE_Q,
  '(': PAREN,
  ')': PAREN,
};

const bestDelimiter = (str, opts) => {
  if (!Array.isArray(opts.delimiters)) {
    return opts.delimiters;
  }
  if (opts.delimiters.length === 1) {
    return opts.delimiters[0];
  }
  const m = str.match(LINK_TITLE_DELIMS_RE);
  if (!m) {
    return opts.delimiters[0];
  }
  const e = {};
  e[DOUBLE_Q] = 0;
  e[SINGLE_Q] = 0;
  e[PAREN] = 0;
  m.forEach((c) => {
    e[charDelims[c]] += 1;
  });
  opts.alwaysEscapeDelimiters.forEach((d) => {
    e[DOUBLE_Q] += d === DOUBLE_Q ? 0 : e[d];
    e[SINGLE_Q] += d === SINGLE_Q ? 0 : e[d];
    e[PAREN] += d === PAREN ? 0 : e[d];
  });
  return opts.delimiters.reduce((best, d) => (
    e[d] < e[best] ? d : best
  ));
};

function scanDelimiters(input) {
  const x = this.metadata;
  const opts = this.escape.opts.linkTitle;
  x.delimiter = bestDelimiter(input, opts);
  if (x.delimiter === PAREN) {
    x.startDelimiter = '(';
    x.endDelimiter = ')';
  } else {
    x.startDelimiter = x.delimiter;
    x.endDelimiter = x.delimiter;
  }
  const escaped = {};
  escaped[x.delimiter] = true;
  opts.alwaysEscapeDelimiters.forEach((d) => {
    escaped[d] = true;
  });
  this.linkTitleEscapedDelimiters = escaped;
  return input;
}

function processLinkTitleDelim({ match: [c] }) {
  if (this.linkTitleEscapedDelimiters[charDelims[c]]) {
    return `\\${c}`;
  }
  return c;
}

/**
 * Escape parentheses.
 */
export default function linkTitleReplace() {
  if (!mergeOpts(this.opts, 'linkTitle', defaultOpts, true)) {
    return;
  }
  this.preprocessors.push(scanDelimiters);
  this.replaces.push([LINK_TITLE_DELIMS_RE, processLinkTitleDelim, true]);
}
