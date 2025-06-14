const axios = require('axios');

const getExchangeRatesInTL = async (req, res) => {
    try {
        const response = await axios.get(process.env.EXCHANGE_RATE_API_URL);
        const exchangeRates = response.data.rates;

        const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'RUB', 'AED'];

        const exchangeRatesInTL = {};

        if (exchangeRates) {
            for (const currency of popularCurrencies) {
                if (currency === 'TRY') {
                    exchangeRatesInTL[currency] = `1 TRY = 1 TRY`;
                } else if (exchangeRates[currency]) {
                    exchangeRatesInTL[currency] = `1 ${currency} = ${(1 / exchangeRates[currency]).toFixed(2)} TL`;
                }
            }
        } else {
            res.status(500).json({ error: "No exchange rates found" });
            return;
        }

        res.status(200).json(exchangeRatesInTL);
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        res.status(500).json({ error: "Failed to fetch exchange rates" });
    }
};

module.exports = { getExchangeRatesInTL };
