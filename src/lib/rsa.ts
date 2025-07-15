import { publicEncrypt, privateDecrypt } from "crypto";

// Decode RSA keys from base64 format to PEM format
const publicKey = Buffer.from(process.env.RSA_PUBLIC_KEY!, "base64").toString(
  "utf8"
);
const privateKey = Buffer.from(process.env.RSA_PRIVATE_KEY!, "base64").toString(
  "utf8"
);

export function encryptWithRSA(data: string): string {
  const buffer = Buffer.from(data, "utf8");
  const encrypted = publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
}

export function decryptWithRSA(encryptedData: string): string {
  const buffer = Buffer.from(encryptedData, "base64");
  const decrypted = privateDecrypt(privateKey, buffer);
  return decrypted.toString("utf8");
}
