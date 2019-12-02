import toAlphaEntityReference from '../../utils/toAlphaEntityReference';
import ExtWebAutolinkTransformers from './ExtWebAutolinkTransformers';
import linkForbiddenRe from '../../utils/linkForbiddenRe';

// $1: leading semicolon, $2: angle brackets, $3: parentheses, $4: to be encoded
const ENT_ENC_RE = /(^;)|([<>])|([()])|([^?!.,:"'])/g;

class ExtWebAutolinkRenderer {
  constructor(link, trail, ctx, opts) {
    this.link = link;
    this.trail = trail;
    this.ctx = ctx;
    this.opts = opts;
    // See cmark_gfm-004
    this.ctx.wouldConfuseEntity = trail.startsWith(';') && /&[a-z]+$/i.test(link);
  }

  /**
   * Pick an appropriate autolink match transformer based on trailing
   * punctuation and user configuration.
   * @returns {Function} Picked tranformer function.
   * @private
   */
  pickTransformer(t) {
    if (this.ctx.scheme && this.opts.extAutolink.breakUrl) {
      return t.breakup;
    }
    if (this.ctx.www && this.opts.extAutolink.breakWww) {
      return t.breakup;
    }
    if (!this.ctx.forceDelimiting && !this.ctx.wouldConfuseEntity) {
      this.ctx.backslashEscapedTrail = t.backslashEscape(this.trail);
      if (this.ctx.backslashEscapedTrail === this.trail) {
        return t.keep;
      }
    }
    const allowed = { breakup: true, breakafter: true };
    const considered = {};
    if (this.ctx.scheme || this.opts.extAutolink.allowAddHttpScheme) {
      // see cmark_gfm-002
      allowed.commonmark = !linkForbiddenRe.test(this.link);
    }
    if (!this.ctx.forceDelimiting && !/[~a-z0-9]/i.test(this.trail)) {
      // only consider when there are no chars known to be unconvertible to entity references
      // but delay full evaluation
      considered.entities = () => this.tryEntityEncodeTrail();
    }
    for (let i = 0; i < this.opts.extAutolink.allowedTransformations.length; i++) {
      const picked = this.opts.extAutolink.allowedTransformations[i];
      if (allowed[picked]) {
        return t[picked];
      }
      if (considered[picked] && considered[picked]()) {
        return t[picked];
      }
    }
    return t.breakafter;
  }

  tryEntityEncodeTrail() {
    let encodePar = false;
    let success = true;
    const enc = this.trail.replace(ENT_ENC_RE, (m, semi, angle, par, other) => {
      if (semi) {
        return this.ctx.wouldConfuseEntity ? toAlphaEntityReference(semi) : semi;
      }
      if (angle) {
        // angle brackets break the link, we must enforce all contextually dependent
        // link characters to be encoded - which is: parentheses
        encodePar = true;
        return toAlphaEntityReference(angle);
      }
      if (par) {
        return encodePar ? toAlphaEntityReference(par) : par;
      }
      if (other) {
        const entref = toAlphaEntityReference(other);
        if (entref) {
          return entref;
        }
        success = false;
      }
      return m;
    });
    if (success) {
      this.ctx.entityEncodedTrail = enc;
    }
    return success;
  }

  render() {
    const t = new ExtWebAutolinkTransformers(this.ctx, this.opts);
    return this.pickTransformer(t).call(t, this.link, this.trail);
  }
}

export default ExtWebAutolinkRenderer;
