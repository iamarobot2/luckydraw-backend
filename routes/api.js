const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

const winningNumbers = generateWinningNumbers(150, 300); // Generate 150 winning numbers out of 300
let winnerCount = 0;

function generateWinningNumbers(count, max) {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(numbers);
}

// Register student
router.post('/register', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register student' });
  }
});

// Scan QR code
router.post('/scan', async (req, res) => {
  try {
    if (winnerCount >= 25) {
      return res.status(200).json({ winner: false, message: 'All prizes have been claimed.' });
    }

    const { qrData } = req.body;

    if (winningNumbers.includes(parseInt(qrData))) {
      winnerCount += 1;
      return res.status(200).json({ winner: true });
    } else {
      return res.status(200).json({ winner: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to process QR scan' });
  }
});

module.exports = router;
