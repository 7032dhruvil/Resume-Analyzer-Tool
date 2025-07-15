const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  try {
    await Contact.create({ name, email, message });
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

module.exports = router; 