const jwt = require('jsonwebtoken');
const { isApiKey, meetsExpectations } = require('./functions');

const router = require('express').Router();

/**
 * GET: [server]:4042?username=b1gd3vd0g
 *
 * This function is only accessible to other scrumblebee microservices
 * (requires API key).
 *
 *
 */
router.get('/', (req, res) => {
  // 1. verify api key.
  // The api key should be found in the 'authorization' header.
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'string') {
    return res.status(403).json({
      pass: false,
      message: 'api key missing for the auth microservice'
    });
  }
  // extract actual token
  const apiKey = authHeader.substring('Bearer '.length);
  const validApiKey = isApiKey(apiKey);
  if (!validApiKey) {
    return res.status(403).json({
      pass: false,
      message: 'invalid api key for the auth microservice'
    });
  }
  // The api key is valid!

  // 2. check out value token
  const secret = process.env.AUTH_TOKEN_SECRET;
  const tokenHeader = req.headers['token'];
  if (typeof tokenHeader !== 'string') {
    return res.status(400).json({
      pass: false,
      message: 'token header not found - nothing to verify.'
    });
  }
  const token = tokenHeader.substring('Bearer '.length);
  try {
    // get the payload of the token
    const verification = jwt.verify(token, secret);
    console.log(req.query);
    if (!req.query) {
      return res.status(200).json({ pass: true });
    }
    const expectations = req.query ?? {};
    const matches = meetsExpectations(verification, expectations);
    if (matches.success) {
      return res.status(200).json({
        pass: true
      });
    }
    return res.status(401).json({
      pass: false,
      message: 'info stored in token does not match up with expected values.',
      mismatch: matches.mismatch
    });
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({
        pass: false,
        message: 'expired token! sign in again!'
      });
    } else {
      return res.status(401).json({
        pass: false,
        message: e.message
      });
    }
  }
});

/** Returns a token valid for 60 minutes */
router.post('/', async (req, res) => {
  // 0. verify api key.
  // The api key should be found in the 'authorization' header.
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'string') {
    return res.status(403).json({
      pass: false,
      message: 'authorization header not found.'
    });
  }
  // extract actual token
  const apiKey = authHeader.substring('Bearer '.length);
  const validApiKey = isApiKey(apiKey);
  if (!validApiKey) {
    return res.status(403).json({
      pass: false,
      message: 'invalid api key. auth-ms/'
    });
  }
  // The api key is valid!

  // 1. test the username and password for correctness.
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: 'either username or password is missing.'
    });
  }
  const response = await fetch('http://localhost:4044/auth/login', {
    headers: {
      authorization: `Bearer ${process.env.LOGIN_API_KEY}`,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      username: req.body.username,
      password: req.body.password
    })
  });
  const correctness = await response.json();
  console.log(correctness);
  if (!correctness.success) {
    return res.status(401).json({ success: false, message: 'login failed' });
  }
  // 2. create a new token.
  const payload = { username: correctness.username, uid: correctness.uid };
  const secret = process.env.AUTH_TOKEN_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: 3_600 });
  return res.status(200).json({ success: true, token: token });
});

module.exports = router;
