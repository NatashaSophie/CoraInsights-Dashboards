import React from 'react';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { usePilgrimDashboard } from '../hooks/usePilgrimDashboard';
import './DashboardPilgrim.css';

export function DashboardPilgrim() {
  const { kpiData, loading, error, debugInfo } = usePilgrimDashboard();

  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout>
        {/* DEBUG: Mostrar informações de carregamento */}
        {debugInfo && (
          <div style={{
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#333'
          }}>
            <p><strong>📊 DEBUG - Informações de Carregamento</strong></p>
            <p>⏰ Timestamp: {debugInfo.timestamp}</p>
            <p>👤 Usuário: {debugInfo.userInfo?.username || 'Não autenticado'} (ID: {debugInfo.userInfo?.userId || 'N/A'})</p>
            <p>✅ Campos carregados: {debugInfo.loadedFields.length > 0 ? debugInfo.loadedFields.join(', ') : 'Nenhum'}</p>
            <p>❌ Campos falhados: {debugInfo.failedFields.length > 0 ? debugInfo.failedFields.join(', ') : 'Nenhum'}</p>
            {debugInfo.error && <p>🚨 Erro: {debugInfo.error}</p>}
          </div>
        )}

        {/* Mensagem de erro (se houver) */}
        {error && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            color: '#856404'
          }}>
            <p><strong>⚠️ Aviso:</strong> Erro ao carregar dados: {error}</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Os indicadores abaixo estão zerados. Tente recarregar a página.</p>
          </div>
        )}

      <div className="dashboard-grid">
        {/* KPI Cards */}
        <section className="kpi-section">
          <h2>Seus Indicadores</h2>
          <div className="kpi-cards">
            <div className="kpi-card">
              <div className="kpi-icon">📍</div>
              <div className="kpi-content">
                <p className="kpi-label">Trechos Completados</p>
                <p className="kpi-value">{loading ? '-' : `${kpiData?.routesCompleted || 0}/${kpiData?.totalRoutes || 13}`}</p>
                <div className="kpi-progress">
                  <div className="progress-bar" style={{ width: `${kpiData?.completionPercentage || 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">⏱️</div>
              <div className="kpi-content">
                <p className="kpi-label">Tempo Médio por Trecho</p>
                <p className="kpi-value">{loading ? '-' : `${kpiData?.avgTimeHours || 0}h`}</p>
                <p className="kpi-subtext">Desde o início</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">📅</div>
              <div className="kpi-content">
                <p className="kpi-label">Próximo Trecho</p>
                <p className="kpi-value">Trecho {(kpiData?.routesCompleted || 0) + 1}</p>
                <p className="kpi-subtext">A definir</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🏆</div>
              <div className="kpi-content">
                <p className="kpi-label">Conquistas Desbloqueadas</p>
                <p className="kpi-value">{loading ? '-' : kpiData?.achievements || 0}</p>
                <p className="kpi-subtext">Badges e certificados</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gráficos e Análises */}
        <section className="charts-section">
          <h2>Análises da Jornada</h2>
          <div className="charts-container">
            <div className="chart-card placeholder">
              <h3>Progresso da Trilha</h3>
              <div className="placeholder-content">
                [Gráfico de Progresso]
              </div>
            </div>

            <div className="chart-card placeholder">
              <h3>Tempo por Trecho</h3>
              <div className="placeholder-content">
                [Gráfico de Tempo]
              </div>
            </div>
          </div>
        </section>

        {/* Tabelas */}
        <section className="table-section">
          <h2>Trechos Realizados</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trecho</th>
                  <th>Data de Início</th>
                  <th>Data de Conclusão</th>
                  <th>Tempo Gasto</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Trecho 1</td>
                  <td>01/01/2024</td>
                  <td>05/01/2024</td>
                  <td>4h 30m</td>
                  <td><span className="badge completed">Concluído</span></td>
                </tr>
                <tr>
                  <td>Trecho 2</td>
                  <td>06/01/2024</td>
                  <td>10/01/2024</td>
                  <td>5h 15m</td>
                  <td><span className="badge completed">Concluído</span></td>
                </tr>
                <tr>
                  <td>Trecho 3</td>
                  <td>12/01/2024</td>
                  <td>16/01/2024</td>
                  <td>3h 45m</td>
                  <td><span className="badge completed">Concluído</span></td>
                </tr>
                <tr>
                  <td>Trecho 4</td>
                  <td>18/01/2024</td>
                  <td>22/01/2024</td>
                  <td>6h 00m</td>
                  <td><span className="badge completed">Concluído</span></td>
                </tr>
                <tr>
                  <td>Trecho 5</td>
                  <td>24/01/2024</td>
                  <td>28/01/2024</td>
                  <td>5h 30m</td>
                  <td><span className="badge completed">Concluído</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Próximos Passos */}
        <section className="next-steps-section">
          <h2>Próximos Passos</h2>
          <div className="next-steps-container">
            <div className="next-step-card">
              <div className="step-number">6</div>
              <div className="step-content">
                <h4>Próximo Trecho</h4>
                <p>Prepare-se para iniciar o trecho 6. Confira o mapa e as informações disponíveis.</p>
                <button className="btn btn-primary">Visualizar Trecho</button>
              </div>
            </div>
          </div>
        </section>
      </div>
      </DashboardLayout>
    </>
  );
}
