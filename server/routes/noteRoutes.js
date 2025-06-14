const express = require('express');
const router = express.Router();
const {
    createNote,
    getNotes,
    updateNote,
    deleteNote
} = require('../controllers/noteController');

router.post('/add/:userId', createNote);

router.get('/get/:userId', getNotes);

router.patch('/update/:userId/:noteId', updateNote);

router.delete('/delete/:userId/:noteId', deleteNote);

module.exports = router;
