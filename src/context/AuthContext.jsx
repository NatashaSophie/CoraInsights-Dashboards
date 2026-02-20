import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = 'http://localhost:1337';

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

  const login = async (identifier, password) => {
    try {
      // Limpar localStorage antigo para evitar conflitos
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');

      const response = await fetch(`${API_URL}/dashboards/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier, // pode ser email ou username
          password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return { 
          success: false, 
          error: error.message || 'Usuário ou senha inválidos' 
        };
      }

      const data = await response.json();
      
      console.log('[AUTH FRONTEND] Login response received:', {
        jwt: data.jwt ? data.jwt.substring(0, 50) + '...' : 'none',
        userType: data.user.userType,
        userId: data.user.id
      });
      
      // Mapear userType de string para número
      const mapUserTypeToId = (userTypeValue) => {
        // Se já é um número, retornar direto
        if (typeof userTypeValue === 'number') {
          return userTypeValue;
        }
        
        // Se é string, mapear para número
        if (typeof userTypeValue === 'string') {
          const typeMap = {
            'pilgrim': 1,
            'peregrino': 1,
            'manager': 2,
            'gestor': 2,
            'merchant': 3,
            'comerciante': 3
          };
          return typeMap[userTypeValue.toLowerCase()] || 1;
        }
        
        // Fallback: retornar 1 (Peregrino)
        return 1;
      };

      // Extrair informações do usuário
      const userData = {
        username: data.user.email || data.user.username,
        userType: mapUserTypeToId(data.user.userType), // Mapear para número
        name: data.user.username || data.user.email,
        id: data.user.id,
        jwt: data.jwt
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('jwt', data.jwt);

      console.log('[AUTH FRONTEND] Token saved to localStorage');

      return { success: true, user: userData };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao conectar com o servidor' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
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
