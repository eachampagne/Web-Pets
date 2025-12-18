const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('ultimately, this should return all of the pet\'s skill levels');
});

router.get('/:id', (req, res) => {
  res.send('get id');
});

router.patch('/:id', (req, res)=> {
  res.send('patch id');
});

module.exports = router;
