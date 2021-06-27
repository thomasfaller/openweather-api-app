import { outputTemp, outputTempDiff } from "./tempUtils";

describe("Testing Temp Utilities", () => {
  it("return formatted output of temperature", () => {
    const output = "10 °C";
    expect(outputTemp(10)).toEqual(output);
  });
  it("returns loading... if temperature is not set", () => {
    const output = "loading...";
    expect(outputTemp("")).toEqual(output);
  });
  it("return erroneously formatted output of temperature", () => {});
});
