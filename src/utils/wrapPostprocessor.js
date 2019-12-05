export default function wrapPostprocessor(processFn, postProcessFn) {
  return function wrapper() {
    // eslint-disable-next-line prefer-rest-params
    return postProcessFn.call(this, processFn.apply(this, arguments));
  };
}
