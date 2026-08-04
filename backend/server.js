import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import depositRoutes from './routes/deposit.js';
import withdrawalRoutes from './routes/withdrawal.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notification.js'; // new
import supportRoutes from './routes/support.js'; // new
import { startScheduler } from './bot/scheduler.js';

dotenv.config();

// ✅ THIS LINE IS MISSING – ADD IT
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/deposit', depositRoutes);
app.use('/api/withdrawal', withdrawalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`VenuxGuru backend running on port ${PORT}`);
    startScheduler();
  });
});