class BaseSyntax {
  constructor(name) {
    this.name = name;
    this.inlinesInterpreted = true;
    this.blocksInterpreted = true;
    this.isLink = false;
  }

  isEncodable(str) {
    return true;
  }

  wouldBeUnaltered(str) {
    return true;
  }
}

export default BaseSyntax;
