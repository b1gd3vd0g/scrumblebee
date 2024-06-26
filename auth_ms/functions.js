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

module.exports = { isApiKey, meetsExpectations };
