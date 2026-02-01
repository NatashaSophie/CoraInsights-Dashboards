import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navigation.css';

export function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  // Mapear role IDs para nomes legíveis
  const getRoleName = (roleId) => {
    const roleMap = {
      1: 'Autenticado',
      3: 'Gestor',
      4: 'Comerciante',
      5: 'Peregrino',
      1: 'Peregrino',
      2: 'Gestor',
      3: 'Comerciante'
    };
    return roleMap[roleId] || 'Usuário';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Todo usuário é primordialmente um peregrino
  const isPeregrine = true; // Todos são peregrinos
  const isManager = user.userType === 2; // Gestor (role 2)
  const isMerchant = user.userType === 3; // Comerciante (role 3)

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2>🛤️ Caminho de Cora</h2>
        <p className="user-info">
          {user.username || user.email}
          <span className="role-badge">{getRoleName(user.userType)}</span>
        </p>
      </div>

      <ul className="nav-menu">
        <li>
          <button 
            onClick={() => {
              // Home deve ir para o dashboard específico do perfil, não para a página pública
              if (user.userType === 2) {
                navigate('/gestor');
              } else if (user.userType === 3) {
                navigate('/comerciante');
              } else {
                navigate('/peregrino');
              }
            }}
            className="nav-button"
          >
            🏠 Home
          </button>
        </li>

        {isPeregrine && (
          <li>
            <button 
              onClick={() => navigate('/peregrino')}
              className="nav-button"
            >
              🚶 Peregrino
            </button>
          </li>
        )}

        {isManager && (
          <li>
            <button 
              onClick={() => navigate('/gestor')}
              className="nav-button"
            >
              📊 Gestor
            </button>
          </li>
        )}

        {isMerchant && (
          <li>
            <button 
              onClick={() => navigate('/comerciante')}
              className="nav-button"
            >
              🏪 Comerciante
              <span className="status-badge">
                {/* TODO: Verificar status de aprovação do comerciante */}
                {/* Aguardando aprovação ou Aprovado */}
              </span>
            </button>
          </li>
        )}

        <li>
          <button 
            onClick={() => navigate('/perfil')}
            className="nav-button"
          >
            👤 Perfil
          </button>
        </li>

        <li>
          <button 
            onClick={handleLogout}
            className="nav-button logout-button"
          >
            🚪 Sair
          </button>
        </li>
      </ul>

      <div className="nav-footer">
        <small>© 2026 Caminho de Cora</small>
      </div>
    </nav>
  );
}
