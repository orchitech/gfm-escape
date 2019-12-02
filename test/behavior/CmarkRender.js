'use strict';

const cmark = require('cmark-gfm');
const { JSDOM } = require('jsdom');

// Config adapted from:
// https://github.com/clear-code/redmine_common_mark/blob/master/init.rb
// https://github.com/gitlabhq/gitlabhq/blob/master/lib/banzai/filter/markdown_engines/common_mark.rb
const cmarkDefaults = Object.freeze({
  validateUtf8: true,
  smart: false,
  liberalHtmltag: false,
  footnotes: false,
  strikethroughDoubleTilde: true,
  sourcepos: false,
  hardbreaks: false,
  unsafe: false,
  nobreaks: false,
  githubPreLang: false,
  fullInfoString: false,
  extensions: Object.freeze({
    autolink: true,
    strikethrough: true,
    table: true,
    tagfilter: true,
    // tasklist: false, // not mentioned in GitLab
  }),
});

const cmarkOptsForEscapeOpts = (opts) => {
  const cmarkOpts = { ...cmarkDefaults, extensions: { ...cmarkDefaults.extensions } };
  if (!opts.strikethrough) {
    cmarkOpts.extensions.strikethrough = false;
  }
  if (!opts.strikethrough || !opts.strikethrough.optimizeForDoubleTilde) {
    cmarkOpts.strikethroughDoubleTilde = false;
  }
  if (!opts.extAutolink) {
    cmarkOpts.extensions.autolink = false;
  }
  return cmarkOpts;
};

const renderedCmarkNode = (doc) => {
  let root = doc.getElementsByTagName('body')[0];
  root.normalize();
  // unwrap <p> tag
  if (root.hasChildNodes() && root.childNodes.length === 1) {
    const childNode = root.childNodes[0];
    if (childNode.nodeName.toUpperCase() === 'P') {
      root = childNode;
    }
  }
  return root;
};

class CmarkRender {
  constructor(md, escapeOpts) {
    const cmarkOpts = cmarkOptsForEscapeOpts(escapeOpts);
    const html = cmark.renderHtmlSync(md, cmarkOpts).replace(/\r?\n$/, '');
    const wrappedHtml = `<html><body>${html}</body></html>`;
    this.md = md;
    this.window = new JSDOM(wrappedHtml).window;
    this.node = renderedCmarkNode(this.window.document);
    this.extAutolink = cmarkOpts.extensions.autolink;
  }

  select(xpath) {
    const arr = [];
    const { ORDERED_NODE_ITERATOR_TYPE } = this.window.XPathResult;
    const doc = this.node.ownerDocument;
    const it = doc.evaluate(xpath, this.node, null, ORDERED_NODE_ITERATOR_TYPE);
    let node;
    while ((node = it.iterateNext())) {
      arr.push(node);
    }
    return arr;
  }

  select1(xpath) {
    const nodes = this.select(xpath);
    if (nodes.length !== 1) {
      throw new Error(`Exactly one result expected for select1('${xpath}').`);
    }
    return nodes[0];
  }

  selectCount(xpath) {
    const countXpath = `count(${xpath})`;
    const { NUMBER_TYPE } = this.window.XPathResult;
    const doc = this.node.ownerDocument;
    return doc.evaluate(countXpath, this.node, null, NUMBER_TYPE).numberValue;
  }
}

module.exports = CmarkRender;
