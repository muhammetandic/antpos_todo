import { createCode } from "./random-code-generator";

describe("code generator", () => {
  it("should generate six digit code in string form", () => {
    const code = createCode();
    expect(code.length).toBe(6);
  });

  it("should'nt generate null value", () => {
    const code = createCode();
    expect(code).not.toBeNull();
  });

  it("should generate only numbers", () => {
    const code = createCode();
    expect(code).toMatch(/^\d+$/);
  });
});
