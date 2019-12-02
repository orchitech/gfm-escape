export default function mergeOpts(opts, key, defaults, defaultEnabled) {
  const myOpts = opts[key];
  if (!myOpts && (!defaultEnabled || myOpts !== undefined)) {
    return false;
  }
  /* eslint-disable-next-line no-param-reassign */
  opts[key] = typeof opts[key] === 'object'
    ? { ...defaults, ...opts[key] }
    : defaults;
  return true;
}
