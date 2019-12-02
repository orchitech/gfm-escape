import BaseSyntax from './BaseSyntax';

const NAME = 'linkDestination';

class LinkDestinationSyntax extends BaseSyntax {
  constructor() {
    super(NAME);
    this.isLink = true;
    this.inlinesInterpreted = false;
    this.blocksInterpreted = false;
  }

  static get name() {
    return NAME;
  }
}

export default LinkDestinationSyntax;
