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

module.exports = { prettify };
