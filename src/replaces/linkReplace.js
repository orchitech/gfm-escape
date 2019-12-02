import linkForbiddenRe from '../utils/linkForbiddenRe';

function processLink([m]) {
  return encodeURIComponent(m);
}

/**
 * Escape parentheses <, > and whitespace either as entites or in URL encoding.
 */
export default function linkReplace() {
  this.replacer.addReplacement(linkForbiddenRe, processLink);
}
