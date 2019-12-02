const GfmEscape = require('../dist/gfm-escape.cjs');
const describeEscapeBehavior = require('./behavior/describeEscapeBehavior');

const escapeOpts = {
  strikethrough: {
    optimizeForDoubleTilde: true,
  },
  extAutolink: true,
  table: true,
};

const textEscaper = new GfmEscape(escapeOpts);
const cmAutolinkEscaper = new GfmEscape(escapeOpts, GfmEscape.Syntax.cmAutolink);
const linkDestinationEscaper = new GfmEscape(escapeOpts, GfmEscape.Syntax.linkDestination);

describeEscapeBehavior('table delimiter row', textEscaper, [
  ['| --- | :---: | ', '\\| --- \\| :---: \\| '],
  ['---|---', '---\\|---'],
  [' ---:|:--- ', ' ---:\\|:--- '],
  ['|-|', '\\|-\\|'],
  [' |-| ', ' \\|-\\| '],
  ['|-', '\\|-'],
  ['-|', '-\\|'],
]);

describeEscapeBehavior('text syntax: pipe in inTable context', textEscaper, [
  [['foo|bar', { inTable: false }], 'foo|bar'],
  [['foo|bar', { inTable: true }], 'foo\\|bar'],
  [['https://orchi.tech/a|b*', { inTable: true }], 'https://orchi.tech/a\\|b&ast;'],
]);

describeEscapeBehavior('text syntax: pipe in inTable and inLink contexts', textEscaper, [
  [['https://orchi.tech/a|b*', { inTable: true, inLink: true }], 'https://orchi.tech/a\\|b\\*'],
  [['foo|bar@example.com', { inTable: true, inLink: true }], 'foo\\|bar@example.com'],
  [['foo@foo|bar.example.com', { inTable: true, inLink: true }], 'foo@foo\\|bar.example.com'],
  [['http://www.example.com|foo', { inTable: true, inLink: true }], 'http://www.example.com\\|foo'],
  [['http://www.example.com/foo|bar', { inTable: true, inLink: true }], 'http://www.example.com/foo\\|bar'],
]);

describeEscapeBehavior('CM autolink syntax: pipe in inTable context', cmAutolinkEscaper, [
  [['http://example.com|foo*', { inTable: false }], 'http://example.com|foo*'],
  [['http://example.com|foo*', { inTable: true }], 'http://example.com\\|foo*'],
  [['https://orchi.tech/a|b*', { inTable: true }], 'https://orchi.tech/a\\|b*'],
]);

describeEscapeBehavior('Link destination syntax: pipe in inTable context', linkDestinationEscaper, [
  [['foo|bar', { inTable: false }], 'foo|bar'],
  [['foo|bar', { inTable: true }], 'foo\\|bar'],
  [['https://orchi.tech/a|b*', { inTable: true }], 'https://orchi.tech/a\\|b*'],
]);
