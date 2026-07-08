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
