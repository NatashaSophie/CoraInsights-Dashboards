import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPeregrino() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard do Peregrino</h2>
        <p>Bem-vindo, {user?.name}!</p>
      </div>
      
      <div className="dashboard-content">
        <div className="card">
          <h3> Você está logado como Peregrino</h3>
          <p>Email: {user?.username}</p>
          <p className="info-text">
            Este é um espaço reservado para peregrinos acompanharem sua jornada no Caminho de Cora.
            <br />
            Em breve, você poderá visualizar seus dados pessoais de trilha, progresso e estatísticas.
          </p>
        </div>
      </div>
    </div>
  );
}
