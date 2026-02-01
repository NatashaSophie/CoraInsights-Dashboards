import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardComerciant() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard do Comerciante</h2>
        <p>Bem-vindo, {user?.name}!</p>
      </div>
      
      <div className="dashboard-content">
        <div className="card">
          <h3> Você está logado como Comerciante</h3>
          <p>Email: {user?.username}</p>
          <p className="info-text">
            Este é um espaço reservado para comerciantes gerenciarem suas operações.
            <br />
            Em breve, você poderá visualizar suas vendas, estabelecimentos e estatísticas.
          </p>
        </div>
      </div>
    </div>
  );
}
