const GfmEscape = require('../dist/gfm-escape.cjs');
const describeEscapeBehavior = require('./behavior/describeEscapeBehavior');

const mdEscaper = new GfmEscape(null, GfmEscape.Syntax.linkDestination);

describeEscapeBehavior('link destination syntax', mdEscaper, [
  ['http://example.org/joe(average)', 'http://example.org/joe\\(average\\)'],
  ['joe average', 'joe%20average'],
  'http://orchi.tech/_noemphasis_ here',
  ['_foo&amp;bar_', '_foo&amp;amp;bar_'],
  ['<foo>', '\\<foo\\>'],
  ['', '<>'],
]);
