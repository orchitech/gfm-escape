import BaseSyntax from './BaseSyntax';
import autolinkedSchemeReStr from '../utils/autolinkedSchemeReStr';
import linkForbiddenRe from '../utils/linkForbiddenRe';
import { entityAmpersandRe } from '../utils/entityAmpersandRes';

const NAME = 'cmAutolink';
const STARTS_WITH_AUTOLINKED_SCHEME_RE = new RegExp(`^${autolinkedSchemeReStr}`);
// adapted from the non-normative regex in the HTML5 spec
const EMAIL_ADDRESS_RE = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;

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
    return STARTS_WITH_AUTOLINKED_SCHEME_RE.test(str)
      || EMAIL_ADDRESS_RE.test(str);
  }

  wouldBeUnaltered(str) {
    return !linkForbiddenRe.test(str) && !entityAmpersandRe.test(str);
  }
}

export default CmAutolinkSyntax;
