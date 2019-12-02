const LINK_DESTINATION_SPECIALS_RE = /[()<>]/;

/**
 * Escape parentheses.
 */
export default function linkDestinationSpecialsReplace() {
  this.replacer.addReplacement(LINK_DESTINATION_SPECIALS_RE, '\\$&');
}
