import BaseSyntax from './BaseSyntax';

const NAME = 'linkTitle';

class LinkTitleSyntax extends BaseSyntax {
  constructor() {
    super(NAME);
    this.isLink = true;
    this.inlinesInterpreted = false;
  }

  static get name() {
    return NAME;
  }
}

export default LinkTitleSyntax;
