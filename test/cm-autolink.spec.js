const GfmEscape = require('../dist/gfm-escape.cjs');
const describeEscapeBehavior = require('./behavior/describeEscapeBehavior');

const mdEscaper = new GfmEscape(null, GfmEscape.Syntax.cmAutolink);

describeEscapeBehavior('CM autolink syntax', mdEscaper, [
  'http://orchi.tech',
  'http://orchi.tech/too bad',
  'http://orchi.tech/too&lt;bad',
  'http://orchi.tech/too&gt;bad',
  'http://orchi.tech/too>bad',
  'http://orchi.tech/too<bad',
  'foo@example.org',
]);
