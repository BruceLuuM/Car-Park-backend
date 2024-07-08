import { createDecipheriv } from 'crypto';

export function decryptPayloadBody(payload, method) {
  // Decryption parameters
  const algorithm = process.env.ALGORITHM; // AES Decryption with 256-bit key in CBC mode. This must be same on frontend
  const key = Buffer.from(process.env.ENCRYPT_SECRET_KEY, 'hex'); // 256-bit key. This must be same on frontend
  const iv = Buffer.from(process.env.ENCRYPT_IV, 'hex'); // 16-byte IV for AES. This must be same on frontend
  // Decryption
  const decipher = createDecipheriv(algorithm, key, iv);
  let decryptedPayload = decipher.update(payload, 'hex', 'utf8');
  decryptedPayload += decipher.final('utf8');
  //if method is POST PUT DELETE then return body else do rest things for GET Req
  if (method !== 'GET') {
    return JSON.parse(decryptedPayload);
  }
  // Parse the query string into an object
  const queryParams = new URLSearchParams(decryptedPayload);
  const queryParamsObject = {};
  for (const [key, value] of queryParams.entries()) {
    queryParamsObject[key] = value;
  }
  return queryParamsObject;
}
