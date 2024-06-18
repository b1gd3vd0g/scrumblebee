const router = require('express').Router();

const { User } = require('./models');

router.get('/', async (req, res) => {
  // Check the jwt to make sure that you are authenticated.
  const jwt = req.headers('Authentication');
});

router.post('/', async (req, res) => {
  // Sign in.
});

router.delete('/', async (req, res) => {
  // Sign out. Delete the jwt from the header.
});

module.exports = router;
