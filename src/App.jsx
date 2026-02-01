import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import PublicDashboard from './pages/PublicDashboard';
import DashboardPeregrino from './pages/DashboardPeregrino';
import DashboardGestor from './pages/DashboardGestor';
import DashboardComerciant from './pages/DashboardComerciant';
import './App.css';

function AppContent() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <Link to="/" className="logo">
              <h1>Caminho de Cora - Dashboards</h1>
            </Link>
            <nav className="nav">
              <Link to="/" className="nav-link">Home</Link>
              {!user ? (
                <Link to="/login" className="nav-link">Login</Link>
              ) : (
                <>
                  <span className="nav-user">👤 {user.name}</span>
                  <button onClick={logout} className="nav-logout">Sair</button>
                </>
              )}
            </nav>
          </div>
        </header>
        
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <UserDashboard /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <div className="container">
            <p>© 2026 Caminho de Cora - Fábrica Turing</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function UserDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'pilgrim':
      return <DashboardPeregrino />;
    case 'manager':
      return <DashboardGestor />;
    case 'merchant':
      return <DashboardComerciant />;
    default:
      return <PublicDashboard />;
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
