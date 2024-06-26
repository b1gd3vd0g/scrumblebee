const jwt = require('jsonwebtoken');

const isApiKey = (token) => {
  try {
    const payload = jwt.verify(token, process.env.LOGIN_API_SECRET);
    console.log('payload of login api key: \n', payload);
    return (
      // ensure equality.
      payload.a === process.env.LOGIN_API_A &&
      payload.b === process.env.LOGIN_API_B &&
      payload.c === process.env.LOGIN_API_C &&
      payload.d === process.env.LOGIN_API_D
    );
  } catch (e) {
    // could not decode the token
    return false;
  }
};

module.exports = { isApiKey };
