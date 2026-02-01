import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PublicNavigation.css';

export function PublicNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="public-navigation">
      <div className="public-nav-container">
        <div className="public-nav-logo">
          <span className="logo-icon">🛤️</span>
          <span className="logo-text">Caminho de Cora</span>
        </div>

        <ul className="public-nav-menu">
          <li>
            <button 
              onClick={() => navigate('/')}
              className={`public-nav-link ${isActive('/')}`}
            >
              🏠 Home
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('/login')}
              className={`public-nav-link ${isActive('/login')}`}
            >
              🔐 Login
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
