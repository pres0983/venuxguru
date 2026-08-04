// Add these to existing admin.js

// Notifications
router.post('/notifications', async (req, res) => {
  const { userId, title, message } = req.body;
  const notif = new Notification({ userId, title, message });
  await notif.save();
  res.json({ success: true });
});

router.get('/notifications', async (req, res) => {
  const notifs = await Notification.find().sort({ createdAt: -1 });
  res.json(notifs);
});

// Support tickets
router.get('/support', async (req, res) => {
  const tickets = await SupportTicket.find().populate('userId', 'username email').sort({ createdAt: -1 });
  res.json(tickets);
});

router.put('/support/:id/reply', async (req, res) => {
  const { reply } = req.body;
  const ticket = await SupportTicket.findById(req.params.id);
  ticket.reply = reply;
  ticket.status = 'closed';
  await ticket.save();
  res.json({ success: true });
});

// Real-time price endpoint (proxy)
router.get('/price/btc', async (req, res) => {
  const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
  const data = await response.json();
  res.json(data);
});

// ... all your route definitions (get, post, put, etc.) ...

// At the very bottom of the file, add this line:
export default router;