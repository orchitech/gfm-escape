export default function escapePipesIfInTable(str) {
  return this.escape.opts.table && this.gfmContext.inTable
    ? str.replace(/\|/g, '\\|')
    : str;
}
