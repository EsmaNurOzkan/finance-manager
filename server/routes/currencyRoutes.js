const express = require('express');
const { getExchangeRatesInTL } = require('../controllers/currencyController');

const router = express.Router();

router.get('/exchange-rates/tl', getExchangeRatesInTL);

module.exports = router;
