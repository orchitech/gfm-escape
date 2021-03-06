const GfmEscape = require('../dist/gfm-escape.cjs');
const describeEscapeBehavior = require('./behavior/describeEscapeBehavior');

const escapeOptsIntrawordUnderscoresUnlimited = {
  extAutolink: true,
};
describeEscapeBehavior(
  'emphasisNonDelimiters (unlimited intraword underscores)',
  new GfmEscape(escapeOptsIntrawordUnderscoresUnlimited),
  [
    ['a_b', 'a_b'],
    ['a_.', 'a\\_.'],
    ['a_', 'a\\_'],
    ['_a', '\\_a'],
    ['a__b', 'a__b'],
    ['a__http://orchi.tech', 'a\\_\\_http://orchi.tech'],
    ['a__www.orchi.tech', 'a\\_\\_www.orchi.tech'],
    ['_', '\\_'],
    ['._a', '.\\_a'],
  ],
);

const escapeOptsIntrawordUnderscores1 = {
  extAutolink: true,
  emphasisNonDelimiters: {
    maxIntrawordUnderscoreRun: 1,
  },
};
describeEscapeBehavior(
  'emphasisNonDelimiters (max 1 intraword underscore)',
  new GfmEscape(escapeOptsIntrawordUnderscores1),
  [
    ['a_b', 'a_b'],
    ['a_.', 'a\\_.'],
    ['a__b', 'a\\_\\_b'],
  ],
);
