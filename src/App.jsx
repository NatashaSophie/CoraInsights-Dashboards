import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PublicDashboard from './pages/PublicDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <h1 className="logo">Caminho de Cora - Dashboards</h1>
            <nav className="nav">
              <Link to="/" className="nav-link">Público</Link>
              <Link to="/peregrinos" className="nav-link">Peregrinos</Link>
              <Link to="/gestores" className="nav-link">Gestores</Link>
              <Link to="/comerciantes" className="nav-link">Comerciantes</Link>
            </nav>
          </div>
        </header>
        
        <main className="main">
          <Routes>
            <Route path="/" element={<PublicDashboard />} />
            <Route path="/peregrinos" element={<div className="container" style={{padding: '40px'}}><h2>Dashboard de Peregrinos</h2><p>Em desenvolvimento...</p></div>} />
            <Route path="/gestores" element={<div className="container" style={{padding: '40px'}}><h2>Dashboard de Gestores</h2><p>Em desenvolvimento...</p></div>} />
            <Route path="/comerciantes" element={<div className="container" style={{padding: '40px'}}><h2>Dashboard de Comerciantes</h2><p>Em desenvolvimento...</p></div>} />
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

export default App;
