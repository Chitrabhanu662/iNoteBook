const express = require('express');
const router = express.Router();
var fetchuser = require('../midleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
//Route 1: Get All the notes using: GET"/api/notes/fetchallnotes".  login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})

//Route 2:Add a new Note using : Post"/api/notes/addnote".  login required
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 5 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {


            const { title, description, tag } = req.body

            // If there are errors, return Bad requst and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()

            res.json(savedNote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server Error");
        }
    })

//Route 3:Update an existing Note using : put"/api/notes/addnote".  login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //  create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to be updated and update it 
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("NOt Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})


//Route 4:Delete an existing Note using : Delete"/api/notes/deletenote".  login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
try {
    // find the note to be deleted and delete it 
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("NOt Found") }

    //   Allow deletion only if user owns this Note 
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({ "success": "Note has deleted", note: note });
 } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})
module.exports = router