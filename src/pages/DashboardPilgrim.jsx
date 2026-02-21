import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { usePilgrimDashboard } from '../hooks/usePilgrimDashboard';
import { TrailMap } from '../components/TrailMap/TrailMap';
import './DashboardPilgrim.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function DashboardPilgrim() {
  const {
    kpiData,
    loading,
    error,
    debugInfo,
    routeProgress,
    timePerRoute,
    timePerRouteByModality,
    trailParts,
    allCheckpoints
  } = usePilgrimDashboard();

  const totalRoutes = 13;
  const inProgressRoute = kpiData?.inProgressRoute || { hasActive: false };
  const inProgressLabel = inProgressRoute.hasActive
    ? (inProgressRoute.routeName || `Trecho ${inProgressRoute.routeId}`)
    : 'Nenhum';

  const routeProgressMap = new Map(
    (routeProgress || []).map(route => [Number(route.id), route])
  );

  const routeBadges = Array.from({ length: totalRoutes }, (_, index) => {
    const routeId = index + 1;
    const progress = routeProgressMap.get(routeId);
    return {
      id: `route-${routeId}`,
      label: `Trecho ${routeId}`,
      unlocked: (progress?.completions || 0) > 0
    };
  });

  const badges = [
    ...routeBadges,
    {
      id: 'full-path',
      label: 'Caminho completo',
      unlocked: (kpiData?.fullPathCompletions || 0) > 0
    },
    {
      id: 'full-path-foot',
      label: 'Caminho a pe',
      unlocked: (kpiData?.completedTrailsByModality?.foot || 0) > 0
    },
    {
      id: 'full-path-bike',
      label: 'Caminho pedalando',
      unlocked: (kpiData?.completedTrailsByModality?.bike || 0) > 0
    },
    {
      id: 'direction-correct',
      label: 'Direcao correta',
      unlocked: (kpiData?.completedTrailsByDirection?.correct || 0) > 0
    },
    {
      id: 'direction-inverse',
      label: 'Direcao inversa',
      unlocked: (kpiData?.completedTrailsByDirection?.inverse || 0) > 0
    }
  ];

  const timeChartData = (timePerRouteByModality || []).length
    ? timePerRouteByModality.map(route => ({
        id: route.id,
        name: route.name,
        walk: route.avgWalkHours || 0,
        bike: route.avgBikeHours || 0
      }))
    : (timePerRoute || []).map(route => ({
        id: route.id,
        name: route.name,
        walk: route.avgHours || 0,
        bike: 0
      }));

  const timePartsMap = timeChartData.reduce((acc, part) => {
    acc[String(part.id)] = part;
    return acc;
  }, {});

  const partsLegend = (trailParts || []).map(part => ({
    id: part.id,
    name: part.name || `Trecho ${part.id}`
  }));

  const partsNameMap = (trailParts || []).reduce((acc, part) => {
    acc[String(part.id)] = part.name || `Trecho ${part.id}`;
    return acc;
  }, {});

  const getPartName = (id) => partsNameMap[String(id)] || `Trecho ${id}`;

  const timeByRouteChart = {
    labels: timeChartData.map(part => String(part.id)),
    datasets: [
      {
        label: 'Caminhando',
        data: timeChartData.map(part => part.walk || 0),
        backgroundColor: '#00b894',
        borderRadius: 6
      },
      {
        label: 'Pedalando',
        data: timeChartData.map(part => part.bike || 0),
        backgroundColor: '#0984e3',
        borderRadius: 6
      }
    ]
  };

  const timeChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (items) => {
            const id = items?.[0]?.label;
            return getPartName(id);
          },
          beforeBody: (items) => {
            const id = items?.[0]?.label;
            const part = timePartsMap[String(id)];
            const total = (part?.walk || 0) + (part?.bike || 0);
            return `Tempo total: ${total.toFixed(2)}h`;
          },
          label: (item) => `${item.dataset.label}: ${item.formattedValue}h`
        }
      }
    },
    scales: {
      x: { stacked: true, ticks: { maxRotation: 0, minRotation: 0 } },
      y: { stacked: true, beginAtZero: true }
    }
  };
  const segmentNames = trailParts?.length
    ? trailParts.map(part => part.name || `Trecho ${part.id}`)
    : Array.from({ length: totalRoutes }, (_, index) => `Trecho ${index + 1}`);

  const routeProgressById = new Map(
    (routeProgress || []).map(route => [Number(route.id), route])
  );
  const segmentStatus = trailParts?.length
    ? trailParts.map(part => ({
        completed: (routeProgressById.get(Number(part.id))?.completions || 0) > 0
      }))
    : Array.from({ length: totalRoutes }, () => ({ completed: false }));

  const inProgressRouteId = inProgressRoute?.hasActive
    ? Number(inProgressRoute.routeId)
    : null;
  const segmentTooltips = trailParts?.length
    ? trailParts.map(part => {
        const progress = routeProgressById.get(Number(part.id));
        const completions = progress?.completions || 0;
        const base = part.name || `Trecho ${part.id}`;
        const parts = [base];
        if (completions > 0) {
          parts.push(`Percorrido ${completions} ${completions === 1 ? 'vez' : 'vezes'}`);
        } else {
          parts.push('Nunca percorrido');
        }
        if (inProgressRouteId && Number(part.id) === inProgressRouteId) {
          parts.push('Trilha em andamento');
        }
        return parts.join(' - ');
      })
    : Array.from({ length: totalRoutes }, (_, index) => `Trecho ${index + 1} - Nunca percorrido`);

  const orderedCheckpoints = trailParts
    .map(part => part.fromCheckpoint)
    .filter(checkpoint => checkpoint && Number.isFinite(checkpoint.lat) && Number.isFinite(checkpoint.lon));

  const lastToCheckpoint = trailParts.length
    ? trailParts[trailParts.length - 1].toCheckpoint
    : null;
  if (lastToCheckpoint && Number.isFinite(lastToCheckpoint.lat) && Number.isFinite(lastToCheckpoint.lon)) {
    orderedCheckpoints.push(lastToCheckpoint);
  }

  const checkpointMarkers = (allCheckpoints || []).filter(
    checkpoint => checkpoint && Number.isFinite(checkpoint.lat) && Number.isFinite(checkpoint.lon)
  );

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
              <div className="kpi-icon">🏁</div>
              <div className="kpi-content">
                <p className="kpi-label">Caminho Completo</p>
                <p className="kpi-value">{loading ? '-' : kpiData?.fullPathCompletions || 0}</p>
                <p className="kpi-subtext">Percursos concluídos</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">📍</div>
              <div className="kpi-content">
                <p className="kpi-label">Trechos Completados</p>
                <p className="kpi-value">{loading ? '-' : `${kpiData?.routesCompleted || 0}`}</p>
                <div className="kpi-progress">
                  <div className="progress-bar" style={{ width: `${kpiData?.completionPercentage || 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">💨</div>
              <div className="kpi-content">
                <p className="kpi-label">Velocidade Média</p>
                <p className="kpi-value">{loading ? '-' : `${kpiData?.avgSpeedKmh || 0} km/h`}</p>
                <p className="kpi-subtext">Desde o início</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🧭</div>
              <div className="kpi-content">
                <p className="kpi-label">Percurso em andamento</p>
                <p className="kpi-value">{loading ? '-' : inProgressLabel}</p>
                <p className="kpi-subtext">{inProgressRoute.hasActive ? 'Em andamento' : 'Sem percurso ativo'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="badges-section">
          <h2>Conquistas Alcançadas</h2>
          <div className="badges-grid">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`badge-card ${badge.unlocked ? 'badge-unlocked' : 'badge-locked'}`}
                title={badge.unlocked ? 'Conquista desbloqueada' : 'Conquista bloqueada'}
              >
                <div className="badge-icon">🏅</div>
                <div className="badge-label">{badge.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Gráficos e Análises */}
        <section className="charts-section">
          <h2>Análises da Jornada</h2>
          <div className="charts-container full-width">
            <div className="chart-card map-card">
              <h3>Progresso da Trilha</h3>
              <TrailMap
                kmlUrl="http://localhost:1337/maps/caminho-cora.kml"
                completedCount={kpiData?.routesCompleted || 0}
                totalCount={totalRoutes}
                segmentNames={segmentNames}
                checkpoints={orderedCheckpoints}
                markers={checkpointMarkers}
                segmentStatus={segmentStatus}
                segmentTooltips={segmentTooltips}
              />
            </div>
          </div>
        </section>

        <section className="charts-section">
          <div className="charts-container full-width">
            <div className="chart-card">
              <h3>Tempo por Trecho</h3>
              <p className="chart-card-subtitle">Tempo médio para conclusão de cada trecho</p>
              <div className="time-chart-layout">
                <div className="time-chart-canvas">
                  <Bar data={timeByRouteChart} options={timeChartOptions} />
                </div>
                <div className="time-chart-legend">
                  <h4>Legenda (ID - Trecho)</h4>
                  <div className="legend-list">
                    {(partsLegend.length
                      ? partsLegend
                      : Array.from({ length: totalRoutes }, (_, index) => ({
                          id: index + 1,
                          name: `Trecho ${index + 1}`
                        }))
                    ).map(part => (
                      <div key={part.id} className="legend-item">
                        <span className="legend-id">{part.id}</span>
                        <span className="legend-name">{part.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
