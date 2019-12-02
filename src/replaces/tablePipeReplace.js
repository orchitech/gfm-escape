import escapePipesIfInTable from '../utils/escapePipesIfInTable';

const PIPE_RE = /\|/;

/**
 * Escape table pipes if in table context.
 */
export default function tablePipeReplace() {
  if (!this.opts.table) {
    return;
  }
  this.replacer.addReplacement(PIPE_RE, escapePipesIfInTable);
}
