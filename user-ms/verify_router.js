const router = require('express').Router();

const { isApiKey, prettify } = require('./functions');
const { authenticateUserLogin } = require('./user_funcs');

router.post('/', async (req, res) => {
  // 1. Ensure that API key is present and valid. (403 exit)
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'string') {
    return res.status(403).json({ message: 'no api key was found!' });
  }
  const token = authHeader.substring('Bearer '.length);
  if (!isApiKey(token)) {
    return res.status(403).json({ message: 'api key is invalid!' });
  }

  // 2. Ensure that username and password have been provided. (400 exit)
  const username = prettify(req.body.username);
  const password = prettify(req.body.password);
  if (!(username && password)) {
    return res.status(400).json({
      message: 'missing req.body.username or req.body.password'
    });
  }

  // 3. Verify that username and password are correct! (200, 401, 500 exit)
  try {
    const authentication = await authenticateUserLogin(username, password);
    if (!authentication) {
      return res.status(401).json({ message: 'invalid login credentials!' });
    }
    return res
      .status(200)
      .json({ username: authentication.username, uid: authentication.uid });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'server-side error!', error: err });
  }
});

module.exports = router;
