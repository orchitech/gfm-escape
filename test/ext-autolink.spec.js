const GfmEscape = require('../dist/gfm-escape.cjs');
const describeEscapeBehavior = require('./behavior/describeEscapeBehavior');

const mdEscaper = new GfmEscape({
  strikethrough: { optimizeForDoubleTilde: true },
  extAutolink: true,
});

describeEscapeBehavior('ext autolink parenthesis matching', mdEscaper, [
  ['http://www.pokemon.com/Pikachu_(Electric)*', 'http://www.pokemon.com/Pikachu_(Electric)&ast;'],
  ['http://www.pokemon.com/Pikachu_((Electric)*', 'http://www.pokemon.com/Pikachu_((Electric)&ast;'],
  ['http://www.pokemon.com/Pikachu_(Electric))*', 'http://www.pokemon.com/Pikachu_(Electric))&ast;'],
  ['http://www.pokemon.com/Pikachu_((Electric))*', 'http://www.pokemon.com/Pikachu_((Electric))&ast;'],
]);

describeEscapeBehavior('ext web autolink trailing punct', mdEscaper, [
  ['www.pokemon.com/Pikachu_((Electric))*<(', 'www.pokemon.com/Pikachu_((Electric))&ast;&lt;&lpar;'],
  ['www.pokemon.com/Pikachu_((Electric))*<~', 'www.pokemon.com/Pikachu_((Electric))<!-- -->\\*\\<\\~'],
  ['www.example.com...', 'www.example.com...'],
  ['*www.example.com@www.example.com*', '\\*www.example.com@www.example.com&ast;'],
  ['www.example.org,_x', 'www.example.org,_x'],
  ['www.example.org/~ ', 'www.example.org/~ '],
  ['www.example.org/~.', 'www.example.org/~.'],
  ['www.example.org/~~.', 'www.example.org/<!-- -->\\~~.'],
  ['www.example.org/~~~.', 'www.example.org/~~~.'],
  ['www.example.org/~', 'www.example.org/<!-- -->\\~'],
  ['www.example.org/&noop;.', 'www.example.org/&noop&semi;.'],
  ['www.example.org/,*.', 'www.example.org/,&ast;.'],
  ['https://orchi.tech/xxx<x', '<https://orchi.tech/xxx>\\<x'],
  ['https://orchi.tech/_x_<https://orchi.tech/_x_', '<https://orchi.tech/_x>\\_\\<https://orchi.tech/_x&lowbar;'],
  ['www.c.cc<www.c.cc<www.c.cc<www.c.cc<', 'www.c.cc<!-- -->\\<www.c.cc\\<www.c.cc\\<www.c.cc\\<'],
  ['<www.orchitech.cz>,<www.orchitech.cz>', '\\<www.orchitech.cz\\>,\\<www.orchitech.cz\\>'],
  ['<www.orchitech.cz>,<www.orchitech.cz><www.orchitech.cz>', '\\<www.orchitech.cz\\>,\\<www.orchitech.cz\\>\\<www.orchitech.cz\\>'],
  ['<https://orchi.tech>,<https://orchi.tech><https://orchi.tech>', '\\<<https://orchi.tech>\\>,\\<<https://orchi.tech>\\>\\<https://orchi.tech&gt;'],
  ['<(https://www.orchitech.cz)>,<https://www.orchitech.cz><https://www.orchitech.cz>', '\\<(<https://www.orchitech.cz>)\\>,\\<<https://www.orchitech.cz>\\>\\<https://www.orchitech.cz&gt;'],
  ['https://orchi.tech/news&ast;x*~ ok', '<https://orchi.tech/news&amp;ast;x>\\*~ ok'],
]);

describeEscapeBehavior('ext web autolink with chars before', mdEscaper, [
  ['~~www.example.org/~~.', '\\~~www.example.org/<!-- -->\\~~.'],
  ['_https://orchi.tech...*', '\\_https://orchi.tech...&ast;'],
  ['_www.example.org/a_(, cool', '\\_www.example.org/a_(, cool'],
  ['a_https://orchi.tech/_cool_/_', 'a\\_https://orchi.tech/_cool_/&lowbar;'],
  ['a_http://orchi.tech/_cool_/_', 'a\\_http://orchi.tech/_cool_/&lowbar;'],
  ['a_www.orchi.tech/_cool_/_', 'a\\_www.orchi.tech/_cool_/&lowbar;'],
  ['a_www.or_chi.tech/_cool_/_', 'a\\_www.or_chi.tech/\\_cool\\_/\\_'],
]);

describeEscapeBehavior('ext email autolink matching and escaping', mdEscaper, [
  ['_zdepa@pepa.cz*', '\\_zdepa@pepa.cz\\*'],
  ['pe_pa@pe_pa.cz@pe_pa.cz*', 'pe_pa@pe_pa.cz@pe_pa.cz\\*'],
  ['pepa@www.example.org,_x', 'pepa@www.example.org,\\_x'],
  ['@www.example.com/_', '@www.example.com/\\_'],
  ['xxx.www.example.com/_,x_', 'xxx.www.example.com/\\_,x\\_'], // regularly no autolink
  ['.http://example.org/,_x', '.http://example.org/,_x'], // see gfm_cmark-001
  [' .www.example.com/_,x_', ' .www.example.com/\\_,x\\_'],
]);
