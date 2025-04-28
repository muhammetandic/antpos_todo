import { describe, it, expect, beforeAll } from "vitest";
import { encrypt, decrypt } from "./crypt";

describe("encrypt", () => {
  it("should encrypt the plain text", () => {
    const result = encrypt("test");
    expect(result?.encryptedText).toBeDefined();
    expect(result?.salt).toBeDefined();
  });

  it("should encrypt different plain text inputs", () => {
    const result1 = encrypt("test1");
    const result2 = encrypt("test2");
    expect(result1?.encryptedText).not.toEqual(result2?.encryptedText);
  });

  it("should handle empty plain text input", () => {
    const result = encrypt("");
    expect(result?.encryptedText).toBeUndefined();
    expect(result?.salt).toBeUndefined();
  });
});

describe("decrypt", () => {
  const plainText: string = "test";
  let hash: string = "";
  let salt: string = "";

  beforeAll(() => {
    const result = encrypt(plainText);
    hash = result?.encryptedText as string;
    salt = result?.salt as string;
  });

  it("should decrypt hash and salt", () => {
    const decrypted = decrypt(hash, salt);
    expect(decrypted).toBeDefined();
  });

  it("should be return plain text after decrypting", () => {
    const decrypted = decrypt(hash, salt);
    expect(decrypted).toEqual(plainText);
  });

  it("should handle empty hash or salt", () => {
    const result1 = decrypt("", "");
    const result2 = decrypt(hash, "");
    const result3 = decrypt("", salt);
    expect(result1).toBeNull();
    expect(result2).toBeNull();
    expect(result3).toBeNull();
  });

  it("should handle wrong hash and salt", () => {
    expect(() => {
      decrypt("wrongHash", salt);
    }).toThrow("Decryption failed");
    expect(() => {
      decrypt(hash, "wrongSalt");
    }).toThrow("Decryption failed");
    expect(() => {
      decrypt("wrongHash", "wrongSalt");
    }).toThrow("Decryption failed");
  });
});
