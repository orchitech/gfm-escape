const LINK_DESTINATION_SPECIALS_RE = /[()<>]/;

function renderEmptyLinkDestination(output) {
  return output.length > 0 ? output : '<>';
}

/**
 * Escape parentheses and brackets.
 */
export default function linkDestinationReplace() {
  this.replacer.addReplacement(LINK_DESTINATION_SPECIALS_RE, '\\$&');
  this.postprocessors.unshift(renderEmptyLinkDestination);
}
