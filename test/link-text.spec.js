const GfmEscape = require('../dist/gfm-escape.cjs');
const describeEscapeBehavior = require('./behavior/describeEscapeBehavior');

const mdEscaper = new GfmEscape({
  strikethrough: { optimizeForDoubleTilde: true },
  extAutolink: true,
});

describeEscapeBehavior('link text syntax', mdEscaper, [
  [[']', { inLink: true }], '\\]'],
  [['(foo)', { inLink: true }], '(foo)'],
  [['x]y[z', { inLink: true }], 'x\\]y\\[z'],
  [['site inheriting https://orchi.tech/_foo_ and more', { inLink: true }], 'site inheriting https://orchi.tech/\\_foo\\_ and more'],
  [['https://orchi.tech/xxx<x', { inLink: true }], 'https://orchi.tech/xxx\\<x'],
  [['https://orchi.tech/~~x~~.', { inLink: true }], 'https://orchi.tech/\\~~x\\~~.'],
  [['1. no one', { inLink: true }], '1\\. no one'],
  [['- more', { inLink: true }], '\\- more'],
  [['Pikachu(Electric)', { inLink: true }], 'Pikachu(Electric)'],
  [['a_b_.', { inLink: true }], 'a_b\\_.'],
  [['produces &nbsp;', { inLink: true }], 'produces \\&nbsp;'],
  [['the ast&amp&quot & co', { inLink: true }], 'the ast&amp&quot & co'],
]);
