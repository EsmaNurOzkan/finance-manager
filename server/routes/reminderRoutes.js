const express = require('express');
const router = express.Router();
const {
    createReminder,
    getReminders,
    updateReminder,
    deleteReminder
} = require('../controllers/reminderController');

router.post('/add/:userId', createReminder);

router.get('/get/:userId', getReminders);

router.patch('/update/:userId/:reminderId', updateReminder);

router.delete('/delete/:userId/:reminderId', deleteReminder);

module.exports = router;
