import escapeTildes from '../../utils/escapeTildes';
import { entityAmpersandReStr, entityAmpersandsRe } from '../../utils/entityAmpersandRes';

// $1: single char, $2: tildes
const LINK_ESCAPE_RE = new RegExp(`([_*<>[\\]]|${entityAmpersandReStr})|(~+)`, 'g');

class ExtWebAutolinkTransformers {
  constructor(ctx, opts) {
    this.ctx = ctx;
    this.opts = opts;
  }

  /* eslint-disable-next-line class-methods-use-this */
  keep(link, trail) {
    return `${link}${trail}`;
  }

  commonmark(link, trail) {
    // unlike backslash escapes, entity-like sequences are interpreted
    const outLink = link.replace(entityAmpersandsRe, '&amp;');
    const addScheme = this.ctx.scheme ? '' : 'http://';
    // Give the trail back to matching
    this.ctx.mctx.skip(-trail.length);
    return `<${addScheme}${outLink}>`;
  }

  entities(link) {
    return `${link}${this.ctx.entityEncodedTrail}`;
  }

  breakup(link, trail) {
    this.ctx.unterminatedEntity = false;
    const giveBack = link.length - this.ctx.linkStart.length + trail.length;
    this.ctx.mctx.skip(-giveBack);
    return `${this.ctx.linkStart}${this.opts.extAutolink.breaker}`;
  }

  breakafter(link, trail) {
    this.ctx.unterminatedEntity = false;
    // Give the trail back to matching
    this.ctx.mctx.skip(-trail.length);
    return `${link}${this.opts.extAutolink.breaker}`;
  }

  /**
   * Escape characters in extended web autolink match according to the callers settings,
   * so that it is interpreted correctly in GFM.
   * XXX needed / broken?
   * @param {String} str Link match portion to be escaped.
   * @private
   */
  backslashEscape(str) {
    return str.replace(LINK_ESCAPE_RE, (m, single, tildes, offset, string) => {
      if (single) {
        return `\\${single}`;
      }
      if (tildes) {
        return escapeTildes(tildes, offset, string, this.ctx, this.opts);
      }
      return m;
    });
  }
}

export default ExtWebAutolinkTransformers;
