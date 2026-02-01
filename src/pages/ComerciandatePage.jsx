import React, { useState } from 'react';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import './ComerciandatePage.css';

export function ComerciandatePage() {
  const [approvalStatus] = useState('pending'); // 'pending', 'approved', 'rejected'

  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout 
        title="🏪 Dashboard Comerciante"
        subtitle="Gestão de estabelecimento e análise de vendas"
      >
        title="🏪 Dashboard Comerciante"
      subtitle="Gestão de seus pontos de venda e vendas"
      {/* Status Banner */}
      {approvalStatus === 'pending' && (
        <div className="status-banner warning">
          <div className="banner-content">
            <span className="banner-icon">⏳</span>
            <div>
              <h3>Seu cadastro está em análise</h3>
              <p>Estamos analisando sua solicitação como comerciante. Em breve você receberá uma resposta.</p>
            </div>
          </div>
          <button className="btn-close">✕</button>
        </div>
      )}

      <div className="dashboard-grid">
        {/* KPI Cards */}
        <section className="kpi-section">
          <h2>Seus Indicadores</h2>
          <div className="kpi-cards">
            <div className="kpi-card">
              <div className="kpi-icon">🏪</div>
              <div className="kpi-content">
                <p className="kpi-label">Pontos de Venda</p>
                <p className="kpi-value">3</p>
                <p className="kpi-subtext">Gerenciados</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">💰</div>
              <div className="kpi-content">
                <p className="kpi-label">Faturamento Este Mês</p>
                <p className="kpi-value">R$ 4.250</p>
                <p className="kpi-subtext">+12% vs mês anterior</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">👥</div>
              <div className="kpi-content">
                <p className="kpi-label">Clientes Únicos</p>
                <p className="kpi-value">842</p>
                <p className="kpi-subtext">Este mês</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">⭐</div>
              <div className="kpi-content">
                <p className="kpi-label">Avaliação Média</p>
                <p className="kpi-value">4.7</p>
                <p className="kpi-subtext">De 5 estrelas</p>
              </div>
            </div>
          </div>
        </section>

        {/* Análises */}
        <section className="analysis-section">
          <h2>Análises de Vendas</h2>
          <div className="analysis-container">
            <div className="analysis-card placeholder">
              <h3>Faturamento ao Longo do Tempo</h3>
              <div className="placeholder-content">
                [Gráfico de Faturamento]
              </div>
            </div>

            <div className="analysis-card placeholder">
              <h3>Produtos Mais Vendidos</h3>
              <div className="placeholder-content">
                [Gráfico de Produtos]
              </div>
            </div>
          </div>
        </section>

        {/* Gestão de Pontos de Venda */}
        <section className="points-section">
          <div className="section-header">
            <h2>Seus Pontos de Venda</h2>
            <button className="btn btn-primary">+ Novo Ponto de Venda</button>
          </div>

          <div className="points-grid">
            <div className="point-card">
              <div className="point-header">
                <h3>Restaurante Centro</h3>
                <span className="badge approved">Aprovado</span>
              </div>
              <div className="point-details">
                <p><strong>Endereço:</strong> Rua Principal, 123 - Centro</p>
                <p><strong>Telefone:</strong> (31) 3333-4444</p>
                <p><strong>Horário:</strong> 11h - 22h</p>
                <p><strong>Faturamento:</strong> R$ 2.100</p>
              </div>
              <div className="point-actions">
                <button className="btn btn-secondary">Editar</button>
                <button className="btn btn-secondary">Ver Detalhes</button>
              </div>
            </div>

            <div className="point-card">
              <div className="point-header">
                <h3>Café Vila</h3>
                <span className="badge approved">Aprovado</span>
              </div>
              <div className="point-details">
                <p><strong>Endereço:</strong> Avenida Brasil, 456 - Vila</p>
                <p><strong>Telefone:</strong> (31) 3333-5555</p>
                <p><strong>Horário:</strong> 7h - 19h</p>
                <p><strong>Faturamento:</strong> R$ 1.250</p>
              </div>
              <div className="point-actions">
                <button className="btn btn-secondary">Editar</button>
                <button className="btn btn-secondary">Ver Detalhes</button>
              </div>
            </div>

            <div className="point-card">
              <div className="point-header">
                <h3>Loja Souvenir</h3>
                <span className="badge pending">Aguardando Aprovação</span>
              </div>
              <div className="point-details">
                <p><strong>Endereço:</strong> Praça Pública, 789</p>
                <p><strong>Telefone:</strong> (31) 3333-6666</p>
                <p><strong>Horário:</strong> 10h - 20h</p>
                <p><strong>Status:</strong> Análise em andamento</p>
              </div>
              <div className="point-actions">
                <button className="btn btn-secondary">Editar</button>
                <button className="btn btn-secondary">Ver Status</button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabelas de Vendas */}
        <section className="sales-section">
          <h2>Últimas Transações</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Ponto de Venda</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>29/01/2024</td>
                  <td>Restaurante Centro</td>
                  <td>Venda - Almoço</td>
                  <td>R$ 450</td>
                  <td><span className="badge income">Receita</span></td>
                </tr>
                <tr>
                  <td>28/01/2024</td>
                  <td>Café Vila</td>
                  <td>Venda - Café</td>
                  <td>R$ 120</td>
                  <td><span className="badge income">Receita</span></td>
                </tr>
                <tr>
                  <td>27/01/2024</td>
                  <td>Restaurante Centro</td>
                  <td>Venda - Jantar</td>
                  <td>R$ 680</td>
                  <td><span className="badge income">Receita</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      </DashboardLayout>
    </>
  );
}
