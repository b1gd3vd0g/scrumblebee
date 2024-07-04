const { isApiKey } = require('../functions');
const User = require('../mongoose/user');

// 200, 400, 401, 403, 404, 500
const handleLoginVerification = async (req, res) => {
  // 1. Ensure that API key is present and valid.
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'string') {
    // api key not found
    return res.status(403);
  }
  const token = authHeader.substring('Bearer '.length);
  if (!isApiKey(token)) {
    // api key invalid
    return res.status(401);
  }

  // 2. verify the login info.
  const username = req.body.username;
  const password = req.body.password;
  const loginAttempt = await User.verifyCredentials(username, password);
  switch (loginAttempt.code) {
    case 200:
      // success
      return res.status(loginAttempt.code).json(loginAttempt.account);
    case 400:
    case 404:
      // bad request or bad credentials
      return res.status(loginAttempt.code);
    case 500:
      // server-side error
      return res.status(loginAttempt.code).json(loginAttempt.error);
  }
};

module.exports = { handleLoginVerification };
