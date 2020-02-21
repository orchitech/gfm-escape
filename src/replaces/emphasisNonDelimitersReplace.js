import mergeOpts from '../utils/mergeOpts';
import extWebAutolinkStartCandidateReStr from '../utils/extWebAutolinkStartCandidateReStr';

const defaultOpts = {
  maxIntrawordUnderscoreRun: undefined,
};

const INTRAWORD_UNDERSORES_RE = new RegExp(
  `([a-zA-Z0-9])(_+)(?=[a-zA-Z0-9])(?!${extWebAutolinkStartCandidateReStr})`,
);
const FREE_DELIMITER_RE = /(?:^|[ \t\f])([_*])\1*(?=[ \t\r\n\f])/;

function processIntrawordUnderscores({ match: [m, before, underscores] }) {
  const max = this.escape.opts.emphasisNonDelimiters.maxIntrawordUnderscoreRun;
  if (max !== false && underscores.length > max) {
    const underscoresOut = underscores.replace(/_/g, '\\_');
    return `${before}${underscoresOut}`;
  }
  return m;
}

/**
 * Keep `*` and `_` unescaped when we know they cannot form emphasis delimiters.
 */
export default function emphasisNonDelimitersReplace() {
  if (!mergeOpts(this.opts, 'emphasisNonDelimiters', defaultOpts, true)) {
    return;
  }
  const max = this.opts.emphasisNonDelimiters.maxIntrawordUnderscoreRun;
  if (typeof max !== 'number') {
    this.opts.emphasisNonDelimiters.maxIntrawordUnderscoreRun = max ? 1 : false;
  }
  this.replacer.addReplacement(INTRAWORD_UNDERSORES_RE,
    processIntrawordUnderscores,
    true);
  this.replacer.addReplacement(FREE_DELIMITER_RE, '$&');
}
