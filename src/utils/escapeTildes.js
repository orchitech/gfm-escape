/**
 * TODO: doc
 * @param {String} tildes
 * @param {Function} charEscape
 * @param {number} offset
 * @param {String} string
 * @param {Object} ctx
 * @param {Object} opts
 * @private
 */
export default function escapeTildes(tildes, offset, string, ctx, opts) {
  if (!opts.strikethrough) {
    return tildes;
  }
  if (!opts.strikethrough.optimizeForDoubleTilde) {
    return tildes.replace(/./g, '\\$&');
  }
  // An unescaped leading or trailing tilde can break a surrounding strike-through.
  // This could be smarter if such context information were caller-supplied.
  const atStart = (!ctx || ctx.atStart) && offset === 0;
  const atEnd = (!ctx || ctx.atEnd) && offset + tildes.length >= string.length;
  let lead = '';
  let mid = tildes;
  let trail = '';
  if (atStart && mid.length > 0) {
    lead = `\\${mid.charAt(0)}`;
    mid = mid.substring(1);
  }
  if (atEnd && mid.length > 0) {
    trail = `\\${mid.charAt(mid.length - 1)}`;
    mid = mid.slice(0, -1);
  }
  if (mid.length === 2) {
    mid = `\\${mid.charAt(0)}${mid.substring(1)}`;
  }
  return `${lead}${mid}${trail}`;
}
