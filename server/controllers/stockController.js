const axios = require('axios');

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY; 

exports.getStockData = async (req, res) => {
    const { symbol } = req.params; 

    try {
        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol: symbol,
                apikey: API_KEY,
            },
        });
        
        const stockData = response.data; 
        res.status(200).json(stockData); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching stock data' });
    }
};
