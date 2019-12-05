export default function applyProcessors(input, processors) {
  return processors.reduce((str, proc) => (proc.call(this, str)), input);
}
