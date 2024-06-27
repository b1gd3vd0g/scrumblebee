const router = require('express').Router();

// import some helpful functions
const { prettify } = require('./functions');
const paths = require('./paths');

const HEADERS = {
  authorization: `Bearer ${process.env.AUTH_API_KEY}`,
  'Content-Type': 'application/json'
};

/**
 * POST: /session
 * This method takes a username and password combo and passes it to the auth-ms
 * to receive a session token, valid for 60 minutes. This token contains the
 * username and uid of the logged-in account.
 * Creates session variables 'token', 'username', and 'uid'.
 */
router.post('/', async (req, res) => {
  // 1. Ensure that username and password have been provided.
  const username = prettify(req.body.username);
  const password = prettify(req.body.password);
  if (!(username && password)) {
    return res.status(400).json({
      message: 'missing req.body.username or req.body.password'
    });
  }

  // 2. Request to start a session!
  const login = { username: username, password: password };
  try {
    const response = await fetch(paths.AUTH, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(login)
    });
    const obj = await response.json();
    // Now, we deal with the response.
    switch (response.status) {
      case 200:
        // authentication was successful!!
        req.session.token = obj.token;
        req.session.username = obj.username;
        req.session.uid = obj.uid;
        return res.status(200).json({});
      case 400:
      case 401:
      case 403:
      case 500:
        return res.status(response.status).json(obj);
      default:
        throw new Error(
          'Unexpected response status received from auth microservice: ' +
            response.status
        );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'server-side error!',
      error: err
    });
  }
});

/**
 * GET: /session
 * This method takes the session information and passes it to the auth-ms to
 * make sure that the token is unexpired, and the payload coincides with the
 * session information.
 */
router.get('/', async (req, res) => {
  // 1. ensure that there is valid session information.
  const username = prettify(req.session.username);
  const uid = prettify(req.session.uid);
  const token = prettify(req.session.token);
  if (!(username && uid && token)) {
    return res
      .status(404)
      .json({ message: 'no session information was found.' });
  }

  // 2. request token validation from the auth-ms
  const queryString = `?username=${username}&uid=${uid}`;
  try {
    const response = await fetch(`${paths.AUTH}${queryString}`, {
      method: 'GET',
      headers: {
        ...HEADERS,
        scrumblebee: `Bearer ${token}`
      }
    });
    const obj = await response.json();
    switch (response.status) {
      case 200:
        return res.status(200).json({});
      case 400:
      case 401:
      case 403:
        return res.status(response.status).json(obj);
      default:
        throw new Error(
          'Unexpected response status received from auth microservice: ' +
            response.status
        );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'server-side error!', error: err });
  }
});

/**
 * DELETE: /session
 * This method ends any request session.
 */
router.delete('/', async (req, res) => {
  req.session.destroy();
  return res.status(200).json({});
});

module.exports = router;
