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
 * This method is going to create a new session
 * (provided the login information is correct).
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

module.exports = router;
