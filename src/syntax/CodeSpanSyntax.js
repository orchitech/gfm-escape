import BaseSyntax from './BaseSyntax';

const NAME = 'codeSpan';

class CodeSpanSyntax extends BaseSyntax {
  constructor() {
    super(NAME);
    this.inlinesInterpreted = false;
    this.blocksInterpreted = false;
  }

  static get name() {
    return NAME;
  }

  isEncodable(str) {
    return str.length > 0;
  }
}

export default CodeSpanSyntax;
