import React from 'react';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { useManagerDashboard } from '../hooks/useManagerDashboard';
import './DashboardManager.css';


/*
  TRATAMENTO DE ERROS
*/

export function DashboardManager() {
  const { data, kpiData, loading, error } = useManagerDashboard();

  
  // Dados fallback quando há erro
  const fallbackKpiData = {
    totalUsers: 0,
    totalTrails: 0,
    publishedTrails: 0,
    completionRate: 0,
    activeUsers: 0
  };


  const displayKpiData = error ? fallbackKpiData : kpiData;

  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout>
        {/* Debug Info - Para testes */}
        {error && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h3 style={{ marginTop: 0 }}>📊 Debug - Dados Carregados</h3>
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Expandir / Recolher</summary>
              <pre style={{ 
                backgroundColor: '#fff', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                
{`Dados Disponíveis:
${data ? '✅ Data Object' : '❌ Data Object'}
${data?.users ? '  ✅ Users' : '  ❌ Users'}
${data?.trails ? '  ✅ Trails' : '  ❌ Trails'}
${data?.activity ? '  ✅ Activity' : '  ❌ Activity'}
${data?.topTrails ? '  ✅ Top Trails' : '  ❌ Top Trails'}
${data?.completionRate ? '  ✅ Completion Rate' : '  ❌ Completion Rate'}
${data?.activeUsers ? '  ✅ Active Users' : '  ❌ Active Users'}



Erro: ${error || 'Nenhum erro'}`}
              </pre>
            </details>
          </div>
        )}

        {/* Mensagem de Erro */}
        {error && (
          <div className="error-message" style={{ marginBottom: '20px' }}>
            <p>⚠️ Erro ao carregar dados: {error}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Os gráficos e dados estão zerados até que o carregamento seja bem-sucedido.</p>
          </div>
        )}
      
      
      
      <div className="dashboard-grid">
        {/* KPI Cards */}
        <section className="kpi-section">
          <h2>Indicadores Gerenciais</h2>
          <div className="kpi-cards">
            <div className="kpi-card">
              <div className="kpi-icon">👥</div>
              <div className="kpi-content">
                <p className="kpi-label">Total de Peregrinos</p>
                <p className="kpi-value">{loading ? '-' : displayKpiData?.totalUsers || 0}</p>
                <p className="kpi-subtext">Usuários ativos</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">✅</div>
              <div className="kpi-content">
                <p className="kpi-label">Taxa de Conclusão</p>
                <p className="kpi-value">{loading ? '-' : `${displayKpiData?.completionRate || 0}%`}</p>
                <p className="kpi-subtext">Jornadas completas</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">⏳</div>
              <div className="kpi-content">
                <p className="kpi-label">Trilhas Publicadas</p>
                <p className="kpi-value">{loading ? '-' : displayKpiData?.publishedTrails || 0}</p>
                <p className="kpi-subtext">Total: {loading ? '-' : displayKpiData?.totalTrails || 0}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🏪</div>
              <div className="kpi-content">
                <p className="kpi-label">Usuários Ativos</p>
                <p className="kpi-value">{loading ? '-' : displayKpiData?.activeUsers || 0}</p>
                <p className="kpi-subtext">Jornadas em andamento</p>
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
