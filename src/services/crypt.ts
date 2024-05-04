import crypto from "crypto";

const key = crypto
  .createHash("sha512")
  .update(process.env.SECRET_KEY || "")
  .digest("hex")
  .substring(0, 32);

const encryptionIV = (secret_iv: string) =>
  crypto.createHash("sha512").update(secret_iv).digest("hex").substring(0, 16);

const method = process.env.ENCRYPTION_METHOD || "aes-256-cbc";

export function encrypt(plainText: string) {
  const iv = crypto.randomBytes(16).toString("hex");
  const cipher = crypto.createCipheriv(method, key, encryptionIV(iv));
  return {
    encryptedText: Buffer.from(cipher.update(plainText, "utf8", "hex") + cipher.final("hex")).toString("base64"),
    salt: iv,
  };
}

export function decrypt(encryptedText: string, hashIV: string) {
  const buff = Buffer.from(encryptedText, "base64");
  const decipher = crypto.createDecipheriv(method, key, encryptionIV(hashIV));
  return decipher.update(buff.toString("utf8"), "hex", "utf8") + decipher.final("utf8");
}
