import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AuthenticatedNavigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Top White Navigation Bar - Consistent with Login and PublicDashboard */}
      <nav style={{
        background: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1001,
        marginBottom: 0
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#3e2723',
          cursor: 'pointer',
          letterSpacing: '0.5px'
        }}>
          Caminho de Cora - Dashboards
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
            {user?.username || user?.email || 'Usuário'}
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
    </>
  );
}
