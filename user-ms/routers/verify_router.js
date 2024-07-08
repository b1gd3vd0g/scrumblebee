const { handleLoginVerification } = require('../handlers/verify_handler');

const router = require('express').Router();

router.post('/', handleLoginVerification);

module.exports = router;
