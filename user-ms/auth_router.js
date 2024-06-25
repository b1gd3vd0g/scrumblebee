const router = require('express').Router();

const { User } = require('./models');
const { authenticateUserLogin } = require('./user_funcs');
const { hash } = require('./hashing');

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  authorization: `Bearer ${process.env.AUTH_API_KEY}`
};

// get the authentication status of a token you have.
router.get('/', async (req, res) => {
  const token = req.session.token;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'session token does not exist'
    });
  }
  // ensure that the token is valid.
  const validationResponse = await fetch('http://localhost:4042', {
    headers: {
      ...DEFAULT_HEADERS,
      token: `Bearer ${token}`
    },
    method: 'GET',
    requestBody: JSON.stringify({
      // make sure that the jwt is FOR the account we're signed into.
      expected: {
        uid: req.session.uid,
        username: req.session.username
      }
    })
  });
  const validation = await validationResponse.json();
  if (validation.success) {
    return res.status(200).json(validation);
  }
  return res.status(validationResponse.status).json(validation);
});

// Start a session and get a token verifying that you are logged in.
router.post('/', async (req, res) => {
  const un = req.body.username;
  const pw = req.body.password;
  if (!un || !pw || typeof un !== 'string' || typeof pw !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'bad request! username or password not provided!'
    });
  }
  // find the account
  const acct =
    (await User.findOne({ username: un })) ||
    (await User.findOne({ email: un }));
  const badLogin = {
    success: false,
    message: 'input did not match our records!'
  };
  if (!acct) return res.status(401).json(badLogin);
  // account exists. verify password.
  const hashedPw = hash(pw, acct.salt);
  if (hashedPw !== acct.password) return res.status(401).json(badLogin);
  // passwords match!
  // call authentication API
  try {
    // request a token
    const response = await fetch('http://localhost:4042', {
      headers: DEFAULT_HEADERS,
      method: 'POST',
      body: JSON.stringify({
        payload: {
          uid: acct._id,
          username: acct.username
        }
      })
    });
    const outcome = await response.json();
    if (outcome.success) {
      // set the session info
      req.session.token = outcome.token;
      req.session.uid = acct._id;
      req.session.username = acct.username;
      return res.status(200).json({
        success: true,
        message: `session started for ${acct.username}`,
        uid: acct._id
      });
    }
    return res.status(500).json(outcome);
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'error contacting auth api',
      error: e
    });
  }
});

router.delete('/', async (req, res) => {
  // Sign out. Delete the jwt from the header.
  if (req.session) req.session.destroy();
  return res.status(200).json({ success: true });
});

module.exports = router;
