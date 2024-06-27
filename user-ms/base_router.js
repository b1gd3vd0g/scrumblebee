const router = require('express').Router();

router.use('/session', require('./session_router'));
router.use('/verify', require('./verify_router'));

module.exports = router;
