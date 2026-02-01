import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao montar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Simular login - em produção, seria uma chamada à API
    // Por agora, usamos credenciais fixas para teste
    const users = {
      'peregrino@test.com': { username: 'peregrino@test.com', role: 'pilgrim', name: 'Peregrino Teste' },
      'gestor@test.com': { username: 'gestor@test.com', role: 'manager', name: 'Gestor Teste' },
      'comerciante@test.com': { username: 'comerciante@test.com', role: 'merchant', name: 'Comerciante Teste' }
    };

    if (users[username] && password === 'senha123') {
      const userData = users[username];
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, error: 'Usuário ou senha inválidos' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
