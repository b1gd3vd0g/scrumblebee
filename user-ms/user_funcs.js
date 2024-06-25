const { generateSalt, hash } = require('./hashing');
const { User } = require('./models');
const {
  prettify,
  validateAll,
  validateUsername,
  validateEmail,
  validatePassword
} = require('./validators');

const sse = (err) => {
  return {
    success: false,
    message: 'server-side error',
    code: 500,
    error: err
  };
};

const authenticateUserLogin = async (usernameOrEmail, password) => {
  const un = prettify(usernameOrEmail);
  const pw = prettify(password);
  try {
    const existingAcct =
      (await User.findOne({ username: un })) ||
      (await User.findOne({ email: un }));

    if (existingAcct) {
      const salt = existingAcct.salt;
      const hashedPw = hash(pw, salt);
      if (hashedPw === existingAcct.password) {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
          {
            uid: existingAcct._id,
            un: existingAcct.un
          },
          require('./config.json').jwtSecret,
          {
            expiresIn: 3_600 // 1 hr = 3_600 sec
          }
        );

        jwt.decode();
        return { success: true, code: 200, token: token };
      }
    }
    // 401 exit: input is valid, authentication failed. incorrect login info.
    return { success: false, code: 401, message: 'auth failed' };
  } catch (e) {
    // 500 exit: server-side error
    return sse(e);
  }
};

const createUser = async (username, email, password) => {
  // 0. Trim input
  const un = username.trim();
  const em = email.trim();
  const pw = password.trim();
  // 1. Validate input
  const inv = [];
  if (!validateUsername(un)) inv.push('username');
  if (!validateEmail(em)) inv.push('email');
  if (!validatePassword(pw)) inv.push('password');
  if (inv.length)
    return {
      success: false,
      code: 400,
      message: 'bad input',
      fields: inv
    };
  // 2. Ensure user doesn't exist already
  const dupFields = [];
  if (await User.findOne({ username: new RegExp(`^${un}$`, 'i') }))
    dupFields.push('username');
  if (await User.findOne({ email: new RegExp(`^${em}$`, 'i') }))
    dupFields.push('email');
  if (dupFields.length)
    return {
      success: false,
      code: 403,
      message: 'duplicate fields',
      fields: dupFields
    };
  // 3. Deal w password hashing
  const salt = generateSalt();
  const hashedPw = hash(pw, salt);
  const info = { username: un, email: em, password: hashedPw, salt: salt };
  // 4. Try creating the new user.
  try {
    const newUser = new User(info);
    const creation = await newUser.save();
    console.log(creation);
    return {
      success: true,
      code: 201
    };
  } catch (e) {
    // This is possible if a server is down, there is somehow a duplicate username
    // situation, etc.
    return {
      success: false,
      code: 500,
      message: 'server-side error',
      error: e
    };
  }
};

module.exports = { createUser, authenticateUserLogin };
