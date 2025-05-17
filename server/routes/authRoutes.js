const express = require('express');
const router = express.Router();
const db = require('../db/db');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (db.findUser(username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const user = db.createUser({ username, password });
    res.status(201).json({ id: user.id, username });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.findUser(username);

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

module.exports = router;