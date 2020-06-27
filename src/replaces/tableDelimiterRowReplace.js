import mergeOpts from '../utils/mergeOpts';

const defaultOpts = true;

const TABLE_DELIMITER_ROW_RE = (() => {
  const SP = '[ \\t]*';
  const CELL = `${SP}:?-+:?${SP}`;
  const P = '[|]';
  const L_OR_BOTH = `${SP}(?:${P}${CELL})+${P}?`;
  const R_OR_NONE = `${CELL}(?=${P})(?:${P}${CELL})*${P}?`;
  return new RegExp(`^(?:${L_OR_BOTH}|${R_OR_NONE})${SP}$`);
})();

function processTableDelimiterRow({ match: [delimiterRow] }) {
  return delimiterRow.replace(/\|/g, '\\|');
}

/**
 * Escape table delimiter row.
 */
export default function tableDelimiterRowReplace() {
  if (!mergeOpts(this.opts, 'table', defaultOpts)) {
    return;
  }
  this.replaces.push([TABLE_DELIMITER_ROW_RE, processTableDelimiterRow, true]);
}
