import { createCipheriv } from 'crypto';

export function encryptPayloadBody(data) {
  // Encryption parameters
  const algorithm = process.env.ALGORITHM; // AES Encryption with 256-bit key in CBC mode. This must be same on frontend
  const key = Buffer.from(process.env.ENCRYPT_SECRET_KEY, 'hex'); // 256-bit key. This must be same on frontend
  const iv = Buffer.from(process.env.ENCRYPT_IV, 'hex'); // 16-byte IV for AES. This must be same on frontend

  // Encrypt the response data
  const cipher = createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
}
