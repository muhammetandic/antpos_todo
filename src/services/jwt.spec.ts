import { createJwtToken, verifyJwtToken } from "./jwt";

describe("createJwtToken", () => {
  const userId = "132165465abf";
  const email = "test@example.com";
  const expireDurationThirtyMinutes = 30 * 60 * 1000;
  it("should throw error if secretOrPrivateKey is blank", () => {
    // mocking process.env.JWT_SECRET as blank
    process.env.JWT_SECRET = "";

    expect(() => {
      createJwtToken(userId, email, expireDurationThirtyMinutes);
    }).toThrow("secretOrPrivateKey must have a value");
  });

  it("should create a JWT token", () => {
    // mocking process.env.JWT_SECRET
    process.env.JWT_SECRET = "test-secret";

    const token = createJwtToken(userId, email, expireDurationThirtyMinutes);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });
});

describe("verifyJwtToken", () => {
  const userId = "132165465abf";
  const email = "test@example.com";
  const expireDurationThirtyMinutes = 30 * 60 * 1000;
  let token = "";

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    token = createJwtToken(userId, email, expireDurationThirtyMinutes);
  });

  it("should verify a JWT token", () => {
    const verifiedToken = verifyJwtToken(token);
    expect(verifiedToken).toBeDefined();
    expect(typeof verifiedToken).toBe("object");
  });
});
