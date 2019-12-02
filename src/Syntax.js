import BaseSyntax from './syntax/BaseSyntax';
import TextSyntax from './syntax/TextSyntax';
import LinkDestinationSyntax from './syntax/LinkDestinationSyntax';
import CmAutolinkSyntax from './syntax/CmAutolinkSyntax';
import CodeSpanSyntax from './syntax/CodeSpanSyntax';

const Syntax = BaseSyntax;

/**
 * Enumeration of GFM syntaxes used within {@link gfmSetupDefault}.
 */
Syntax.text = new TextSyntax();
Syntax.linkDestination = new LinkDestinationSyntax();
Syntax.cmAutolink = new CmAutolinkSyntax();
Syntax.codeSpan = new CodeSpanSyntax();

export default Syntax;
