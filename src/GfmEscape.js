/**
 * `GfmEscape` is the only Markdown/CommonMark/GFM escaping implementation
 * that aims to be truly complete and survive back-translation.
 * @author Martin Cizek, Orchitech Solutions
 * @see https://github.com/orchitech/gfm-escape#readme
 * @license MIT
 * @module
 */

import UnionReplacer from 'union-replacer';
import Syntax from './Syntax';
import defaultSetup from './defaultSetup';
import applyProcessors from './utils/applyProcessors';

class GfmEscape {
  /**
   * Construct a new escaper based on the specified context, options and setup definition.
   * The instance is intended to be created once per GFM context and reused.
   * @param {Object} opts Escaping options for escaper setup and runtime.
   * @param {GfmEscape.Syntax} syntax The syntax we are escaping for. See {@link Syntax}.
   * @param {function} setup Callback that returns array of replaces to be applied in the
   *  for the specified syntax. See {@link GfmEscape.defaultSetup}.
   */
  constructor(opts, syntax = Syntax.text, setup = GfmEscape.defaultSetup) {
    this.syntax = syntax;
    this.opts = opts ? { ...opts } : {};
    this.replacer = new UnionReplacer('gm');
    this.preprocessors = [];
    this.postprocessors = [];
    setup(syntax).forEach(([replace, enabled]) => {
      if (enabled) {
        replace.call(this);
      }
    });
    this.replacer.compile();
    this.cache = {};
  }

  escape(input, gfmContext = {}, metadata = {}) {
    const escapeCtx = {
      escape: this,
      gfmContext,
      metadata,
    };
    let str = applyProcessors.call(escapeCtx, input, this.preprocessors);
    str = this.replacer.replace(str, escapeCtx);
    return applyProcessors.call(escapeCtx, str, this.postprocessors);
  }
}

GfmEscape.Syntax = Syntax;
GfmEscape.defaultSetup = defaultSetup;

export default GfmEscape;
