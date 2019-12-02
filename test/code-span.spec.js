const GfmEscape = require('../dist/gfm-escape.cjs');

const mdEscaper = new GfmEscape({
  table: true,
  strikethrough: true,
}, GfmEscape.Syntax.codeSpan);

describe('code span syntax', () => {
  it('returns one backtick if there is no backtick', () => {
    const metadata = {};
    expect(mdEscaper.escape('some thing', {}, metadata)).toBe('some thing');
    expect(metadata.delimiter).toBe('`');
    expect(metadata.space).toBe('');
  });

  it('returns one more backtick than the longest backtick run in text', () => {
    const metadata = {};
    expect(mdEscaper.escape('``some `thing', {}, metadata)).toBe('``some `thing');
    expect(metadata.delimiter).toBe('```');
    expect(metadata.space).toBe(' ');
    expect(mdEscaper.escape('some `thing``', {}, metadata)).toBe('some `thing``');
    expect(metadata.delimiter).toBe('```');
    expect(metadata.space).toBe(' ');
  });

  it('does not escape anything outside table', () => {
    const metadata = {};
    expect(mdEscaper.escape('*_x_*|`~~a~~', {}, metadata)).toBe('*_x_*|`~~a~~');
    expect(metadata.delimiter).toBe('``');
    expect(metadata.space).toBe('');
  });

  it('escapes pipes in table', () => {
    const metadata = {};
    expect(mdEscaper.escape('*_x_*|~~a~~', { inTable: true }, metadata)).toBe('*_x_*\\|~~a~~');
    expect(metadata.delimiter).toBe('`');
    expect(metadata.space).toBe('');
  });
});
