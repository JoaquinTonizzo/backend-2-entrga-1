const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create user (register)
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;
    const user = new User({ first_name, last_name, email, age, password, cart, role });
    await user.save();
    const out = user.toObject();
    delete out.password;
    res.status(201).json(out);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

// Read all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    // Si hay password, se hará hash en el pre-save hook
    if (updates.password) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      user.set(updates);
      await user.save();
      const out = user.toObject(); delete out.password; res.json(out);
      return;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Deleted', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
