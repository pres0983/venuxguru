import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Markets from './pages/Markets';
import Trade from './pages/Trade';
import History from './pages/History';
import Profile from './pages/Profile';
import Education from './pages/Education';
import Support from './pages/Support';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/Users';
import AdminWithdrawals from './admin/Withdrawals';
import AdminSettings from './admin/BotSettings';
import AdminNotifications from './admin/Notifications';
import AdminSupport from './admin/Support';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
        <Route path="/markets" element={<PrivateRoute><Layout><Markets /></Layout></PrivateRoute>} />
        <Route path="/trade" element={<PrivateRoute><Layout><Trade /></Layout></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><Layout><History /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
        <Route path="/education" element={<PrivateRoute><Layout><Education /></Layout></PrivateRoute>} />
        <Route path="/support" element={<PrivateRoute><Layout><Support /></Layout></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/withdrawals" element={<PrivateRoute><AdminWithdrawals /></PrivateRoute>} />
        <Route path="/admin/settings" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
        <Route path="/admin/notifications" element={<PrivateRoute><AdminNotifications /></PrivateRoute>} />
        <Route path="/admin/support" element={<PrivateRoute><AdminSupport /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;