import BaseSyntax from './BaseSyntax';
import autolinkedSchemeReStr from '../utils/autolinkedSchemeReStr';
import linkForbiddenRe from '../utils/linkForbiddenRe';
import { entityAmpersandRe } from '../utils/entityAmpersandRes';

const NAME = 'cmAutolink';
const STARTS_WITH_AUTOLINKED_SCHEME_RE = new RegExp(`^${autolinkedSchemeReStr}`);

class CmAutolinkSyntax extends BaseSyntax {
  constructor() {
    super(NAME);
    this.isLink = true;
    this.inlinesInterpreted = false;
    this.blocksInterpreted = false;
  }

  static get name() {
    return NAME;
  }

  isEncodable(str) {
    return STARTS_WITH_AUTOLINKED_SCHEME_RE.test(str);
  }

  wouldBeUnaltered(str) {
    return !linkForbiddenRe.test(str) && !entityAmpersandRe.test(str);
  }
}

export default CmAutolinkSyntax;
