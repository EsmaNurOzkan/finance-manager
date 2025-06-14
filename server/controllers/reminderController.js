const mongoose = require('mongoose');
const User = require('../models/User.js');
const Reminder = require('../models/Reminder.js'); 

const createReminder = async (req, res) => {
    const { userId } = req.params; 
    const { title, description, dueDate } = req.body; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newReminder = new Reminder({ title, description, dueDate });
        user.reminders.push(newReminder); 
        await user.save();

        res.status(201).json(newReminder);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
};

const getReminders = async (req, res) => {
    const { userId } = req.params; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ reminders: user.reminders }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

const updateReminder = async (req, res) => {
    const { userId, reminderId } = req.params; 
    const { title, description, dueDate } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const reminder = user.reminders.id(reminderId); 
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        if (title) reminder.title = title;
        if (description) reminder.description = description;
        if (dueDate) reminder.dueDate = dueDate;

        await user.save(); 
        res.status(200).json(reminder);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
};

const deleteReminder = async (req, res) => {
    const { userId, reminderId } = req.params; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.reminders.findIndex(r => r._id.toString() === reminderId);
        if (index === -1) {
            return res.status(404).json({ message: 'Note not found' });
        }

        user.reminders.splice(index, 1); 
        await user.save(); 

        res.status(200).json({ message: 'Reminder successfully deleted' }); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports = {
    createReminder,
    getReminders,
    updateReminder,
    deleteReminder
};
