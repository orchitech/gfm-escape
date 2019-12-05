const GfmEscape = require('../dist/gfm-escape.cjs');

const mdEscaper = new GfmEscape({}, GfmEscape.Syntax.linkTitle);

describe('link title syntax', () => {
  it('picks default delimiter', () => {
    const metadata = {};
    expect(mdEscaper.escape('foo', {}, metadata)).toBe('foo');
    expect(metadata.delimiter).toBe('"');
    expect(metadata.startDelimiter).toBe('"');
    expect(metadata.endDelimiter).toBe('"');
  });
  it('picks unused second delimiter if first is used', () => {
    const metadata = {};
    expect(mdEscaper.escape('foo"bar', {}, metadata)).toBe('foo"bar');
    expect(metadata.delimiter).toBe('\'');
    expect(metadata.startDelimiter).toBe('\'');
    expect(metadata.endDelimiter).toBe('\'');
  });
  it('picks unused third delimiter if first and second are used', () => {
    const metadata = {};
    expect(mdEscaper.escape('foo\'"\'bar', {}, metadata)).toBe('foo\'"\'bar');
    expect(metadata.delimiter).toBe('()');
    expect(metadata.startDelimiter).toBe('(');
    expect(metadata.endDelimiter).toBe(')');
  });
  it('picks the firt delimiter when all are equally used', () => {
    const metadata = {};
    expect(mdEscaper.escape('("\'foo\'")', {}, metadata)).toBe('(\\"\'foo\'\\")');
    expect(metadata.delimiter).toBe('"');
  });
  it('favorites delimiter with forced escaping', () => {
    const metadata = {};
    const escaper = new GfmEscape({
      linkTitle: {
        alwaysEscapeDelimiters: ['()'],
      },
    }, GfmEscape.Syntax.linkTitle);
    expect(escaper.escape('("\'foo\'")', {}, metadata)).toBe('\\("\'foo\'"\\)');
    expect(metadata.delimiter).toBe('()');
  });
});
