const { generateSalt, hash } = require('./hashing');
const User = require('./model');
const { validateAll } = require('./validators');

User.createAccount = async (username, password, email) => {
  try {
    // validate the input.
    const validation = validateAll(username, password, email);
    if (!validation.valid) {
      // there are invalid fields.
      return { code: 400, probs: validation.probs };
    }
    // all fields contain valid input.
    const salt = generateSalt();
    const hashedPw = hash(validation.values.password, salt);
    const newUser = new User({
      username: validation.values.username,
      email: validation.values.email,
      password: hashedPw,
      salt: salt
    });
    await newUser.save();
    // successfully created account!
    return { code: 201 };
  } catch (e) {
    // server-side error
    return { code: 500, error: e };
  }
};

User.verifyCredentials = async (username, password) => {
  const noMatch = { code: 404 };
  if (
    !username ||
    !password ||
    typeof username !== 'string' ||
    typeof password !== 'string'
  ) {
    return { code: 400 };
  }
  try {
    const account =
      (await User.findOne({ username: username })) ||
      (await User.findOne({ email: username }));
    if (!account) return noMatch;
    const hashedPassword = hash(password, account.salt);
    if (hashedPassword === account.password) {
      // credentials are valid
      // return uid and username so auth-ms can create a token.
      return {
        code: 200,
        account: {
          uid: account._id,
          username: account.username
        }
      };
    } else {
      return noMatch;
    }
  } catch (e) {
    console.error(e);
    // server side error.
    return { code: 500, error: e };
  }
};

module.exports = User;
