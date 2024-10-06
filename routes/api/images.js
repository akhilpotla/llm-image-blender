const express = require('express');
const router = express.Router();

// @route    GET api/v1/images
// @desc     Test route
// @access   Public
router.get('/', (req, res) => res.send('Images route'));

// @route    POST api/v1/images
// @desc     Upload 2 images
// @access   Public
router.post('/', (req, res) => {
  console.log(req.body);
  res.send('Images uploaded');
});

module.exports = router;