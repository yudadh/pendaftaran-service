import crypto from "crypto"
import { env } from "../config/envConfig";
const secretKeyHex = env.SECRET_CRYPTO_KEY
const iv = crypto.randomBytes(16);

// Encrypt
export function encryptId(id: number) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKeyHex, 'hex'), iv);
  let encrypted = cipher.update(id.toString());
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// Decrypt
export function decryptId(encryptedId: string) {
  const [ivHex, encryptedText] = encryptedId.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKeyHex, 'hex'), Buffer.from(ivHex, 'hex'));
  let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

