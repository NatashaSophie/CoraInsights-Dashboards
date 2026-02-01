import React from 'react';
import { useAuth } from '../context/AuthContext';

function DashboardPeregrino() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard do Peregrino</h2>
        <p>Bem-vindo, {user?.name}!</p>
      </div>
      
      <div className="dashboard-content">
        <div className="card">
          <h3>👣 Você está logado como Peregrino</h3>
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

export default DashboardPeregrino;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const styles = {
  ...commonStyles,
  page: {
    ...commonStyles.page
  },
  header: {
    background: gradients.brown,
    color: 'white',
    padding: '24px 0',
    boxShadow: '0 4px 20px rgba(93, 64, 55, 0.3)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0
  }
};

export default function DashboardPeregrino({ user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const analytics = await fetchPilgrimAnalytics();
      setData(analytics);
    } catch (err) {
      console.error('Erro ao carregar analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={commonStyles.loading}>
        <div style={commonStyles.spinner}></div>
        <p style={{ marginTop: '20px', color: colors.textMedium }}>Carregando dados...</p>
        <style>{String.raw`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: '#ffebee', padding: '20px', borderRadius: '8px', color: '#c62828' }}>
          <h2>Erro ao carregar dados</h2>
          <p>{error}</p>
          <button onClick={loadAnalytics} style={{
            marginTop: '16px',
            padding: '10px 20px',
            background: colors.brownMedium,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  const { kpis = {}, charts = {}, tables = {} } = data;

  // Preparar dados para gráficos
  const timeSeriesChart = {
    labels: (charts.timeSeries || []).map(d => d.date),
    datasets: [{
      label: 'Percursos Concluídos',
      data: (charts.timeSeries || []).map(d => d.value),
      borderColor: colors.brownDark,
      backgroundColor: 'rgba(93, 64, 55, 0.1)',
      tension: 0.3,
      fill: true,
      pointBackgroundColor: colors.brownDark,
      pointBorderColor: colors.white,
      pointBorderWidth: 2,
      pointRadius: 4
    }]
  };

  const byTrechoChart = {
    labels: (charts.byTrecho || []).map(d => d.label),
    datasets: [{
      label: 'Quantidade',
      data: (charts.byTrecho || []).map(d => d.value),
      backgroundColor: chartColors.bars,
      borderRadius: 6,
      borderSkipped: false
    }]
  };

  const statusChart = {
    labels: (charts.status || []).map(d => d.name),
    datasets: [{
      data: (charts.status || []).map(d => d.value),
      backgroundColor: [colors.brownDark, colors.brownLighter],
      borderColor: colors.white,
      borderWidth: 2,
      borderRadius: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: true, position: 'top' } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(93, 64, 55, 0.08)' }, ticks: { color: colors.textLight } },
      x: { grid: { display: false }, ticks: { color: colors.textLight } }
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.headerTitle}>Meu Dashboard</h1>
            <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>
              Bem-vindo, {user.name}!
            </p>
          </div>
        </div>
      </header>

      <main style={commonStyles.main}>
        {/* KPIs */}
        <div style={commonStyles.cardsGrid}>
          <div style={{ ...commonStyles.statCard, background: gradients.brownDark }}>
            <div style={commonStyles.statCardIcon}>📍</div>
            <div style={commonStyles.statCardLabel}>Total de Percursos</div>
            <div style={commonStyles.statCardValue}>{kpis.totalTrails || 0}</div>
            <div style={commonStyles.statCardSubtitle}>{kpis.completedTrails || 0} concluídos</div>
          </div>

          <div style={{ ...commonStyles.statCard, background: gradients.brown }}>
            <div style={commonStyles.statCardIcon}>✅</div>
            <div style={commonStyles.statCardLabel}>Distância Total</div>
            <div style={commonStyles.statCardValue}>{(kpis.totalDistance || 0).toFixed(1)}</div>
            <div style={commonStyles.statCardSubtitle}>km percorridos</div>
          </div>

          <div style={{ ...commonStyles.statCard, background: gradients.brownMedium }}>
            <div style={commonStyles.statCardIcon}>⏱️</div>
            <div style={commonStyles.statCardLabel}>Tempo Total</div>
            <div style={commonStyles.statCardValue}>{(kpis.totalTime || 0).toFixed(1)}</div>
            <div style={commonStyles.statCardSubtitle}>horas em trilhas</div>
          </div>

          <div style={{ ...commonStyles.statCard, background: gradients.sienna }}>
            <div style={commonStyles.statCardIcon}>🎯</div>
            <div style={commonStyles.statCardLabel}>Em Progresso</div>
            <div style={commonStyles.statCardValue}>{kpis.activeTrails || 0}</div>
            <div style={commonStyles.statCardSubtitle}>percursos ativos</div>
          </div>
        </div>

        {/* Seção de Gráficos */}
        <div style={commonStyles.sectionTitle}>
          <span style={commonStyles.sectionIcon}>📊</span>
          Análises e Estatísticas
        </div>

        <div style={commonStyles.chartsGrid}>
          <div style={commonStyles.chartCard}>
            <div style={commonStyles.chartCardHeader}>
              <h3 style={commonStyles.chartCardTitle}>📈 Progresso Mensal</h3>
              <p style={commonStyles.chartCardSubtitle}>Percursos concluídos ao longo do tempo</p>
            </div>
            <div style={commonStyles.chartCardBody}>
              <Line data={timeSeriesChart} options={chartOptions} />
            </div>
          </div>

          <div style={commonStyles.chartCard}>
            <div style={commonStyles.chartCardHeader}>
              <h3 style={commonStyles.chartCardTitle}>🗺️ Por Trecho</h3>
              <p style={commonStyles.chartCardSubtitle}>Quantidade de vezes realizado</p>
            </div>
            <div style={commonStyles.chartCardBody}>
              <Bar data={byTrechoChart} options={chartOptions} />
            </div>
          </div>

          <div style={commonStyles.chartCard}>
            <div style={commonStyles.chartCardHeader}>
              <h3 style={commonStyles.chartCardTitle}>📊 Status</h3>
              <p style={commonStyles.chartCardSubtitle}>Distribuição de percursos</p>
            </div>
            <div style={{ ...commonStyles.chartCardBody, display: 'flex', justifyContent: 'center' }}>
              <div style={{ maxWidth: '280px' }}>
                <Doughnut
                  data={statusChart}
                  options={{
                    responsive: true,
                    cutout: '60%',
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 10 } } }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Histórico */}
        {(tables.ranking && tables.ranking.length > 0) && (
          <div style={commonStyles.chartCard}>
            <div style={commonStyles.chartCardHeader}>
              <h3 style={commonStyles.chartCardTitle}>📋 Histórico Recente</h3>
              <p style={commonStyles.chartCardSubtitle}>Seus últimos percursos</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={commonStyles.table}>
                <thead style={commonStyles.tableHeader}>
                  <tr>
                    <th style={commonStyles.th}>#</th>
                    <th style={commonStyles.th}>Data</th>
                    <th style={commonStyles.th}>Trecho</th>
                    <th style={{ ...commonStyles.th, textAlign: 'right' }}>Distância (km)</th>
                    <th style={{ ...commonStyles.th, textAlign: 'right' }}>Duração (h)</th>
                    <th style={commonStyles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.ranking.map((item, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? colors.lightBg : colors.white }}>
                      <td style={commonStyles.td}>{item.rank}</td>
                      <td style={commonStyles.td}>{item.date}</td>
                      <td style={commonStyles.td}>{item.trecho}</td>
                      <td style={{ ...commonStyles.td, textAlign: 'right' }}>{(item.distance || 0).toFixed(1)}</td>
                      <td style={{ ...commonStyles.td, textAlign: 'right' }}>{typeof item.duration === 'number' ? item.duration.toFixed(2) : item.duration}</td>
                      <td style={commonStyles.td}>
                        <span style={{
                          ...commonStyles.badge,
                          background: item.status === 'Concluído' ? colors.brownDark : colors.brownLighter,
                          color: 'white'
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <footer style={commonStyles.footer}>
          <p>© 2026 Caminho de Cora - Dashboard Peregrino</p>
        </footer>
      </main>
    </div>
  );
}
