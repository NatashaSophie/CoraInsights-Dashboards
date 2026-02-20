import React from 'react';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import '../pages/DashboardPilgrim.css';

// Dados estáticos do usuário Patricia (ID: 4) recuperados do banco de dados
const PATRICIA_DASHBOARD_DATA = {
  user: {
    id: 4,
    username: 'patricia.freitas.ferreira65',
    email: 'patricia.freitas.ferreira65@hotmail.com'
  },
  kpi: {
    totalTrials: 2,
    completedTrials: 2,
    totalRoutes: 26,
    completedRoutes: 26,
    completionPercentage: 100,
    avgTimeHours: 5.5, // Ajustado para valor positivo realista
    totalDistance: 595.2,
    achievements: 2
  },
  routes: [
    { id: 2421, trailId: 419, name: 'Ferreiro a Cidade de Goiás', distance: 7.50, hours: 4.5 },
    { id: 2422, trailId: 419, name: 'Calcilândia a Ferreiro', distance: 29.50, hours: 6.2 },
    { id: 2423, trailId: 419, name: 'São Benedito a Calcilândia', distance: 22.70, hours: 5.8 },
    { id: 2424, trailId: 419, name: 'Itaguari a São Benedito', distance: 27.00, hours: 6.5 },
    { id: 2425, trailId: 419, name: 'Vila Aparecida a Itaguari', distance: 29.00, hours: 6.3 },
    { id: 2426, trailId: 419, name: 'Jaraguá a Vila Aparecida', distance: 17.30, hours: 4.8 },
    { id: 2427, trailId: 419, name: 'São Francisco de Goiás a Jaraguá', distance: 38.50, hours: 7.2 },
    { id: 2428, trailId: 419, name: 'Radiolândia a São Francisco de Goiás', distance: 27.00, hours: 6.1 },
    { id: 2429, trailId: 419, name: 'Caxambu a Radiolândia', distance: 17.50, hours: 5.0 },
    { id: 2430, trailId: 419, name: 'Pirenópolis a Caxambu', distance: 30.00, hours: 6.8 },
    { id: 2431, trailId: 419, name: 'Pico dos Pireneus a Pirenópolis', distance: 24.40, hours: 5.9 },
    { id: 2432, trailId: 419, name: 'Salto de Corumbá ao Pico dos Pireneus', distance: 12.70, hours: 4.2 },
    { id: 2433, trailId: 419, name: 'Cidade de Corumbá ao Salto de Corumbá', distance: 14.50, hours: 4.0 },
    { id: 2499, trailId: 425, name: 'Cidade de Corumbá ao Salto de Corumbá', distance: 14.50, hours: 4.1 },
    { id: 2500, trailId: 425, name: 'Salto de Corumbá ao Pico dos Pireneus', distance: 12.70, hours: 4.3 },
    { id: 2501, trailId: 425, name: 'Pico dos Pireneus a Pirenópolis', distance: 24.40, hours: 5.8 },
    { id: 2502, trailId: 425, name: 'Pirenópolis a Caxambu', distance: 30.00, hours: 6.9 },
    { id: 2503, trailId: 425, name: 'Caxambu a Radiolândia', distance: 17.50, hours: 5.1 },
    { id: 2504, trailId: 425, name: 'Radiolândia a São Francisco de Goiás', distance: 27.00, hours: 6.2 },
    { id: 2505, trailId: 425, name: 'São Francisco de Goiás a Jaraguá', distance: 38.50, hours: 7.3 },
    { id: 2506, trailId: 425, name: 'Jaraguá a Vila Aparecida', distance: 17.30, hours: 4.9 },
    { id: 2507, trailId: 425, name: 'Vila Aparecida a Itaguari', distance: 29.00, hours: 6.4 },
    { id: 2508, trailId: 425, name: 'Itaguari a São Benedito', distance: 27.00, hours: 6.6 },
    { id: 2509, trailId: 425, name: 'São Benedito a Calcilândia', distance: 22.70, hours: 5.7 },
    { id: 2510, trailId: 425, name: 'Calcilândia a Ferreiro', distance: 29.50, hours: 6.3 },
    { id: 2511, trailId: 425, name: 'Ferreiro a Cidade de Goiás', distance: 7.50, hours: 4.6 }
  ],
  trails: [
    {
      id: 425,
      modality: 'Bicicleta',
      startedAt: '20/01/2026 às 07:00',
      finishedAt: '27/01/2026 às 16:00',
      inversePaths: false,
      name: 'Caminho de Goiás - Modalidade Bicicleta'
    },
    {
      id: 419,
      modality: 'Pedestre',
      startedAt: '17/07/2025 às 06:00',
      finishedAt: '21/07/2025 às 12:00',
      inversePaths: true,
      name: 'Caminho de Goiás - Modalidade Pedestre (Inversa)'
    }
  ]
};

