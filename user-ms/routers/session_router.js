const {
  handleLogin,
  handleSessionValidation,
  handleSessionDestruction
} = require('../handlers/session_handlers');

const router = require('express').Router();

router.post('/', handleLogin);

router.get('/', handleSessionValidation);

router.delete('/', handleSessionDestruction);

module.exports = router;
