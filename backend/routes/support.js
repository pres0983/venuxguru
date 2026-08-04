import express from 'express';
import auth from '../middleware/auth.js';
import SupportTicket from '../models/SupportTicket.js';

const router = express.Router();

// Create ticket
router.post('/', auth, async (req, res) => {
  const { message } = req.body;
  const ticket = new SupportTicket({ userId: req.userId, message });
  await ticket.save();
  res.status(201).json(ticket);
});

// Get user tickets
router.get('/', auth, async (req, res) => {
  const tickets = await SupportTicket.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(tickets);
});

export default router;