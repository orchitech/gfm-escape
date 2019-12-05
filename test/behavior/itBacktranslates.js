const CmarkRender = require('./CmarkRender');
const { Syntax } = require('../../dist/gfm-escape.cjs');

const SOME_URL = 'https://orchi.tech';
const SOME_TEXT = 'GfmEscape';

const syntaxCreators = {
  text: (md) => md,
  linkText: (md) => `[${md}](${SOME_URL})`,
  imageText: (md) => `![${md}](${SOME_URL})`,
  linkDestination: (md) => `[${SOME_TEXT}](${md})`,
  cmAutolink: (md) => `<${md}>`,
};

const syntaxMatchers = {
  text: (render, input) => {
    expect(render).toHaveSameTextContentAs(input);
    if (!render.extAutolink) {
      expect(render).not.toHaveLinks();
    }
    expect(render).toHaveLinkTextsSameAsDestinations();
    expect(render).toHaveLinkTextsFrom(input);
  },
  linkText: (render, input) => {
    expect(render).toHaveSingleChildNode();
    expect(render).toHaveSameTextContentAs(input);
    expect(render).toHaveLinks([SOME_URL]);
  },
  imageText: (render) => {
    expect(render).toHaveSingleChildNode();
    // TODO: add checks related to image
  },
  linkDestination: (render, input) => {
    expect(render).toHaveSingleChildNode();
    expect(render).toHaveSameTextContentAs(SOME_TEXT);
    expect(render).toHaveLinks([input]);
  },
  cmAutolink: (render, input) => {
    expect(render).toHaveSingleChildNode();
    expect(render).toHaveLinks(1);
    expect(render).toHaveLinkTextsSameAsDestinations();
    if (Syntax.cmAutolink.wouldBeUnaltered(input)) {
      expect(render).toHaveSameTextContentAs(input);
    } else {
      expect(render).toHaveLinkTextsFrom(input);
    }
  },
};

const contextualSyntax = (syntaxName, gfmContext) => {
  if (syntaxName === 'text') {
    if (gfmContext.inTable) {
      // TODO: support table backtranslating
      return null;
    }
    if (gfmContext.inLink) {
      return 'linkText';
    }
    if (gfmContext.inImage) {
      return 'imageText';
    }
  }
  return syntaxName;
};

/**
 * Assert that the string escapes and renders back to itself using cmark-gfm.
 * Expects `this.subject` to be the escaper and `this.cmarkOptions` to be the
 * cmark-gfm settings.
 * @param {string|array} input string to test for backtranslation
 */
function itBacktranslates(input) {
  let inputStr = input;
  let gfmContext = {};
  if (Array.isArray(input)) {
    [inputStr, gfmContext] = input;
    gfmContext = gfmContext || {};
  }
  if (gfmContext.inTable) {
    // TODO: provide syntax rendering and backtranslation also for contextual escaping
    return;
  }
  it(`renders '${inputStr}' to matching output`, function backtranslate() {
    const ctxSyntax = contextualSyntax(this.subject.syntax.name, gfmContext);
    if (!ctxSyntax) {
      // unsupported
      return;
    }
    const md = this.subject.escape(inputStr, gfmContext);
    const mdToBacktranslate = syntaxCreators[ctxSyntax](md);
    const render = new CmarkRender(mdToBacktranslate, this.subject.opts);

    expect(render).not.toContainNonLinkElements();
    // GFM syntax-specific matches
    syntaxMatchers[ctxSyntax](render, inputStr);
  });
}

module.exports = itBacktranslates;
