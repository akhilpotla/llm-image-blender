const express = require("express");
const router = express.Router();

const config = require("config");

// @route   GET api/v1/contracts/payment
// @desc    Get payment contract address
// @access  Public
router.get("/payment", (req, res) => {
  try {
    res.json({ contractAddress: config.PAYMENT_CONTRACT_ADDRESS });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
