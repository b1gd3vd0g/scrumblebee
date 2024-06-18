const router = require('express').Router();

const authRouter = require('./auth_router');

router.use('/auth', authRouter);

/*
  // get users (with optional filters)
  router.get('/', async (req, res) => {
    
  });

  // create a new user
  router.post('/', async (req, res) => {
    
  });

  // delete a user
  router.delete('/', async (req, res) => {
    
  });

  // update a user
  router.post('/', async (req, res) => {
    
  });
*/

module.exports = router;