const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); 
const stockRoutes = require('./routes/stockRoutes'); 
const currencyRoutes = require('./routes/currencyRoutes');
const reminderRoutes = require("./routes/reminderRoutes");
const noteRoutes = require("./routes/noteRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require('./routes/budgetRoutes'); 

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',  
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => console.error(err));

app.use('/api/auth', authRoutes); 
app.use('/api/stocks', stockRoutes); 
app.use('/api/currency', currencyRoutes);  
app.use('/api/reminders', reminderRoutes);
app.use('/api/notes', noteRoutes); 
app.use('/api/expenses', expenseRoutes); 
app.use('/api/budgets', budgetRoutes);


app.get('/', (req, res) => {
    res.send('Finance Manager API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
