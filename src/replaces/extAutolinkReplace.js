/**
 * GFM autolink extension processor according to the spec and cmark-gfm.
 * Considerations:
 * 1. An autolink-like sequence just can be present in any text node.
 * 2. Although autolinks should have been rendered to an HTML `<a>` tag when
 *    processing HTML produced by a Markdown rendered, this is not always
 *    the case. The HTML can have any origin including hand-writing and WYSIWYG.
 * 3. No matter how a link-like sequence appeared in a text node,
 *    an extended autolink-enabled parser would just interpret it when we put it
 *    in the resulting Markdown.
 * 4. The result would be crippled when autolink is MD-escaped in a common way.
 *    This was actually the biggest pain in author's back-translation tests.
 *    Let's consider a HTML text with a common URL sequence `www.example.org/a_b`
 *    and a URL sequence with punctuation and a "footnote star"
 *    `See https://orchi.tech...*`.
 *    The usual MD escaping would lead to `www.example.org/a\_b` and
 *    `https://orchi.tech...\*`. Which then renders as
 *    `<a href="http://www.example.org/a%5C_b`">` and
 *    `<a href="https://orchi.tech...%5C">`, while displaying the backslash
 *    in the back-translated output. This is not really what was meant.
 * 5. There are little to no options how to prevent extended autolink processing
 *    in Markdown. A HTML comment might be applied, e.g.
 *    `https<!-- -->://orchi.tech`. This is something a) not really expected
 *    and b) the user likely appreciates autolinking of apparent links in the
 *    text input.
 * 6. The rule of thumb is based on the HTML1 -> GFM1 -> HTML2 -> GFM2
 *    backtranslation test.
 *     1. GFM1 and GFM2 must be semantically equivalent.
 *     2. HTML2 should appear the same as HTML1 except constructs unsupported
 *        in GFM. When autolinks are the concern, there must be the same
 *        apparent text and the link should point to the URL that was present
 *        in HTML1, although not as a HTML link.
 *     3. The produced GFM should be "expected" by the user. As GFM is a markup
 *        language intended to be hand-written, the user should be able t
 *        hand-edit the output without "surprises".
 *     4. GFM1 and GFM2 should be syntactically same, if possible.
 *
 * That's why we develop this escaper to significantly improve Turndown's
 * reliability. It is based on GFM spec and cmark-gfm as a reference
 * implementation. cmark-gfm has been preferred over the spec.
 *
 * Remarks for extended web autolinks:
 * 1. '>' is generally considered a valid part of extended autolinks. But we
 *    are looking for the most likely input satisfying MD->HTML->MD
 *    backtranslation test, so we treat it as a delimiter too.
 * 2. Except _no underscores in the last two segments of the domain_,
 *    cmark-gfm has very loose rules on domain segments. I.e. `http://x..` would
 *    be treated as an autolink to `http://x`, while the trailing dots are
 *    treated as trailing punctuation during processing.
 * 3. As we work with processed HTML, HTML entity reference rule makes
 *    little sense for detection. The other way around, we must not generate
 *    output that would match this rule.
 * 4. When it is necessary, we convert the link to the standard
 *    CommonMark autolink construct to best match the rule of thumb.
 * 5. See related cmark_gfm-NNN notes in README.md.
 *
 * @see https://github.github.com/gfm/#autolinks-extension-
 * @see https://github.com/github/cmark-gfm/blob/21f7420f42cd970732c65155befccb68e5b0144a/extensions/autolink.c
 */

import mergeOpts from '../utils/mergeOpts';
import autolinkedSchemeReStr from '../utils/autolinkedSchemeReStr';
import autolinkedWwwReStr from '../utils/autolinkedWwwReStr';
import C from '../../tools/output/cmark-unicode';
import ExtWebAutolinkRenderer from './extAutolink/ExtWebAutolinkRenderer';
import escapePipesIfInTable from '../utils/escapePipesIfInTable';
import wrapPostprocessor from '../utils/wrapPostprocessor';

const defaultOpts = Object.freeze({
  breakUrl: false,
  breakWww: false,
  breaker: '<!-- -->',
  allowedTransformations: ['entities', 'commonmark'],
  allowAddHttpScheme: false,
  inImage: false,
});

// true if autolink match should be considered autolink in given matching context
const shouldProcess = ({ gfmContext, escape: { opts } }) => (
  !gfmContext.inLink && (!gfmContext.inImage || opts.autolink.inImage)
);

