function itProducesExpectedOutput(input, expected) {
  let inputStr = input;
  let gfmContext = {};
  if (Array.isArray(input)) {
    [inputStr, gfmContext] = input;
    gfmContext = gfmContext || {};
  }
  it(`produces '${expected}'`, (function expectEscapeToBe() {
    expect(this.subject.escape(inputStr, gfmContext)).toBe(expected);
  }));
}

module.exports = itProducesExpectedOutput;
