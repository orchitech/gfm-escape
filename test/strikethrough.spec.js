const GfmEscape = require('../dist/gfm-escape.cjs');
const describeEscapeBehavior = require('./behavior/describeEscapeBehavior');

const escapeOpts = {
  strikethrough: {
    optimizeForDoubleTilde: true,
  },
  extAutolink: true,
};

describeEscapeBehavior('striketrough prevention (double tilde)', new GfmEscape(escapeOpts), [
  ['x~y', 'x~y'],
  ['x~~y', 'x\\~~y'],
  ['x~~~y', 'x~~~y'],
  ['~y', '\\~y'],
  ['~~y', '\\~~y'],
  ['~~~y', '\\~\\~~y'],
  ['~~~~y', '\\~~~~y'],
  ['x~', 'x\\~'],
  ['x~~', 'x~\\~'],
  ['x~~~', 'x\\~~\\~'],
  ['x~~~~', 'x~~~\\~'],
  ['~', '\\~'],
  ['~~', '\\~\\~'],
  ['~~~', '\\~~\\~'],
  ['~~~~', '\\~\\~~\\~'],
  ['~~~~~', '\\~~~~\\~'],
]);

escapeOpts.strikethrough.optimizeForDoubleTilde = false;
describeEscapeBehavior('striketrough prevention (no double tilde)', new GfmEscape(escapeOpts), [
  ['x~y', 'x\\~y'],
  ['x~~y', 'x\\~\\~y'],
  ['x~~~y', 'x\\~\\~\\~y'],
  ['~y', '\\~y'],
  ['~~y', '\\~\\~y'],
  ['~~~y', '\\~\\~\\~y'],
  ['~~~~y', '\\~\\~\\~\\~y'],
  ['x~', 'x\\~'],
  ['x~~', 'x\\~\\~'],
  ['x~~~', 'x\\~\\~\\~'],
  ['x~~~~', 'x\\~\\~\\~\\~'],
  ['~', '\\~'],
  ['~~', '\\~\\~'],
  ['~~~', '\\~\\~\\~'],
  ['~~~~', '\\~\\~\\~\\~'],
  ['~~~~~', '\\~\\~\\~\\~\\~'],
]);

escapeOpts.strikethrough = false;
describeEscapeBehavior('striketrough prevention (no double tilde)', new GfmEscape(escapeOpts), [
  ['a ~~b~~ c', 'a ~~b~~ c'],
  ['~~b~~', '~~b~~'],
]);
