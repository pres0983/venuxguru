// Add these imports
import notificationRoutes from './routes/notification.js';
import supportRoutes from './routes/support.js';

// Add these routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);