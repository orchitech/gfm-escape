const jasmineDiff = require('jasmine-diff');
const itProducesExpectedOutput = require('./itProducesExpectedOutput');
const itBacktranslates = require('./itBacktranslates');
const cmarkRenderMatchers = require('./cmarkRenderMatchers');

function describeEscapeBehavior(suite, escaper, cases) {
  describe(suite, () => {
    beforeEach(function prepare() {
      this.subject = escaper;
      jasmine.addMatchers(jasmineDiff(jasmine, {
        colors: true,
        inline: true,
      }));
      jasmine.addMatchers(cmarkRenderMatchers);
    });
    cases.forEach((entry) => {
      if (Array.isArray(entry) && typeof entry[1] === 'string') {
        const [input, expected] = entry;
        itProducesExpectedOutput(input, expected);
        itBacktranslates(input);
      } else {
        itBacktranslates(entry);
      }
    });
  });
}

module.exports = describeEscapeBehavior;
