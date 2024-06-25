const jwt = require('jsonwebtoken');

const isApiKey = (token) => {
  try {
    const verification = jwt.verify(token, process.env.API_KEY_SECRET);
    return (
      // ensure equality.
      verification.a === process.env.API_KEY_A &&
      verification.b === process.env.API_KEY_B &&
      verification.c === process.env.API_KEY_C &&
      verification.d === process.env.API_KEY_D
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

module.exports = { isApiKey, meetsExpectations };
