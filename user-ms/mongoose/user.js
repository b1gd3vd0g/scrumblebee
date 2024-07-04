const { generateSalt, hash } = require('./hashing');
const User = require('./model');

User.createAccount = async (username, password, email) => {
  try {
    const salt = generateSalt();
    const hashed = hash(password, salt);
    const user = new User({
      username: username,
      password: hashed,
      email: email,
      salt: salt
    });
    return await user.save();
  } catch (err) {
    return false;
  }
};

User.verifyCredentials = async (username, password) => {
  const noMatch = { message: 'invalid credentials.' };
  try {
    const account =
      (await User.findOne({ username: username })) ||
      (await User.findOne({ email: username }));
    if (!account) return noMatch;
    const hashedPassword = hash(password, account.salt);
    if (hashedPassword === account.password)
      return { success: true, uid: account._id, username: account.username };
    return noMatch;
  } catch (e) {
    console.error(e);
    return { message: 'error', error: e };
  }
};

module.exports = User;
