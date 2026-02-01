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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDemoLogin = async (email) => {
    setUsername(email);
    setError('');
    setLoading(true);

    const result = await login(email, 'senha123');
    if (result.success) {
      setUsername('');
      setPassword('');
      navigate('/dashboard');
    } else {
      setError(result.error);
      setPassword('');
    }
    setLoading(false);
  };

  return (
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
      </div>
    </div>
  );
}

export default Login;
