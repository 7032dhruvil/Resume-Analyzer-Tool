const express = require('express');
const Subscription = require('../models/Subscription');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }
    await Subscription.create({ email });
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

module.exports = router; 