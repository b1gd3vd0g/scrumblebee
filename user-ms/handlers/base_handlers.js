const User = require('../mongoose/user');

const handleAccountCreation = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const creation = await User.createAccount(username, password, email);
  switch (creation.code) {
    case 201:
      return res.status(creation.code);
    case 400:
      return res.status(creation.code).json(creation.probs);
    case 500:
      console.error('Error creating account!');
      console.error(creation.error);
      return res.status(creation.code).json(creation.error);
  }
};

const handleOwnAccountRetrieval = async (req, res) => {
  // This requires authentication!!!
  if (!req.session.id && req.session.username) {
    return res.status(401).json();
  }
  try {
    const account = await User.findById(req.session.uid)
      .select('-password')
      .select('-salt');
    if (account) return res.status(200).json(account);
    return res.status(404).json({
      message: 'session uid does not exist in database!'
    });
  } catch (e) {
    return res.status(500).json({
      message: 'error',
      error: e
    });
  }
};

module.exports = {
  handleAccountCreation,
  handleOwnAccountRetrieval
};
