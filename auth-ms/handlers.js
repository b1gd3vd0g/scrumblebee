const jwt = require('jsonwebtoken');
const { isApiKey, prettify } = require('./functions');
const paths = require('./paths');

const HEADERS = {
  authorization: `Bearer ${process.env.LOGIN_API_KEY}`,
  'Content-Type': 'application/json'
};

const handleSessionGeneration = async (req, res) => {
  console.log('called handleLogin');
  // 1. Ensure that API key is present and valid.
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'string') {
    return res.status(403).json({ message: 'no api key was found!' });
  }
  const token = authHeader.substring('Bearer '.length);
  if (!isApiKey(token)) {
    return res.status(403).json({ message: 'auth-ms: api key is invalid!' });
  }

  // 2. Ensure that username and password have been provided.
  const username = prettify(req.body.username);
  const password = prettify(req.body.password);
  if (!(username && password)) {
    return res
      .status(400)
      .json(paths.AUTH + '/: missing username or password.');
  }

  // 3. Request verification of username and password!
  const login = { username: username, password: password };
  try {
    const response = await fetch(`${paths.USER}/verify`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(login)
    });
    const obj = await response.json();
    // Now, we deal with the response.
    switch (response.status) {
      case 200:
        // Now, we need to make a jwt.
        const payload = { username: obj.username, uid: obj.uid };
        const token = jwt.sign(payload, process.env.SESSION_TOKEN_SECRET);
        // return session info and token. success.
        return res.status(200).json({ ...payload, token: token });
      case 400:
      case 401:
      case 403:
      case 500:
        return res.status(response.status).json(obj);
      default:
        throw new Error(
          'Unexpected response status received from user microservice: ' +
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
};

const handleSessionValidation = async (req, res) => {
  // 1. Ensure that API key is present and valid.
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'string') {
    return res.status(403).json({ message: 'no api key was found!' });
  }
  const token = authHeader.substring('Bearer '.length);
  if (!isApiKey(token)) {
    return res.status(403).json({ message: 'api key is invalid!' });
  }

  // 2. Ensure contents are provided.
  const username = prettify(req.query.username);
  const uid = prettify(req.query.uid);
  const scrumblebeeHeader = prettify(req.headers.scrumblebee);
  if (!username || !uid || !scrumblebeeHeader) {
    return res
      .status(400)
      .json({ message: 'missing username, uid, or scrumblebee header.' });
  }

  // 3. Ensure token is valid.
  const scrToken = scrumblebeeHeader.substring('Bearer '.length);
  try {
    const payload = jwt.verify(scrToken, process.env.SESSION_TOKEN_SECRET);
    if (uid !== payload.uid || username !== payload.username) {
      return res.status(401).json({
        message: 'token information does not match query parameters!'
      });
    }
    // if we're here, the token is indeed valid.
    return res.status(200).json({});
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'token is expired!' });
    }
    return res.status(401).json({ message: 'token cannot be parsed.' });
  }
};

module.exports = {
  handleSessionGeneration,
  handleSessionValidation
};
