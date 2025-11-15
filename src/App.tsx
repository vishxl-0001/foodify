import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Home } from './components/Home';
import { RestaurantDetail } from './components/RestaurantDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderTracking } from './components/OrderTracking';
import { MyOrders } from './components/MyOrders';
import { AdminDashboard } from './components/AdminDashboard';
import { DeliveryPartnerDashboard } from './components/DeliveryPartnerDashboard';
import { UserProfile } from './components/UserProfile';
import { PasswordRecovery } from './components/PasswordRecovery';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: any, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/signup" element={
          user ? <Navigate to="/" /> : <Signup onSignup={handleLogin} />
        } />
        <Route path="/forgot-password" element={<PasswordRecovery />} />
        
        <Route path="/" element={
          <Home user={user} token={token} onLogout={handleLogout} />
        } />
        
        <Route path="/restaurant/:id" element={
          <RestaurantDetail user={user} token={token} onLogout={handleLogout} />
        } />
        
        <Route path="/cart" element={
          user ? <Cart user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />
        
        <Route path="/checkout" element={
          user ? <Checkout user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />
        
        <Route path="/orders" element={
          user ? <MyOrders user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />
        
        <Route path="/order/:id" element={
          user ? <OrderTracking user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />
        
        <Route path="/profile" element={
          user ? <UserProfile user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />
        
        <Route path="/admin" element={
          user?.role === 'admin' ? <AdminDashboard user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        
        <Route path="/delivery-partner" element={
          user?.role === 'delivery-partner' ? <DeliveryPartnerDashboard user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}