// $1: before, $2: linkMatch, $3: linkStart, $4: scheme, $5: www.
const EXT_WEB_AUTOLINK_RE = (() => {
  // Standard domain character match
  const MC_SD = `[^${C.space}${C.punct}]`;
  const MC_D3 = `(?:${MC_SD}|[-_])`; // 3rd+ level domain char
  const MC_D12 = `(?:${MC_SD}|-)`; // 1st and 2nd level domain char
  // see cmark_gfm-003
  const M_D = `(?![-_.<>])(?:(?:${MC_D3}*\\.)*${MC_D12}*\\.)?${MC_D12}*(?!${MC_D3})`;
  // see cmark_gfm-002
  const MC_AFTER_D = '[^ \\t\\n\\r]'; // after-domain char including '<' for our purposes

  const M_URL = autolinkedSchemeReStr;
  const M_WWW = autolinkedWwwReStr;
  // see cmark_gfm-001
  const M_BEFORE = `(?:\\b|_)(?=${M_URL})|(?:^|[${C.space}*_(]|~+)(?=${M_WWW})`;
  return new RegExp(`(${M_BEFORE})(((${M_URL})|(${M_WWW}))${M_D}${MC_AFTER_D}*)`);
})();

const EXT_EMAIL_AUTOLINK_RE = /[-+.\w]+@(?:[-\w]+\.)+[-\w]*[^\W_](?![-@\w])/;

/**
 * Process extended web autolink-like sequence in a plain text input.
 * @param {MatchingContext} mctx matching context.
 * @private
 */
function processExtWebAutolink(mctx) {
  const [m, before, linkMatch, linkStart, scheme, www] = mctx.match;
  const outBefore = before ? `\\${before}` : '';
  if (!shouldProcess(this)) {
    mctx.jump(before.length + linkStart.length);
    return `${outBefore}${linkStart}`;
  }
  let trail = '';
  let linkEnd = linkMatch.search(/[<>]/);
  let link = linkMatch;
  if (linkEnd >= 0) {
    trail = link.substring(linkEnd);
    link = link.substring(0, linkEnd);
  }
  let forceDelimiting = false;
  // forcefully terminated link can be followed by other links
  // consider only longer trails, as min. match would be like '<a@b.c'
  if (trail.length >= 6) {
    forceDelimiting = EXT_EMAIL_AUTOLINK_RE.test(trail) || EXT_WEB_AUTOLINK_RE.test(trail);
  }
  // Trailing punctuation and ')'
  linkEnd = link.search(/[?!.,:*_~'";)]+$/i);
  if (linkEnd >= 0) {
    // treat matching ')' as part of the link
    let popen = 0;
    let pclose = 0;
    for (let i = 0; i < link.length; i++) {
      switch (link.charAt(i)) {
        case '(':
          popen++;
          break;
        case ')':
          pclose++;
          if (i >= linkEnd && pclose <= popen) {
            linkEnd = i + 1;
          }
          break;
        default:
          break;
      }
    }
    trail = link.substring(linkEnd) + trail;
    link = link.substring(0, linkEnd);
  }
  const ctx = {
    mctx,
    scheme,
    www,
    linkStart,
    atEnd: mctx.match.index + m.length >= mctx.match.input.length,
    forceDelimiting,
  };
  const renderer = new ExtWebAutolinkRenderer(link, trail, ctx, this.escape.opts);
  return `${outBefore}${renderer.render()}`;
}

// $1: keep
const GFM_EMAIL_UNDERSCORES_RE = /([a-z\d]_+)(?=[a-z\d])|_/gi;

function processExtEmailAutolink(mctx) {
  const [emailMatch] = mctx.match;
  if (!shouldProcess(this)) {
    const emailShred = emailMatch.match(/^.*?@/)[0];
    mctx.jump(emailShred.length);
    return this.escape.escape(emailShred, this.gfmContext, this.metadata);
  }
  // Thankfuly backlashs escapes are OK within extended email autolinks,
  // since only strictly intraword underscores are safe to keep.
  return emailMatch.replace(GFM_EMAIL_UNDERSCORES_RE,
    (m, keep) => (keep ? m : `\\${m}`));
}

/**
 * Apply extended autolink replaces according to escaper's configuration.
 */
export default function extAutolinkReplace() {
  if (!mergeOpts(this.opts, 'extAutolink', defaultOpts)) {
    return;
  }
  this.replacer.addReplacement(EXT_WEB_AUTOLINK_RE,
    wrapPostprocessor(processExtWebAutolink, escapePipesIfInTable),
    true);
  this.replacer.addReplacement(EXT_EMAIL_AUTOLINK_RE, processExtEmailAutolink, true);
}
