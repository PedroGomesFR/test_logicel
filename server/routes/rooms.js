const express = require('express');
const Room = require('../models/Room');

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed rooms (for initial setup)
router.post('/seed', async (req, res) => {
  try {
    const rooms = [
      { name: 'Salle A', capacity: 10 },
      { name: 'Salle B', capacity: 20 },
      { name: 'Salle C', capacity: 5 },
    ];
    await Room.insertMany(rooms);
    res.status(201).json({ message: 'Rooms seeded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;