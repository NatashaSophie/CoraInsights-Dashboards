import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthenticatedNavigation.css';

export function AuthenticatedNavigation({ title, subtitle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleName = (userType) => {
    const roleMap = {
      1: 'Peregrino',
      2: 'Gestor',
      3: 'Comerciante'
    };
    return roleMap[userType] || 'Usuário';
  };

  return (
    <>
      {/* Top Navigation Bar - White with shadow */}
      <nav style={{
        background: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        marginBottom: '8px'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#3e2723',
          cursor: 'pointer',
          letterSpacing: '0.5px'
        }} onClick={() => navigate(user.userType === 2 ? '/gestor' : user.userType === 3 ? '/comerciante' : '/peregrino')}>
          Caminho de Cora - Dashboards
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6d4c41', fontWeight: '500' }}>
            {user?.username || 'Usuário'} ({getRoleName(user?.userType)})
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#6d4c41',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '8px 12px',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#4e342e'}
            onMouseLeave={(e) => e.target.style.color = '#6d4c41'}
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Brown Header */}
      <header style={{
        background: 'linear-gradient(135deg, #5d4037 0%, #6d4c41 50%, #795548 100%)',
        color: 'white',
        padding: '24px 0',
        boxShadow: '0 4px 20px rgba(93, 64, 55, 0.3)',
        marginBottom: '32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '32px',
            filter: 'brightness(0) invert(1)'
          }}>&#128694;</div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {title || 'Caminho de Cora'}
            </h1>
            <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>
              {subtitle || 'Dashboard'}
            </p>
          </div>
        </div>
      </header>
    </>
  );
}
