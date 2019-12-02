const { Syntax: { cmAutolink } } = require('../dist/gfm-escape.cjs');

describe('unaltered CM autolink', () => {
  [
    'http://www.orchi.tech',
    'http://www.orchi.tech/foo/',
    'http://www.orchi.tech/foo&bar=1',
  ].forEach((str) => {
    it(`is possible to put '${str}' to autolink unaltered`, () => {
      expect(cmAutolink.isEncodable(str)).toBeTruthy();
      expect(cmAutolink.wouldBeUnaltered(str)).toBeTruthy();
    });
  });

  [
    'www.orchi.tech',
    'http:/orchi.tech',
    'xttp://orchi.tech',
    '://orchi.tech',
  ].forEach((str) => {
    it(`is not possible to make autolink from '${str}'`, () => {
      expect(cmAutolink.isEncodable(str)).toBeFalsy();
    });
  });

  [
    'HTTP://orchi.tech',
    'HtTpS://orchi.tech',
    'FTP://kernel.org',
  ].forEach((str) => {
    it(`is possible to make autolink from '${str}'`, () => {
      expect(cmAutolink.isEncodable(str)).toBeTruthy();
    });
  });

  [
    'http://www.orchi.tech/foo bar/',
    'http://www.orchi.tech/foo&amp;bar/',
    'http://www.orchi.tech/foo&frac12;bar/',
    'http://www.orchi.tech/foo<bar/',
  ].forEach((str) => {
    it(`is likely not possible to put '${str}' to autolink unaltered`, () => {
      expect(cmAutolink.wouldBeUnaltered(str)).toBeFalsy();
    });
  });
});
