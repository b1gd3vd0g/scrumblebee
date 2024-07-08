const jwt = require('jsonwebtoken');
const {
  callValidateSession,
  callInitializeSession
} = require('../external_calls');
/**
 *
 * @param {Express.Request} req The HTTP request. Requires:
 * - a body.username and body.password that matches our database
 * - an API key to access the auth microservice (in the authorization header)
 * @param {*} res
 */
const handleLogin = async (req, res) => {
  console.log('called handleLogin');
  const username = req.body.username;
  const password = req.body.password;
  // Make the request to the auth-ms in order to verify login credentials
  // and receive a token for the session.
  const response = await callInitializeSession(username, password);
  const obj = await response.json();
  console.log('received response from auth-ms');
  console.log(response, obj);
  switch (response.status) {
    case 200:
      //start the session
      req.session.username = obj.username;
      req.session.uid = obj.uid;
      req.session.token = obj.token;
      return res.status(200).json();
    case 400:
      return res.status(400).json();
    case 401:
    case 403:
    case 500:
      return res.status(500).json(obj);
    case 404:
      return res.status(404).json();
  }
};

const handleSessionValidation = async (req, res) => {
  console.log('called handleSessionValidation');
  const username = req.session.username;
  const uid = req.session.uid;
  const token = req.session.token;
  if (
    !(
      username &&
      typeof username === 'string' &&
      uid &&
      typeof uid === 'string' &&
      token &&
      typeof token === 'string'
    )
  ) {
    // there's not a valid session.
    return res.status(404).json({
      message: 'No session found.'
    });
  }
  const response = await callValidateSession(token, username, uid);
  const obj = await response.json();
  switch (response.status) {
    case 200:
      // session is valid
      return res.status(200).json();
    case 400:
    case 401:
    case 500:
      // something went wrong server-side.
      return res
        .status(500)
        .json({ message: 'Server-side error.', error: obj });
    case 403:
      // session is invalid.
      return res.status(401).json({ message: 'Session is not valid.' });
  }
};

const handleSessionDestruction = async (req, res) => {
  req.session.destroy();
  return res.status(200).json({ message: 'Sign out successful.' });
};

module.exports = {
  handleLogin,
  handleSessionValidation,
  handleSessionDestruction
};
