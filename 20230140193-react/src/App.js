import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Library, BookOpen, Settings, LogOut, History } from 'lucide-react';

import AuthPage from './pages/AuthPage';
import BookList from './pages/BookList';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import MyLoans from './pages/MyLoans';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('userRole');

  if (!userId) {
    return <Navigate to="/login" replace />;
  }


  if (adminOnly && role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!userId || location.pathname === '/login') return null;

  const navItems = [
    { path: '/home', icon: Library, label: 'Beranda' },
    { path: '/books', icon: BookOpen, label: 'Buku' },
    ...(role === 'user' ? [{ path: '/my-loans', icon: History, label: 'Pinjaman' }] : []),
    ...(role === 'admin' ? [{ path: '/admin', icon: Settings, label: 'Admin' }] : []),
  ];

  return (
    <nav className="glass-morphism" style={{
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'auto',
      padding: '12px 16px',
      display: 'flex',
      gap: '8px',
      zIndex: 1000,
      border: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      borderRadius: '24px'
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ y: -4, background: 'rgba(0,0,0,0.03)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 16px',
                borderRadius: '16px',
                background: isActive ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <item.icon size={22} color={isActive ? 'var(--ios-blue)' : 'var(--ios-gray)'} />
              <span style={{
                fontSize: '11px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'var(--ios-blue)' : 'var(--ios-gray)'
              }}>{item.label}</span>
            </motion.div>
          </Link>
        );
      })}

      <div style={{ width: '1px', background: '#e5e5ea', margin: '8px 4px' }} />

      <motion.div
        whileHover={{ y: -4, background: 'rgba(255, 59, 48, 0.08)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        style={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 16px',
          borderRadius: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <LogOut size={22} color="var(--ios-red)" />
        <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--ios-gray)' }}>Keluar</span>
      </motion.div>
    </nav>
  );
};

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/books" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
          <Route path="/my-loans" element={<ProtectedRoute><MyLoans /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

