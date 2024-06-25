const jwt = require('jsonwebtoken');
const { isApiKey, meetsExpectations } = require('./functions');

const router = require('express').Router();

/** Checks the authorization header  */
router.get('/', (req, res) => {
  // 1. verify api key.
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
      message: 'invalid api key.'
    });
  }
  // The api key is valid!

  // 2. check out value token
  const secret = process.env.SCRUMBLEBEE_SECRET;
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
    if (!req.body.expected) {
      return res.status(200).json({ pass: true });
    }
    const expectations = req.body.expected;
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
router.post('/', (req, res) => {
  // 1. verify api key.
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
      message: 'invalid api key.'
    });
  }
  // The api key is valid!

  // 2. create a new token.
  if (!req.body.payload) {
    return res.status(400).json({
      success: false,
      message: 'no payload was included!'
    });
  }
  const payload = req.body.payload;
  const secret = process.env.SCRUMBLEBEE_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: 3_600 });
  return res.status(200).json({ success: true, token: token });
});

module.exports = router;
