import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = (currentUser) => {
    if (!currentUser) return '/peregrino';
    if (currentUser.userType === 2) return '/gestor';
    if (currentUser.userType === 3) return '/comerciante';
    return '/peregrino';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    if (result.success) {
      navigate(getDashboardPath(result.user));
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDemoLogin = async (email) => {
    setUsername(email);
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      setUsername('');
      setPassword('');
      navigate(getDashboardPath(result.user));
    } else {
      setError(result.error);
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f4f6fb 0%, #fbfcff 50%, #eef1f9 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
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
        marginBottom: 0
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#3e2723',
          cursor: 'pointer',
          letterSpacing: '0.5px'
        }} onClick={() => navigate('/')}>
          Caminho de Cora - Dashboards
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <button
            onClick={() => navigate('/')}
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
            Home
          </button>
          <button
            onClick={() => navigate('/login')}
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
            Login
          </button>
        </div>
      </nav>

      {/* Brown Header */}
      <header style={{
        background: 'linear-gradient(135deg, #5d4037 0%, #6d4c41 50%, #795548 100%)',
        color: 'white',
        padding: '24px 0',
        boxShadow: '0 4px 20px rgba(93, 64, 55, 0.3)',
        marginBottom: '32px',
        position: 'sticky',
        top: '64px',
        zIndex: 900
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
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Caminho de Cora</h1>
            <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>Acesso ao sistema</p>
          </div>
        </div>
      </header>

      <div className="login-container">
        <div className="login-box">
          <h2>Login no Sistema</h2>
          <p className="login-subtitle">Acesse sua conta para ver seus dashboards pessoais</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu.email@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        {/*
        <div className="demo-section">
          <p className="demo-title">Contas de demonstração:</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn demo-btn-pilgrim"
              onClick={() => handleDemoLogin('peregrino@test.com')}
              disabled={loading}
            >
              👣 Peregrino
              <br />
              <small>peregrino@test.com</small>
            </button>
            <button
              type="button"
              className="demo-btn demo-btn-manager"
              onClick={() => handleDemoLogin('gestor@test.com')}
              disabled={loading}
            >
              👨‍💼 Gestor
              <br />
              <small>gestor@test.com</small>
            </button>
            <button
              type="button"
              className="demo-btn demo-btn-merchant"
              onClick={() => handleDemoLogin('comerciante@test.com')}
              disabled={loading}
            >
              🏪 Comerciante
              <br />
              <small>comerciante@test.com</small>
            </button>
          </div>
          <p className="demo-note">Senha para todas: <code>senha123</code></p>
        </div>
        */}  

        </div>
      </div>
      <footer className="dashboard-footer">
        <p>Caminho de Cora &#169; 2026 - Dashboards</p>
      </footer>
    </div>
  );
}

export default Login;
