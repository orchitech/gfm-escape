# GfmEscape

> ...the only escaper passing backtranslation tests.

`GfmEscape` is an enterprise-grade library for transforming untagged plain text
to [CommonMark](https://spec.commonmark.org/current/) and
[GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/).

## Why GfmEscape?

There are neat and configurable markup converters like [Turndown](https://github.com/domchristie/turndown),
which even allows transforming any markup that can be converted to HTML first.

While conversion of inline and block constructs is well covered, little attention is
paid to transforming text content itself. And this is tricky especially with
non-delimited "extended" autolinks, which make escaping heavily context-dependent.

In short:
* No escaping breaks your output.
* Naive or aggressive escaping breaks your output.
* Overescaping would also break the [John Gruber's _overriding design goal for
  Markdown’s formatting syntax_](https://daringfireball.net/projects/markdown/),
  i.e. _to make it as readable as possible_ and _publishable as-is, as plain text,
  without looking like it’s been marked up with tags or formatting instructions_.

GfmEscape addresses these issues without significant performance penalty, as it
is based on [UnionReplacer](https://www.npmjs.com/package/union-replacer).
See below for more details.

## Outline

### Installation and usage

In browsers:
```html
<script src="https://unpkg.com/gfm-escape/dist/gfm-escape.umd.js" />
```

Using [npm](https://www.npmjs.com/):
```bash
npm install gfm-escape
```

In [Node.js](http://nodejs.org/):
```js
const GfmEscape = require('gfm-escape');
```

### Synopsis

```
escaper = new GfmEscape(escapingOptions[, syntax])
newStr = escaper.escape(input[, gfmContext[, metadata]])
```

A created `GfmEscape` instance is intended to be reused and shared in your code.

### Parameters

`escapingOptions`: option object defining how to perform escaping, its keys
correspond to individual replaces. When a replace option is set to any truthy
value, suboption defaults are applied and can be overriden by passed suboptions.
A single option object can be reused for instantiating escapers for
different syntaxes, some options would just render irrelevant.
The current full options are:
```js
{
  strikethrough: { // default false
    optimizeForDoubleTilde: false,
  },
  extAutolink: { // default false
     breakUrl: false,
     breakWww: false,
     breaker: '<!-- -->',
     allowedTransformations: [ 'entities', 'commonmark' ],
     allowAddHttpScheme: false
  },
  table: true, // default false
  emphasisNonDelimiters: { // default true
    maxIntrawordUnderscoreRun: false
  },
}
```
See below for more details.
 
`syntax`: suggests the syntax escaper is built for.
The predefined syntaxes are available as members of `GfmEscape.Syntax`:
- `text`: normal text, the default.
- `linkDestination`: text rendered `[sometext](here)`.
- `cmAutolink`: text rendered `<here>`. Please note that a valid CommonMark must
  contain a URI scheme, which cannot be addressed by the escaper. When deciding if
  CommonMark autolink is an appropriate construct to use, we suggest to use
  the `isEncodable(input)` and `wouldBeUnaltered(input)` methods on the
  `Syntax.cmAutolink` object.
- `codeSpan`: text rendered `` `here` ``.

`input`: the string to escape. Please note that correct escaping is currently
only guaranteed when the input is trimmed and normalized in terms of whitespace.
The library does not perform whitespace normalizing on its own, as it is often
ensured by the source's origin, e.g. `textContent` of a normalized HTML DOM.
Manual normalizing can be done with `input.trim().replace(/[ \t\n\r]+/g, ' ')`.
If it is intended to keep the source somewhat organized in lines, the minimum
treatment to make escaping safe would be `input.replace(/^[ \t\r\n]+|[ \t]+$/gm, '')`.
In such case, the caller has a responsibility to place the output correctly in
the generated document. I.e. to indent all the lines when the context requires
indenting.

`gfmContext`: extra contextual information to be considered. The contexts have
no defaults, i.e. they are falsy by default. The following contexts are available:
```js
{
  inLink: true, // indicates suppressing nested links
  inTable: true, // indicates extra escaping of table contents
}
```
When escaping, `metadata` is extra input-output parameter that collects
metadata about the actual escaping. Currently `metadata` are used for
`codeSpan` syntax, where two output parameters `delimiter` and `space` are passed:
```js
const escaper = new GfmEscape({ table: true }, GfmEscape.Syntax.codeSpan);
const x = {};
const context = { inTable: true };
const output = escaper.escape('`array|string`', context, x);
console.log(`${x.delimiter}${x.space}${output}${x.space}${x.delimiter}`);
// `` `array\|string` ``
```

#### Escaping options: `strikethrough`

Defaults to `false`, i.e. '~' is not special and it is not escaped.

Suboptions:
- `optimizeForDoubleTilde`: only eventual sequences of two tildes are escaped.
  Default `false`.

#### Escaping options: `extAutolink`

Defaults to `false`, i.e. autolinks are not detected and do not form special
case for escaping.

Suboptions:
- `breakUrl`: if a string capable of forming extended url autolink is encountered,
  it is broken to prevent that. E.g. `https://orchi.tech` becomes
  `https://<!-- -->orchi.tech`. Default `false`.
- `breakWww`: if a string capable of forming extended www autolink is encountered,
  it is broken to prevent that. E.g. `www.orchi.tech` becomes
  `www.<!-- -->orchi.tech`. Default `false`.
- `breaker`: a sequence used to break extended autolinks, used both for breaking
  and terminating. Default `<!-- -->`. Please note that some Markdown renderers
  like Redcarpet do not support HTML comments - tag sequences like `<span></span>`
  or artificial `<nolink>` can be used instead.
- `allowedTransformations`: array of transformations that are allowed if an
  extended autolink-like string needs to be transformed to retain the expected
  target and text. The order indicates priority. Defaults to
  `['entities', 'commonmark']`. Available transformations are:
  - `'keep'`: always the most preferred, no reason to set it explicitly.
  - `'entites'`: entity name references are used to escape trailing
    characters. E.g. `*http://orchi.tech,*` becomes `\*http://orchi.tech,&ast;`.
  - `'commonmark'`: a CommonMark autolink is used to delimit the actual link
    part. E.g. `*http://orchi.tech,*` becomes `\*<http://orchi.tech>,\*`.
  - `'breakup'`: autolink-like string is broken, so that it is not interpreted
    as an autolink. E.g. `*https://orchi.tech,*` becomes
    `\*https://<!-- -->orchi.tech,\*`.
  - `'breakafter'`: autolink-like string is terminated after the actual link part.
    E.g. `*https://orchi.tech,*` becomes `\*https://orchi.tech<!-- -->,\*`.
    This transformation is the default fallback, no reason to set it explicitly.
- `allowAddHttpScheme`: add `http://` scheme when a transformation needs it to
  work. E.g. `*www.orchi.tech,*` would become `\*<http://www.orchi.tech>,\*`
  with the `commonmark` transformation.

_How to choose the options_:
1. Consider rendering details of the target Markdown flavor. Backtranslation
   test should pass on text. And if a link is produced, it should match the
   input.
2. Consider user expectations. The users probably don't expect HTML comments
   all over their documents. They probably don't expect HTML entity references
   too, but see also the next point.
3. Consider declared semantics. Transforming to CommonMark autolinks looks quite
   well, but CommonMark autolinks form explicit link demarkation when the input
   was not explicitly link-demarked. `'breakafter'` might be better option in
   some situations.
4. Last, but not least - consider the origin of your input. If you transform
   HTML rendered from another markup language that supports autolinking too,
   you may expect that an autolink-suppression mechanism was used if an
   autolink-like string is encountered in plain text. Then it might be better
   to break it too.\
   And if the original renderer supports url autolinks, but not www autolinks, it
   might be better to set only `'breakUrl'`, as users may still expect www links
   to be autolinked in the plain text.

#### Escaping options: `emphasisNonDelimiters`

Defaults to `true`, i.e. intraword emphasis delimiters are not escaped if it is safe
not to escape them. E.g. in `My account is joe_average.`, the underscore stays
unescaped as `joe_average`, not ~~`joe\_average`~~.

Suboptions:
* `maxIntrawordUnderscoreRun`: if defined, it sets the maximum length of intraword
  underscores to be kept as is. E.g. for `1` and input `joe_average or joe__average`,
  the output would be `joe_average or joe\_\_average`. This is helpful for some renderers
  like Redcarpet. Defaults to `undefined`.

#### Escaping options: `table`

Defaults to `false`, i.e. table pipes are not escaped. If enabled, rendering of table
delimiter rows is suppressed by escaping its pipes and all pipes are escaped when in
table context.

## GFM escaping details

Terminology:
- *cmAutolink* - CommonMark [autolink](https://spec.commonmark.org/0.29/#autolinks)
  - *cmUriAutolink* - CommonMark [URI autolink](https://spec.commonmark.org/0.29/#uri-autolink)
  - *cmEmailAutolink* - CommonMark [email autolink](https://spec.commonmark.org/0.29/#email-autolink)
- *extAutolink* - GFM [extended autolink](https://github.github.com/gfm/#autolinks-extension-)
  - extWebAutolink - GFM extended url or www autolink
     - extUrlAutolink - GFM [extended url autolink](https://github.github.com/gfm/#extended-url-autolink)
     - extWwwAutolink - GFM [extended www autolink](https://github.github.com/gfm/#extended-www-autolink)
  - extEmailAutolink - GFM [extended email autolink](https://github.github.com/gfm/#extended-email-autolink)

Specs:
- [CommonMark](https://spec.commonmark.org/)
- [GFM](https://github.github.com/gfm/)

Reference implementations examined:
- [cmark-gfm](https://github.com/github/cmark-gfm)

## Implementation notes

### Remarks on cmark-gfm library

While [cmark-gfm](https://github.com/github/cmark-gfm) is somewhat a reference
implementation of GFM Spec, we have found a few interesting details...

- `cmark_gfm-001`: Contrary to the GFM spec stating _All such recognized autolinks
  can only come at the beginning of a line, after whitespace, or any of the
  delimiting characters \*, \_, \~, and (_, it seems this applies just to extended
  www autolinks in cmark-gfm. E.g. `.https://orchi.tech` is recognized as an
  autolink by this library. We follow this.
- `cmark_gfm-002`: Contrary to the GFM spec, extended autolinks in cmark-gfm do
  not treat `[\v\f]` as space, while CM autolinks do. We follow this.
- `cmark_gfm-003`: cmark-gfm considers `<` as valid for autolink detection and
  trims the resulting link afterwards. So `https://or_chi.tech.<` leads to
  autolinking of `https://or_chi.tech`, although this wouldn't form autolink
  without the trailing `<`. We follow this, but non-explicit extended autolink
  transformations would break the autolink detection - which is probaly good.
  E.g. with the default settings, `https://or_chi.tech.<` leads to
  `https://or_chi.tech.&lt;` (wouldn't be detected as extended autolink by
  cmark-gfm), while `https://or_chi.tech.<~` leads to
  `<https://or_chi.tech>\<\~` (forced CM autolink).
- `cmark_gfm-004`: GFM spec says _If an autolink ends in a semicolon (;), we
  check to see if it appears to resemble an entity reference; if the preceding
  text is & followed by one or more alphanumeric characters. If so, it is
  excluded from the autolink..._ Alphabetic references cmark-gfm 
- `cmark_gfm-005`: Backslash escape in link destination, e.g.
  `[foo](http://orchi.tech/foo\&lowbar;bar)` does not prevent entity reference
  from interpreting in rendered HTML. We use entity encoding instead, i.e. `&amp;`.

## TODO

- Minification for browsers.
- Complete and polish implementation remarks.