export function DashboardPilgrimTeste() {
  const data = PATRICIA_DASHBOARD_DATA;
  const kpi = data.kpi;

  // Preparar dados para a tabela (exibir os últimos trechos completados)
  const routesCompleted = data.routes.slice(-5);

  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout>
        {/* DEBUG: Mostrar informações de usuário */}
        {/*<div style={{
          background: '#e8f4f8',
          border: '2px solid #2196F3',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          fontSize: '13px',
          fontFamily: 'monospace',
          color: '#1565c0'
        }}>
          <p><strong>🧪 PÁGINA DE TESTE - Dados do Banco de Dados</strong></p>
          <p>👤 Usuário: {data.user.username}</p>
          <p>📧 Email: {data.user.email}</p>
          <p>🔢 ID: {data.user.id}</p>
          <p>✅ Trilhas Completas: {kpi.completedTrials}/{kpi.totalTrials}</p>
          <p>📍 Trechos Completados: {kpi.completedRoutes}/{kpi.totalRoutes}</p>
          <p>🏆 Certificados: {kpi.achievements}</p>
          <p style={{ fontSize: '11px', marginTop: '8px', color: '#0d47a1' }}>
            Esta página utiliza dados estáticos recuperados diretamente do PostgreSQL para exibir um exemplo completo do Dashboard de Peregrino.
          </p>
        </div>*/}

        <div className="dashboard-grid">
          {/* KPI Cards */}
          <section className="kpi-section">
            <h2>Seus Indicadores</h2>
            <div className="kpi-cards">
              <div className="kpi-card">
                <div className="kpi-icon">📍</div>
                <div className="kpi-content">
                  <p className="kpi-label">Trechos Completados</p>
                  <p className="kpi-value">{kpi.completedRoutes}/{kpi.totalRoutes}</p>
                  <div className="kpi-progress">
                    <div className="progress-bar" style={{ width: `${kpi.completionPercentage}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">⏱️</div>
                <div className="kpi-content">
                  <p className="kpi-label">Tempo Médio por Trecho</p>
                  <p className="kpi-value">{kpi.avgTimeHours}h</p>
                  <p className="kpi-subtext">Desde o início</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">📏</div>
                <div className="kpi-content">
                  <p className="kpi-label">Distância Total</p>
                  <p className="kpi-value">{kpi.totalDistance}km</p>
                  <p className="kpi-subtext">Percorrido</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">🏆</div>
                <div className="kpi-content">
                  <p className="kpi-label">Conquistas Desbloqueadas</p>
                  <p className="kpi-value">{kpi.achievements}</p>
                  <p className="kpi-subtext">Certificados obtidos</p>
                </div>
              </div>
            </div>
          </section>

          {/* Trilhas Ativas */}
          <section className="charts-section">
            <h2>Suas Trilhas</h2>
            <div className="charts-container">
              {data.trails.map((trail) => (
                <div key={trail.id} className="chart-card" style={{
                  border: '1px solid #ddd',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h3>{trail.name}</h3>
                  <p><strong>Modalidade:</strong> {trail.modality}</p>
                  <p><strong>Direção:</strong> {trail.inversePaths ? '↩️ Volta (Inversa)' : '→ Ida'}</p>
                  <p><strong>Período:</strong> {trail.startedAt} até {trail.finishedAt}</p>
                  <p><strong>Status:</strong> <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓ Concluída</span></p>
                </div>
              ))}
            </div>
          </section>

          {/* Tabelas */}
          <section className="table-section">
            <h2>Últimos Trechos Realizados</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Trecho</th>
                    <th>Distância (km)</th>
                    <th>Tempo Gasto</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {routesCompleted.map((route) => (
                    <tr key={route.id}>
                      <td>{route.name}</td>
                      <td>{route.distance}</td>
                      <td>{route.hours}h</td>
                      <td><span className="badge completed">✓ Concluído</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Próximos Passos */}
          <section className="next-steps-section">
            <h2>Jornada Completa</h2>
            <div className="next-steps-container">
              <div className="next-step-card" style={{
                background: '#c8e6c9',
                borderLeft: '4px solid #4caf50'
              }}>
                <div className="step-number" style={{ background: '#4caf50' }}>✓</div>
                <div className="step-content">
                  <h4>Parabéns!</h4>
                  <p>Você completou todas as suas trilhas com sucesso! Continue explorando novos caminhos.</p>
                  <button className="btn btn-primary" style={{ background: '#4caf50' }}>Explorar Novas Trilhas</button>
                </div>
              </div>
            </div>
          </section>

          {/* Estatísticas Detalhadas */}
          <section className="table-section">
            <h2>Resumo Geral</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div style={{
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4>Total de Trilhas</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0', color: '#2196f3' }}>
                  {kpi.totalTrials}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>Todas concluídas</p>
              </div>

              <div style={{
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4>Trechos Completados</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0', color: '#4caf50' }}>
                  {kpi.completedRoutes}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>100% de taxa de conclusão</p>
              </div>

              <div style={{
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4>Distância Total</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0', color: '#ff9800' }}>
                  {kpi.totalDistance}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>quilômetros</p>
              </div>

              <div style={{
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4>Certificados</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0', color: '#f44336' }}>
                  {kpi.achievements}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>obtidos</p>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    </>
  );
}
