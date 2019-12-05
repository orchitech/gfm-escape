const GfmEscape = require('../dist/gfm-escape.cjs');

const mdEscaper = new GfmEscape({
  table: true,
  strikethrough: true,
}, GfmEscape.Syntax.codeSpan);

describe('code span syntax', () => {
  it('returns one backtick if there is no backtick', () => {
    const metadata = {};
    expect(mdEscaper.escape('some thing', {}, metadata)).toBe('some thing');
    expect(metadata.extraBacktickString).toBe('');
    expect(metadata.extraSpace).toBe('');
  });
  it('returns one more backtick than the longest backtick run in text', () => {
    const metadata = {};
    expect(mdEscaper.escape('``some `thing', {}, metadata)).toBe('`` ``some `thing ``');
    expect(metadata.extraBacktickString).toBe('``');
    expect(metadata.extraSpace).toBe(' ');
    expect(mdEscaper.escape('some `thing``', {}, metadata)).toBe('`` some `thing`` ``');
    expect(metadata.extraBacktickString).toBe('``');
    expect(metadata.extraSpace).toBe(' ');
  });
  it('adds spaces if there is space at start and end', () => {
    expect(mdEscaper.escape(' x ')).toBe('  x  ');
  });
  it('does not add space if there is space only at start', () => {
    expect(mdEscaper.escape('\nx')).toBe('\nx');
  });
  it('does not add space if there is space only at end', () => {
    expect(mdEscaper.escape('x\r\n')).toBe('x\r\n');
  });
  it('does not add space when there are only spaces', () => {
    const str = '\n \r\n \r ';
    expect(mdEscaper.escape(str).length).toBe(str.length);
  });
  it('does not escape pipes outside table', () => {
    const metadata = {};
    expect(mdEscaper.escape('*_x_*|`~~a~~', {}, metadata)).toBe('`*_x_*|`~~a~~`');
  });
  it('escapes pipes in table', () => {
    const metadata = {};
    expect(mdEscaper.escape('*_x_*|~~a~~', { inTable: true }, metadata)).toBe('*_x_*\\|~~a~~');
  });
  it('escapes pipe in table when at start', () => {
    const metadata = {};
    expect(mdEscaper.escape('|', { inTable: true }, metadata)).toBe('\\|');
  });
});
