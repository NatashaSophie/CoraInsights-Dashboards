import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardGestor() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard do Gestor</h2>
        <p>Bem-vindo, {user?.name}!</p>
      </div>
      
      <div className="dashboard-content">
        <div className="card">
          <h3> Você está logado como Gestor</h3>
          <p>Email: {user?.username}</p>
          <p className="info-text">
            Este é um espaço reservado para gestores gerenciarem o Caminho de Cora.
            <br />
            Em breve, você poderá visualizar relatórios, gerenciar peregrinos e monitorar trilhas.
          </p>
        </div>
      </div>
    </div>
  );
}
