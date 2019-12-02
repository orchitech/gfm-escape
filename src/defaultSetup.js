import codeSpanReplace from './replaces/codeSpanReplace';
import blockReplace from './replaces/blockReplace';
import emphasisNonDelimitersReplace from './replaces/emphasisNonDelimitersReplace';
import entityBackslashReplace from './replaces/entityBackslashReplace';
import entityEntityReplace from './replaces/entityEntityReplace';
import extAutolinkReplace from './replaces/extAutolinkReplace';
import inlineReplace from './replaces/inlineReplace';
import linkDestinationSpecialsReplace from './replaces/linkDestinationSpecialsReplace';
import linkReplace from './replaces/linkReplace';
import strikethroughReplace from './replaces/strikethroughReplace';
import tableDelimiterRowReplace from './replaces/tableDelimiterRowReplace';
import tablePipeReplace from './replaces/tablePipeReplace';
import CodeSpanSyntax from './syntax/CodeSpanSyntax';
import LinkDestinationSyntax from './syntax/LinkDestinationSyntax';

const gfmSetupDefault = (s) => [
  [codeSpanReplace, s.name === CodeSpanSyntax.name],
  [extAutolinkReplace, s.inlinesInterpreted && !s.isLink],
  [strikethroughReplace, s.inlinesInterpreted],
  [tableDelimiterRowReplace, s.blocksInterpreted],
  [blockReplace, s.blocksInterpreted],
  [tablePipeReplace, true],
  [linkDestinationSpecialsReplace, s.name === LinkDestinationSyntax.name],
  [linkReplace, s.isLink],
  [entityEntityReplace, s.isLink],
  [entityBackslashReplace, s.inlinesInterpreted],
  [emphasisNonDelimitersReplace, s.inlinesInterpreted],
  [inlineReplace, s.inlinesInterpreted],
];

export default gfmSetupDefault;
