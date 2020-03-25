const GfmEscape = require('../dist/gfm-escape.cjs');
const describeEscapeBehavior = require('./behavior/describeEscapeBehavior');

const mdEscaper = new GfmEscape({
  strikethrough: { optimizeForDoubleTilde: true },
  extAutolink: true,
});

describeEscapeBehavior('text syntax (ext autolinks on)', mdEscaper, [
  ['- - - \naaa', '\\- - - \naaa'],
  ['a_b', 'a_b'],
  ['And&amp;&&frac12;&12frac;', 'And\\&amp;&\\&frac12;&12frac;'],
  ['1. a\n2.b\n3.\n_4. end', '1\\. a\n2.b\n3\\.\n\\_4. end'],
  ['1) a\n2)b\n3)\n_4) end', '1\\) a\n2)b\n3\\)\n\\_4) end'],
  ['\\. \\\\ \\\\$ \\\n\\a', '\\\\. \\\\\\ \\\\\\\\$ \\\\\n\\a'],
  ['line  \nbreak', 'line  <!-- spaces -->\nbreak'],
]);
