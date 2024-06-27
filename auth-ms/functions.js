const jwt = require('jsonwebtoken');

const isApiKey = (token) => {
  try {
    const verification = jwt.verify(token, process.env.AUTH_API_SECRET);
    return (
      // ensure equality.
      verification.a === process.env.AUTH_API_A &&
      verification.b === process.env.AUTH_API_B &&
      verification.c === process.env.AUTH_API_C &&
      verification.d === process.env.AUTH_API_D
    );
  } catch (e) {
    // could not decode the token
    return false;
  }
};

const meetsExpectations = (obj, expectations) => {
  const mismatch = [];
  Object.keys(expectations).forEach((key) => {
    if (expectations[key] !== obj[key]) {
      mismatch.push(key);
    }
  });
  return { success: mismatch.length === 0, mismatch: mismatch };
};

/**
 * Takes a string and returns it 'prettier' - that is,
 * extra whitespace between words and along edges is removed.
 * @param {string} input The string to be prettified
 * @returns A prettier version of that string, or undefined for empty strings
 * and nonstring input.
 */
const prettify = (input) => {
  // type check
  if (typeof input !== 'string' || input === '') return undefined;
  // trim additional whitespace from edges
  const trimmed = input.trim();
  if (!trimmed.length) return undefined;
  // get rid of extra spaces
  return trimmed.replace(/\s+/g, ' ');
};

module.exports = { isApiKey, meetsExpectations, prettify };
