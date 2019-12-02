import mergeOpts from '../utils/mergeOpts';
import escapeTildes from '../utils/escapeTildes';

const defaultOpts = Object.freeze({
  optimizeForDoubleTilde: false,
});

const STRIKETHROUGH_RE = /~+/;

function processStrikethrough({ match }) {
  return escapeTildes(match[0], match.index, match.input, null, this.escape.opts);
}

/**
 * Apply autolink replaces according to escaper's configuration.
 */
export default function strikethroughReplace() {
  if (!mergeOpts(this.opts, 'strikethrough', defaultOpts)) {
    return;
  }
  this.replacer.addReplacement(STRIKETHROUGH_RE, processStrikethrough, true);
}
