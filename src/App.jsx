import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardPublic from './pages/DashboardPublic';
// import { DashboardPilgrimTeste } from './pages/DashboardPilgrimTeste';
// import { DashboardManagerTeste } from './pages/DashboardManagerTeste';
// import { DashboardMerchantTeste } from './pages/DashboardMerchantTeste';
import { DashboardPilgrim } from './pages/DashboardPilgrim';
import { DashboardManager } from './pages/DashboardManager';
import { DashboardMerchant } from './pages/DashboardMerchant';
import { ProfilePage } from './pages/ProfilePage';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  const getDashboardPath = (currentUser) => {
    if (!currentUser) return '/peregrino';
    if (currentUser.userType === 2) return '/gestor';
    if (currentUser.userType === 3) return '/comerciante';
    return '/peregrino';
  };

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/public-dashboard" element={<DashboardPublic />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={getDashboardPath(user)} />} />

        {/* Rotas protegidas - Dashboard */}
        <Route path="/dashboard" element={user ? <Home /> : <Navigate to="/login" />} />

        {/* Rotas protegidas - Peregrino (todos os usuários) */}
        {/* <Route path="/peregrino" element={user ? <DashboardPilgrimTeste /> : <Navigate to="/login" />} /> */}
        <Route path="/peregrino" element={user ? <DashboardPilgrim /> : <Navigate to="/login" />} />

        {/* Rotas protegidas - Gestor */}
        {/* <Route 
          path="/gestor" 
          element={user && user.userType === 2 ? <DashboardManagerTeste /> : <Navigate to="/peregrino" />} 
        /> */}
        <Route 
          path="/gestor" 
          element={user && user.userType === 2 ? <DashboardManager /> : <Navigate to="/peregrino" />} 
        />

        {/* Rotas protegidas - Comerciante */}
        {/* <Route 
          path="/comerciante" 
          element={user && user.userType === 3 ? <DashboardMerchantTeste /> : <Navigate to="/peregrino" />} 
        /> */}
        <Route 
          path="/comerciante" 
          element={user && user.userType === 3 ? <DashboardMerchant /> : <Navigate to="/peregrino" />} 
        />

        {/* Rotas protegidas - Perfil */}
        <Route path="/perfil" element={user ? <ProfilePage /> : <Navigate to="/login" />} />

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
