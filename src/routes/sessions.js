const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('../passport/strategies');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '1h';

// Login route - authenticate and return JWT
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Unauthorized' });
    // create token
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token });
  })(req, res, next);
});

// Current route - validate JWT and return user info
router.get('/current', (req, res, next) => {
  passport.authenticate('current', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Token invalid or missing' });
    res.json(user);
  })(req, res, next);
});

// Register route for creating new users
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;
    const user = new User({ first_name, last_name, email, age, password, cart, role });
    await user.save();
    const out = user.toObject(); delete out.password; res.status(201).json(out);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
