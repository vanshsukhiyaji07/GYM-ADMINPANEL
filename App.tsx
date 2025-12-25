
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Leads from './pages/Leads';
import Trainers from './pages/Trainers';
import Payments from './pages/Payments';
import Login from './pages/Login';
import { User, AuthState } from './types';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('gym_auth_user');
    const savedTokens = localStorage.getItem('gym_auth_tokens');
    
    if (savedUser && savedTokens) {
      const tokens = JSON.parse(savedTokens);
      setAuth({
        user: JSON.parse(savedUser),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isLoading: false,
      });
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleLoginSuccess = (user: User, tokens: { accessToken: string, refreshToken: string }) => {
    localStorage.setItem('gym_auth_user', JSON.stringify(user));
    localStorage.setItem('gym_auth_tokens', JSON.stringify(tokens));
    setAuth({
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isLoading: false,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('gym_auth_user');
    localStorage.removeItem('gym_auth_tokens');
    setAuth({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
    });
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl mb-4"></div>
          <div className="h-2 w-24 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {!auth.user ? (
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Layout user={auth.user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
};

export default App;
