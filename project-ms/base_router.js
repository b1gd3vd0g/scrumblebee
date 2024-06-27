const router = require('express').Router();

router.use('/session', require('./session_router'));

module.exports = router;
