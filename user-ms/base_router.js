const router = require('express').Router();

const authRouter = require('./auth_router');
const { createUser } = require('./user_funcs');

router.use('/auth', authRouter);
/*
  // get users (with optional filters)
  router.get('/', async (req, res) => {
    
  });
*/
// create a new user
router.post('/', async (req, res) => {
  const body = req.body;
  const un = body.username;
  const pw = body.password;
  const em = body.email;
  if (
    un &&
    typeof un === 'string' &&
    pw &&
    typeof pw === 'string' &&
    em &&
    typeof em === 'string'
  ) {
    const creation = await createUser(un, em, pw);
    const code = creation.code;
    delete creation.code;
    return res.status(code).json(creation);
  }
  return res.status(400).json({ success: false, error: 'missing fields' });
});
/*
  // delete a user
  router.delete('/', async (req, res) => {
    
  });

  // update a user
  router.post('/', async (req, res) => {
    
  });
*/

module.exports = router;
