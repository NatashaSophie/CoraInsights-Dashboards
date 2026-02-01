import React from 'react';
import { AuthenticatedNavigation } from '../components/AuthenticatedNavigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import './GestorPage.css';

export function GestorPage() {
  return (
    <>
      <AuthenticatedNavigation 
        title="Caminho de Cora" 
        subtitle="Dashboard do Gestor"
      />
      <DashboardLayout 
        title="📊 Dashboard Gestor"
        subtitle="Análises, relatórios e gestão da plataforma"
      >
      <div className="dashboard-grid">
        {/* KPI Cards */}
        <section className="kpi-section">
          <h2>Indicadores Gerenciais</h2>
          <div className="kpi-cards">
            <div className="kpi-card">
              <div className="kpi-icon">👥</div>
              <div className="kpi-content">
                <p className="kpi-label">Total de Peregrinos</p>
                <p className="kpi-value">1.247</p>
                <p className="kpi-subtext">+42 este mês</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">✅</div>
              <div className="kpi-content">
                <p className="kpi-label">Jornadas Completas</p>
                <p className="kpi-value">156</p>
                <p className="kpi-subtext">12.5% do total</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">⏳</div>
              <div className="kpi-content">
                <p className="kpi-label">Tempo Médio</p>
                <p className="kpi-value">128h 45m</p>
                <p className="kpi-subtext">Por jornada</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🏪</div>
              <div className="kpi-content">
                <p className="kpi-label">Comerciantes Ativos</p>
                <p className="kpi-value">42</p>
                <p className="kpi-subtext">+8 aguardando aprovação</p>
              </div>
            </div>
          </div>
        </section>

        {/* Análises Gerenciais */}
        <section className="analysis-section">
          <h2>Análises da Plataforma</h2>
          <div className="analysis-container">
            <div className="analysis-card placeholder">
              <h3>Distribuição de Peregrinos por Estado</h3>
              <div className="placeholder-content">
                [Mapa/Gráfico Geográfico]
              </div>
            </div>

            <div className="analysis-card placeholder">
              <h3>Taxa de Conclusão por Trecho</h3>
              <div className="placeholder-content">
                [Gráfico de Barras]
              </div>
            </div>

            <div className="analysis-card placeholder">
              <h3>Engajamento ao Longo do Tempo</h3>
              <div className="placeholder-content">
                [Gráfico de Linha]
              </div>
            </div>

            <div className="analysis-card placeholder">
              <h3>Receita com Comerciantes</h3>
              <div className="placeholder-content">
                [Gráfico de Faturamento]
              </div>
            </div>
          </div>
        </section>

        {/* Tabelas de Gestão */}
        <section className="table-section">
          <h2>Gerenciamento de Comerciantes</h2>
          <div className="controls">
            <button className="btn btn-secondary">+ Novo Comerciante</button>
            <button className="btn btn-secondary">Exportar Relatório</button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Pontos de Venda</th>
                  <th>Status</th>
                  <th>Data de Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Restaurante A</td>
                  <td>contato@restaurante-a.com</td>
                  <td>3</td>
                  <td><span className="badge approved">Aprovado</span></td>
                  <td>15/01/2024</td>
                  <td>
                    <button className="action-btn">✏️</button>
                    <button className="action-btn">👁️</button>
                  </td>
                </tr>
                <tr>
                  <td>Hotel B</td>
                  <td>reservas@hotel-b.com</td>
                  <td>1</td>
                  <td><span className="badge pending">Aguardando Aprovação</span></td>
                  <td>28/01/2024</td>
                  <td>
                    <button className="action-btn">✏️</button>
                    <button className="action-btn">✅</button>
                  </td>
                </tr>
                <tr>
                  <td>Loja Souvenir C</td>
                  <td>vendas@souvenir-c.com</td>
                  <td>2</td>
                  <td><span className="badge approved">Aprovado</span></td>
                  <td>10/01/2024</td>
                  <td>
                    <button className="action-btn">✏️</button>
                    <button className="action-btn">👁️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Relatórios */}
        <section className="reports-section">
          <h2>Relatórios Rápidos</h2>
          <div className="reports-container">
            <div className="report-card">
              <h4>📈 Relatório Semanal</h4>
              <p>Dados de atividade da semana passada</p>
              <button className="btn btn-secondary">Gerar</button>
            </div>

            <div className="report-card">
              <h4>📊 Relatório Mensal</h4>
              <p>Análise completa do mês</p>
              <button className="btn btn-secondary">Gerar</button>
            </div>

            <div className="report-card">
              <h4>💰 Relatório Financeiro</h4>
              <p>Dados de receita e gastos</p>
              <button className="btn btn-secondary">Gerar</button>
            </div>

            <div className="report-card">
              <h4>📋 Relatório de Comerciantes</h4>
              <p>Desempenho dos parceiros</p>
              <button className="btn btn-secondary">Gerar</button>
            </div>
          </div>
        </section>
      </div>
      </DashboardLayout>
    </>
  );
}
