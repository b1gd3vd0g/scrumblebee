const router = require('express').Router();

router.post('/', async (req, res) => {
  // This is the route to verify if a username and password match!
  // It is only accessible by the auth ms.
  // Thus it must have this api key.
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'string') {
    return res
      .status(403)
      .json({ success: false, message: 'missing api key! user-ms/auth/login' });
  }
  const token = authHeader.substring('Bearer '.length);
  console.log(authHeader);
  const { isApiKey } = require('./functions');
  if (!isApiKey(token)) {
    return res
      .status(403)
      .json({ success: false, message: 'invalid api key! user-ms/auth/login' });
  }
  // The api key is valid!

  // validate input.
  const username = req.body.username;
  const password = req.body.password;
  const { prettify } = require('./validators');
  const un = prettify(username);
  const pw = prettify(password);
  if (!un || !pw) {
    return res.status(400).json({
      success: false,
      message: 'either username or password was not provided.'
    });
  }
  // test username and password for correctness.
  const { authenticateUserLogin } = require('./user_funcs');
  const validation = await authenticateUserLogin(un, pw);
  if (!validation.success) {
    // Can be either 401 (didn't pass validation) or 500 (server side error).
    const code = validation.code;
    delete validation.code;
    return res.status(code ?? 401).json(validation);
  }
  return res.status(200).json(validation);
});

module.exports = router;
