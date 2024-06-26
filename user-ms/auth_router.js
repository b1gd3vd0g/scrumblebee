const router = require('express').Router();

const { User } = require('./models');
const { authenticateUserLogin } = require('./user_funcs');
const { hash } = require('./hashing');
const { prettify } = require('./validators');

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  authorization: `Bearer ${process.env.AUTH_API_KEY}`
};

router.use('/login', require('./login_router'));

// get the authentication status of a token you have.
router.get('/', async (req, res) => {
  const token = req.session.token;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'session token does not exist'
    });
  }

  const queryString = req.query
    ? ((query) => {
        let str = '';
        const keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
          if (i === 0) str += '?';
          str += keys[i];
          str += '=';
          str += query[keys[i]];
          if (i + 1 < keys.length) str += '&';
        }
        return str;
      })(req.query)
    : '';
  // ensure that the token is valid.
  const validationResponse = await fetch(
    `http://localhost:4042${queryString}`,
    {
      headers: {
        ...DEFAULT_HEADERS,
        token: `Bearer ${token}`
      },
      method: 'GET'
    }
  );
  const validation = await validationResponse.json();
  if (validation.success) {
    return res.status(200).json(validation);
  }
  return res.status(validationResponse.status).json(validation);
});

// Start a session and get a token verifying that you are logged in.
router.post('/', async (req, res) => {
  const un = prettify(req.body.username) ?? '';
  const pw = prettify(req.body.password) ?? '';
  if (!un || !pw || typeof un !== 'string' || typeof pw !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'bad request! username or password not provided!'
    });
  }

  //console.log(un, pw);

  // You have the username and password.
  // Now, this server (the user microservice) needs to send it to the auth
  // microservice, so that it can test with our private '/verify' function and
  // then provide us with a token!
  const response = await fetch('http://localhost:4042', {
    headers: {
      authorization: `Bearer ${process.env.AUTH_API_KEY}`,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      username: un,
      password: pw
    })
  });
  const obj = await response.json();
  if (!obj.success) {
    return res.status(response.status).json(obj);
  }
  // we logged in successfully! Now we need to set the session info!
  req.session.token = obj.token;
  req.session.uid = obj.uid;
  req.session.username = obj.username;
  return res
    .status(200)
    .json({ success: true, username: obj.username, uid: obj.uid });
});

router.delete('/', async (req, res) => {
  // Sign out. Delete the jwt from the header.
  if (req.session) req.session.destroy();
  return res.status(200).json({ success: true });
});

module.exports = router;
