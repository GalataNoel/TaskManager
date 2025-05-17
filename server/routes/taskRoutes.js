const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all tasks
router.get('/', (req, res) => {
    res.json(db.getAllTasks());
});

// Create new task
router.post('/', (req, res) => {
    const task = db.createTask(req.body);
    res.status(201).json(task);
});

// Update task
router.put('/:id', (req, res) => {
    const updated = db.updateTask(req.params.id, req.body);
    if (!updated) return res.status(404).send('Task not found');
    res.json(updated);
});

// Delete task
router.delete('/:id', (req, res) => {
    const success = db.deleteTask(req.params.id);
    if (!success) return res.status(404).send('Task not found');
    res.status(204).send();
});

module.exports = router;