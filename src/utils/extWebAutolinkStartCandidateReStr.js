import autolinkedSchemeReStr from './autolinkedSchemeReStr';
import autolinkedWwwReStr from './autolinkedWwwReStr';

export default `(?:${autolinkedSchemeReStr}|${autolinkedWwwReStr})`
  + '[^\\s\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]';
