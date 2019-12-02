const request = require('request');
const jsesc = require('jsesc');
const fs = require('fs');
const path = require('path');

// https://spec.commonmark.org/0.29/#entity-references
const ENTITIES_URL = 'https://html.spec.whatwg.org/entities.json';

const requestOptions = {
  url: ENTITIES_URL,
  json: true,
};

const outputName = path.basename(__filename, '.js').replace(/^build-/, '');

const alphaEntityName = (ent) => {
  const aplhaMatch = ent.match(/^&([a-z]+);$/i);
  return aplhaMatch && aplhaMatch[1];
};

const allowedCharacters = (ch) => (ch.length === 1 ? ch : null);

const lowerCount = (str) => {
  const matches = str.match(/[a-z]/g);
  return matches ? matches.length : 0;
};

const shouldBePicked = (ch, name1, name0) => {
  if (!name0) {
    // Always assign missing characters.
    return true;
  }
  if (name1.length !== name0.length) {
    // Prefer shorter entity names
    return name1.length < name0.length;
  }
  // Prefer more lowercase-ish variants
  return lowerCount(name1) > lowerCount(name0);
};

const formatObject = (o) => {
  const stringified = jsesc(o);
  const ENTRY_RE = /(^\{)|((?:\w+|'(?:\\.|[^'])*'):(?:\w+|'(?:\\.|[^'])*')(?=,))|(\}$)/g;
  const LINE_WRAP = 100;
  let lineStartOffset = 0;
  return stringified.replace(ENTRY_RE, (m, open, entry, close, offset) => {
    if (open) {
      lineStartOffset = offset + m.length;
      return `${open}\n`;
    }
    if (close) {
      lineStartOffset = offset;
      return `,\n${close}`;
    }
    const lineLength = offset - lineStartOffset + m.length;
    if (lineLength > LINE_WRAP) {
      lineStartOffset = offset;
      return `\n${entry}`;
    }
    return m;
  });
};

const writeTo = (name, contents) => {
  const file = path.join(__dirname, '..', 'output', `${name}.js`);
  fs.writeFileSync(file, contents);
};

const processEntities = (entities) => {
  const charEntMap = {};
  Object.entries(entities).forEach(([entref, entry]) => {
    const ch = allowedCharacters(entry.characters);
    const entName = alphaEntityName(entref);
    if (ch && entName && shouldBePicked(ch, entName, charEntMap[ch])) {
      charEntMap[ch] = entName;
    }
  });
  const out = `export default ${formatObject(charEntMap)};\n`;
  writeTo(outputName, out);
};

request(requestOptions, (error, response, entities) => {
  if (error || response.statusCode !== 200) {
    throw new Error(`Cannot load entities.json (error=${error}, code=${response.statusCode})`);
  }
  processEntities(entities);
});
