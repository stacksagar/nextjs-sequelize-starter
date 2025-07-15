/**
 * Generates a random 6-digit verification code
 * @returns {string} A 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    ?.toUpperCase();
}
