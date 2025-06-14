const User = require('../models/User.js'); 
const FinancialNote = require('../models/FinancialNote.js'); 

const createNote = async (req, res) => {
    const { userId } = req.params;
    const { content } = req.body; 
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newNote = new FinancialNote({ content }); 
        user.financialNotes.push(newNote); 
        await user.save();

        res.status(201).json({ message: 'Note created successfully', note: newNote }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

const getNotes = async (req, res) => {
    const { userId } = req.params; 
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ notes: user.financialNotes }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

const updateNote = async (req, res) => {
    const { userId, noteId } = req.params;
    const { content } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const note = user.financialNotes.id(noteId); 
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.content = content; 
        await user.save();

        res.status(200).json({ message: 'Note updated successfully', note }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

const deleteNote = async (req, res) => {
    const { userId, noteId } = req.params; 
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.financialNotes.findIndex(r => r._id.toString() === noteId);
        if (index === -1) {
            return res.status(404).json({ message: 'Note not found' });
        }

        user.financialNotes.splice(index, 1); 
        await user.save(); 

        res.status(200).json({ message: 'Note successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports = {
    createNote,
    getNotes,
    updateNote,
    deleteNote
};
