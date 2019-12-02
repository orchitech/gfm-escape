import BaseSyntax from './BaseSyntax';

const NAME = 'text';

class TextSyntax extends BaseSyntax {
  constructor() {
    super(NAME);
  }

  static get name() {
    return NAME;
  }
}

export default TextSyntax;
