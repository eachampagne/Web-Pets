const express = require('express');

const router = express.Router();

router.get('/test', (req, res) => {
  res.status(200).send('router working');
});

module.exports = router;
