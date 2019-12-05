import BaseSyntax from './syntax/BaseSyntax';
import TextSyntax from './syntax/TextSyntax';
import LinkDestinationSyntax from './syntax/LinkDestinationSyntax';
import LinkTitleSyntax from './syntax/LinkTitleSyntax';
import CmAutolinkSyntax from './syntax/CmAutolinkSyntax';
import CodeSpanSyntax from './syntax/CodeSpanSyntax';

const Syntax = BaseSyntax;

/**
 * GFM syntaxes used within {@link gfmSetupDefault}.
 */
Syntax.text = new TextSyntax();
Syntax.linkDestination = new LinkDestinationSyntax();
Syntax.linkTitle = new LinkTitleSyntax();
Syntax.cmAutolink = new CmAutolinkSyntax();
Syntax.codeSpan = new CodeSpanSyntax();

export default Syntax;
