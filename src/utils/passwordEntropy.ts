/**
 * Calculates Shannon-style password entropy in bits: E = log2(R^L).
 *
 * The pool size R grows by each character class the password actually uses
 * (26 lowercase, 26 uppercase, 10 digits, 32 symbols), so a password drawing
 * from more classes gets more entropy at the same length.
 *
 * @param pwd - Raw password to analyze; never logged or stored.
 * @returns Entropy in bits rounded to 2 decimals, or 0 for an empty password.
 */
export const calculateEntropy = (pwd: string) => {
  if (!pwd) return 0;
  let poolSize = 0;
  if (/[a-z]/.test(pwd)) poolSize += 26;
  if (/[A-Z]/.test(pwd)) poolSize += 26;
  if (/[0-9]/.test(pwd)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 32;
  const result = pwd.length * Math.log2(poolSize);
  return parseFloat(result.toFixed(2));
};
