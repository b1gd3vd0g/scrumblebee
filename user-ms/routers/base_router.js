/**
 * Exports a router defining the GET, POST, PUT, and DELETE methods which are
 * available at the base path (/).
 */

const {
  handleAccountCreation,
  handleOwnAccountRetrieval
} = require('../handlers/base_handlers');

const router = require('express').Router();

// the other paths are more specifically defined in their own modules.
router.use('/session', require('./session_router'));
router.use('/verify', require('./verify_router'));

router.post('/', handleAccountCreation);
router.get('/', handleOwnAccountRetrieval);

module.exports = router;
