import ALPHA_ENTITY_REFERENCES from '../../tools/output/alpha-entity-references';

export default function toAlphaEntityReference(c) {
  const ent = ALPHA_ENTITY_REFERENCES[c];
  if (ent) {
    return `&${ent};`;
  }
  return null;
}
