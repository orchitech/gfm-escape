import codeSpanReplace from './replaces/codeSpanReplace';
import blockReplace from './replaces/blockReplace';
import emphasisNonDelimitersReplace from './replaces/emphasisNonDelimitersReplace';
import entityBackslashReplace from './replaces/entityBackslashReplace';
import entityEntityReplace from './replaces/entityEntityReplace';
import extAutolinkReplace from './replaces/extAutolinkReplace';
import inlineReplace from './replaces/inlineReplace';
import linkDestinationReplace from './replaces/linkDestinationReplace';
import linkReplace from './replaces/linkReplace';
import linkTitleReplace from './replaces/linkTitleReplace';
import strikethroughReplace from './replaces/strikethroughReplace';
import tableDelimiterRowReplace from './replaces/tableDelimiterRowReplace';
import tablePipeReplace from './replaces/tablePipeReplace';
import CodeSpanSyntax from './syntax/CodeSpanSyntax';
import LinkDestinationSyntax from './syntax/LinkDestinationSyntax';
import LinkTitleSyntax from './syntax/LinkTitleSyntax';

const gfmSetupDefault = (s) => [
  [codeSpanReplace, s.name === CodeSpanSyntax.name],
  [extAutolinkReplace, s.inlinesInterpreted && !s.isLink],
  [strikethroughReplace, s.inlinesInterpreted],
  [tableDelimiterRowReplace, s.blocksInterpreted],
  [blockReplace, s.blocksInterpreted],
  [tablePipeReplace, true],
  [linkDestinationReplace, s.name === LinkDestinationSyntax.name],
  [linkTitleReplace, s.name === LinkTitleSyntax.name],
  [linkReplace, s.isLink],
  [entityEntityReplace, s.isLink],
  [entityBackslashReplace, s.inlinesInterpreted],
  [emphasisNonDelimitersReplace, s.inlinesInterpreted],
  [inlineReplace, s.inlinesInterpreted],
];

export default gfmSetupDefault;
