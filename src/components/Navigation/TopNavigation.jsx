import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function TopNavigation() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getRoleName = (roleId) => {
    const roleMap = {
      1: 'Peregrino',
      2: 'Gestor',
      3: 'Comerciante'
    };
    return roleMap[roleId] || 'Usuário';
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const isManager = user.userType === 2;
  const isMerchant = user.userType === 3;

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '13px',
    fontWeight: '500',
    padding: '8px 14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '4px'
  };

  return (
    <nav style={{
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
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Left Section - Logo and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '32px',
            filter: 'brightness(0) invert(1)',
            display: 'flex',
            alignItems: 'center'
          }}>🚶</div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Caminho de Cora</h1>
            <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>Dashboard do {getRoleName(user.userType)}</p>
          </div>
        </div>

        {/* Right Section - Menu Items */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0'
        }}>
          <button
            onClick={() => navigateTo('/dashboard')} 
            /* onClick={() => {
              if (user.userType === 2) {
                navigateTo('/gestor');
              } else if (user.userType === 3) {
                navigateTo('/comerciante');
              } else {
                navigateTo('/peregrino');
              } 
              */
            style={buttonStyle}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            Home
          </button>

          <button
            onClick={() => navigateTo('/peregrino')}
            style={buttonStyle}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            Peregrino
          </button>

          {isManager && (
            <button
              onClick={() => navigateTo('/gestor')}
              style={buttonStyle}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              Gestor
            </button>
          )}

          {isMerchant && (
            <button
              onClick={() => navigateTo('/comerciante')}
              style={buttonStyle}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              Comerciante
            </button>
          )}

          <button
            onClick={() => navigateTo('/perfil')}
            style={buttonStyle}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            Perfil
          </button>
        </div>
      </div>
    </nav>
  );
}
