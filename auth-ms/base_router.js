const {
  handleSessionValidation,
  handleSessionGeneration
} = require('./handlers');

const router = require('express').Router();

router.post('/', handleSessionGeneration);

router.get('/', handleSessionValidation);

module.exports = router;
