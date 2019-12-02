const failMsg = (render, pass, phrase) => {
  const imperative = pass ? 'not to' : 'to';
  const expectMsg = `Expected '${render.md}' ${imperative} ${phrase}`;
  const whileMsg = `while it was rendered as '${render.node.outerHTML}'`;
  return `${expectMsg}, ${whileMsg}`;
};

const normalizeSpace = (str) => str.trim().replace(/[ \t\r\n]+/g, ' ');

const stripAddedScheme = (dest, text) => {
  if (dest.startsWith('http://www.') && text.startsWith('www.')) {
    return dest.replace(/^http:\/\//, '');
  }
  if (dest.startsWith('mailto:') && !text.startsWith('mailto:')) {
    return dest.replace(/^mailto:/, '');
  }
  return dest;
};

module.exports = {
  toContainNonLinkElements: () => ({
    compare: (render) => {
      const pass = render.selectCount('.//*[not(self::a)]') > 0;
      return {
        pass,
        message: failMsg(render, pass, 'contain any non-link elements'),
      };
    },
  }),
  toHaveSingleChildNode: () => ({
    compare: (render) => {
      const pass = render.node.childNodes.length === 1;
      return {
        pass,
        message: failMsg(render, pass, 'have single child node'),
      };
    },
  }),
  toHaveSameTextContentAs: () => ({
    compare: (render, expected) => {
      const pass = normalizeSpace(render.node.textContent) === normalizeSpace(expected);
      return {
        pass,
        message: failMsg(render, pass, `render the same text as '${expected}'`),
      };
    },
  }),
  toHaveLinks: () => ({
    compare: (render, expected) => {
      const links = render.select('.//a').map((link) => link.getAttribute('href'));
      let pass;
      let expectedStr;
      if (expected === undefined) {
        pass = links.length > 0;
        expectedStr = pass ? 'any' : 'some'; // grammar police
      } else if (Array.isArray(expected)) {
        expectedStr = `[${decodeURIComponent(expected.join(', '))}]`;
        pass = `[${decodeURIComponent(links.join(', '))}]` === expectedStr;
      } else {
        pass = links.length === expected;
        expectedStr = links.length;
      }
      return {
        pass,
        message: failMsg(render, pass, `render with ${expectedStr} links`),
      };
    },
  }),
  toHaveLinkTextsFrom: () => ({
    compare: (render, expected) => {
      const uriDecodedInput = decodeURIComponent(expected);
      const pass = render.select('.//a').reduce((acc, link) => {
        const text = link.textContent;
        return acc && uriDecodedInput.includes(decodeURI(text));
      }, true);
      return {
        pass,
        message: failMsg(render, pass, `render with autolinks seen in '${expected}'`),
      };
    },
  }),
  toHaveLinkTextsSameAsDestinations: () => ({
    compare: (render) => {
      const pass = render.select('.//a').reduce((acc, link) => {
        const text = link.textContent;
        const dest = stripAddedScheme(link.getAttribute('href'), text);
        return acc && decodeURI(text) === decodeURI(dest);
      }, true);
      return {
        pass,
        message: failMsg(render, pass, 'have link texts same as their destinations'),
      };
    },
  }),
};
