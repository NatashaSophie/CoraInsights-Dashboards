import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import PublicDashboard from './pages/PublicDashboard';
import { PeregrinoPage } from './pages/PeregrinoPage';
import { GestorPage } from './pages/GestorPage';
import { ComerciandatePage } from './pages/ComerciandatePage';
import { PerfilPage } from './pages/PerfilPage';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/public-dashboard" element={<PublicDashboard />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/peregrino" />} />

        {/* Rotas protegidas - Dashboard */}
        <Route path="/dashboard" element={user ? <PublicDashboard /> : <Navigate to="/login" />} />

        {/* Rotas protegidas - Peregrino (todos os usuários) */}
        <Route path="/peregrino" element={user ? <PeregrinoPage /> : <Navigate to="/login" />} />

        {/* Rotas protegidas - Gestor */}
        <Route 
          path="/gestor" 
          element={user && user.userType === 2 ? <GestorPage /> : <Navigate to="/peregrino" />} 
        />

        {/* Rotas protegidas - Comerciante */}
        <Route 
          path="/comerciante" 
          element={user && user.userType === 3 ? <ComerciandatePage /> : <Navigate to="/peregrino" />} 
        />

        {/* Rotas protegidas - Perfil */}
        <Route path="/perfil" element={user ? <PerfilPage /> : <Navigate to="/login" />} />

        {/* Rota padrão */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
