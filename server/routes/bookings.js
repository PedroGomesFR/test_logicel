const express = require('express');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).populate('roomId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  const { roomId, date, time } = req.body;
  try {
    // Check if already booked
    const existing = await Booking.findOne({ roomId, date, time });
    if (existing) return res.status(400).json({ message: 'Already booked' });

    const booking = new Booking({ userId: req.userId, roomId, date, time });
    await booking.save();
    await booking.populate('roomId');
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;