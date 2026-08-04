import express from 'express';
import auth from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  const notifications = await Notification.find({
    $or: [{ userId: req.userId }, { userId: null }]
  }).sort({ createdAt: -1 });
  res.json(notifications);
});

// Mark as read
router.put('/:id/read', auth, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});

export default router;