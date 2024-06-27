const { generateSalt, hash } = require('./hashing');
const { User } = require('./models');
const { prettify } = require('./functions');

const authenticateUserLogin = async (usernameOrEmail, password) => {
  const un = prettify(usernameOrEmail);
  const pw = prettify(password);
  const existingAcct =
    (await User.findOne({ username: un })) ||
    (await User.findOne({ email: un }));

  if (existingAcct) {
    const salt = existingAcct.salt;
    const hashedPw = hash(pw, salt);
    if (hashedPw === existingAcct.password) {
      // Authentication passed.
      return {
        uid: existingAcct._id,
        username: existingAcct.username
      };
    }
  }
  // Authentication failed.
  return false;
};

module.exports = { authenticateUserLogin };
