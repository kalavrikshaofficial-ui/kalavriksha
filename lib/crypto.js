import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
// Secret key – 32 bytes for AES-256. Change this in production!
const SECRET_KEY = 'KalaVriksha2026SecretKey12345678'; // exactly 32 chars
const IV_LENGTH = 16; // AES block size

/**
 * Encrypt a plain-text password.
 * Returns a string in the format  iv:encryptedData  (both hex-encoded).
 */
export function encryptPassword(plainText) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'utf-8'), iv);
  let encrypted = cipher.update(plainText, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt an encrypted password back to plain text.
 * Expects the  iv:encryptedData  format produced by encryptPassword().
 */
export function decryptPassword(encryptedText) {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'utf-8'), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

/**
 * Check whether a string looks like it was encrypted by encryptPassword().
 * Encrypted strings match the pattern   <32 hex chars>:<hex chars>
 */
export function isEncrypted(value) {
  return /^[0-9a-f]{32}:[0-9a-f]+$/.test(value);
}
