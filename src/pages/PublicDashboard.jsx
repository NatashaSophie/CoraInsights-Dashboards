import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

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

const API_URL = 'http://localhost:1337';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f0e8 0%, #faf7f2 50%, #efe8dc 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    background: 'linear-gradient(135deg, #5d4037 0%, #6d4c41 50%, #795548 100%)',
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
  headerIcon: {
    background: 'rgba(255,255,255,0.15)',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '32px'
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0
  },
  headerSubtitle: {
    fontSize: '14px',
    opacity: 0.9,
    marginTop: '4px'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statCard: {
    borderRadius: '16px',
    padding: '24px',
    color: 'white',
    boxShadow: '0 8px 32px rgba(93, 64, 55, 0.15)',
    position: 'relative',
    overflow: 'hidden'
  },
  statCardIcon: { fontSize: '36px', marginBottom: '8px' },
  statCardLabel: { fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 },
  statCardValue: { fontSize: '36px', fontWeight: 'bold', margin: '8px 0' },
  statCardSubtitle: { fontSize: '13px', opacity: 0.85 },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  sectionIcon: {
    background: '#efebe9',
    color: '#6d4c41',
    padding: '10px',
    borderRadius: '10px',
    fontSize: '20px'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  chartCard: {
    background: '#fffcf8',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(93, 64, 55, 0.08)',
    overflow: 'hidden',
    border: '1px solid #e8e0d5'
  },
  chartCardHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #e8e0d5',
    background: 'linear-gradient(to right, #f5f0e8, #fffcf8)'
  },
  chartCardTitle: { fontSize: '16px', fontWeight: '600', color: '#4e342e', margin: 0 },
  chartCardSubtitle: { fontSize: '13px', color: '#8d6e63', marginTop: '4px' },
  chartCardBody: { padding: '24px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  tableHeader: { background: 'linear-gradient(135deg, #5d4037 0%, #6d4c41 100%)', color: 'white' },
  th: { padding: '16px 12px', textAlign: 'left', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '16px 12px', borderBottom: '1px solid #e8e0d5' },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8d6e63, #a1887f)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  pointsBadge: {
    background: 'linear-gradient(135deg, #5d4037, #6d4c41)',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '20px',
    fontWeight: 'bold'
  },
  footer: { textAlign: 'center', padding: '32px', color: '#a1887f', fontSize: '14px' },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f0e8 0%, #faf7f2 100%)'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e8e0d5',
    borderTop: '4px solid #8d6e63',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

// Paleta sóbria: apenas tons de marrom
const gradients = {
  brownDark: 'linear-gradient(135deg, #3e2723 0%, #4e342e 100%)',
  brown: 'linear-gradient(135deg, #5d4037 0%, #6d4c41 100%)',
  brownMedium: 'linear-gradient(135deg, #6d4c41 0%, #795548 100%)',
  sienna: 'linear-gradient(135deg, #8d6e63 0%, #a1887f 100%)'
};

function PublicDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL + '/dashboards/public');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados da API');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '20px', color: '#666' }}>Carregando dados...</p>
        <style>{String.raw`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.loading, background: '#fff3e0' }}>
        <div style={{ fontSize: '60px' }}>&#9888;</div>
        <p style={{ color: '#e65100', fontSize: '18px', marginTop: '16px' }}>{error}</p>
        <button onClick={fetchData} style={{ marginTop: '16px', padding: '12px 24px', background: '#e65100', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!data) {
    return <div style={styles.loading}>Sem dados disponiveis</div>;
  }

  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months[parseInt(month) - 1] + '/' + year.slice(2);
  };

  const formatTime = (hours) => {
    if (!hours || hours <= 0) return '-';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? h + 'h' + (m > 0 ? m + 'min' : '') : m + 'min';
  };

  const monthlyDataChart = {
    labels: (data.monthlyData || []).map(d => formatMonth(d.month)),
    datasets: [{
      label: 'Novos Cadastros',
      data: (data.monthlyData || []).map(d => d.signups),
      borderColor: '#8d6e63',
      backgroundColor: 'rgba(141, 110, 99, 0.15)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#6d4c41',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5
    }]
  };

  // Cores sóbrias para as linhas do gráfico de incidência (tons de marrom)
  const lineColors = [
    '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', 
    '#6d4c41', '#5d4037', '#4e342e', '#3e2723', '#5d4037', 
    '#6d4c41', '#795548', '#3e2723'  // 13 = marrom muito escuro (Caminho Completo)
  ];

  const completionsByMonthData = data.completionsByMonth || { months: [], series: [] };
  const completionsByMonthChart = {
    labels: (completionsByMonthData.months || []).map(m => formatMonth(m)),
    datasets: (completionsByMonthData.series || []).map((s, i) => ({
      label: s.label,
      data: s.data,
      borderColor: s.routeCount === 13 ? '#4e342e' : lineColors[s.routeCount - 1] || '#a1887f',
      backgroundColor: 'transparent',
      tension: 0.3,
      fill: false,
      pointBackgroundColor: s.routeCount === 13 ? '#4e342e' : lineColors[s.routeCount - 1] || '#a1887f',
      pointBorderColor: '#fffcf8',
      pointBorderWidth: 1,
      pointRadius: 3,
      borderWidth: s.routeCount === 13 ? 3 : 2
    }))
  };

  const avgTimeByRouteChart = {
    labels: (data.partsCompletionData || []).map(p => {
      const name = p.name || 'Trecho ' + p.id;
      return name.length > 20 ? name.slice(0, 20) + '...' : name;
    }),
    datasets: [{
      label: 'Tempo Medio (horas)',
      data: (data.partsCompletionData || []).map(p => p.avgTimeHours || 0),
      backgroundColor: '#5d4037',
      borderRadius: 6
    }]
  };

  const partsCompletionChart = {
    labels: (data.partsCompletionData || []).map(p => {
      const name = p.name || 'Trecho ' + p.id;
      return name.length > 25 ? name.slice(0, 25) + '...' : name;
    }),
    datasets: [{
      label: 'Conclusoes',
      data: (data.partsCompletionData || []).map(p => p.completions),
      backgroundColor: '#8d6e63',
      borderRadius: 6
    }]
  };

  const top5 = (data.topPilgrims || []).slice(0, 5);
  const topPilgrimsChart = {
    labels: top5.map(p => p.nickname),
    datasets: [{
      label: 'Pontuacao',
      data: top5.map(p => p.points),
      backgroundColor: ['#3e2723', '#4e342e', '#5d4037', '#6d4c41', '#795548'],
      borderColor: '#fffcf8',
      borderWidth: 2,
      borderRadius: 8
    }]
  };

  // Cores sóbrias para status do caminho (apenas marrons)
  const statusColors = ['#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723', '#5d4037', '#6d4c41', '#795548', '#4e342e'];
  const statusCaminhoChart = {
    labels: (data.statusCaminho || []).map(s => s.status),
    datasets: [{
      data: (data.statusCaminho || []).map(s => s.count),
      backgroundColor: (data.statusCaminho || []).map((s, i) => {
        if (s.status.includes('Completo')) return '#4e342e';
        if (s.status.includes('Andamento')) return '#a1887f';
        return statusColors[i % statusColors.length];
      }),
      borderWidth: 3,
      borderColor: '#fffcf8'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(93, 64, 55, 0.08)' }, ticks: { color: '#8d6e63' } },
      x: { grid: { display: false }, ticks: { color: '#8d6e63' } }
    }
  };

  const top10Pilgrims = (data.topPilgrims || []).slice(0, 10);

  return (
    <div style={styles.page}>
      <style>{String.raw`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      {/* Top Navigation Bar - White with shadow */}
      <nav style={{
        background: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        marginBottom: '8px'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#3e2723',
          cursor: 'pointer',
          letterSpacing: '0.5px'
        }} onClick={() => navigate('/')}>
          Caminho de Cora - Dashboards
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#6d4c41',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '8px 12px',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#4e342e'}
            onMouseLeave={(e) => e.target.style.color = '#6d4c41'}
          >
            Home
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#6d4c41',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '8px 12px',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#4e342e'}
            onMouseLeave={(e) => e.target.style.color = '#6d4c41'}
          >
            Login
          </button>
        </div>
      </nav>
      
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ ...styles.headerIcon, filter: 'brightness(0) invert(1)' }}>&#128694;</div>
          <div>
            <h1 style={styles.headerTitle}>Caminho de Cora</h1>
            <p style={styles.headerSubtitle}>Dashboard de Estatisticas Publicas</p>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.cardsGrid}>
          <div style={{ ...styles.statCard, background: gradients.brownDark }}>
            <div style={{ ...styles.statCardIcon, filter: 'brightness(0) invert(1)', opacity: 0.9 }}>&#128694;</div>
            <div style={styles.statCardLabel}>Total de Peregrinos</div>
            <div style={styles.statCardValue}>{data.totalPilgrims}</div>
            <div style={styles.statCardSubtitle}>{data.malePilgrims} masc. / {data.femalePilgrims} fem.</div>
          </div>
          <div style={{ ...styles.statCard, background: gradients.brown }}>
            <div style={{ ...styles.statCardIcon, filter: 'brightness(0) invert(1)', opacity: 0.9 }}>&#9989;</div>
            <div style={styles.statCardLabel}>Percursos Concluidos</div>
            <div style={styles.statCardValue}>{data.completedTrails}</div>
            <div style={styles.statCardSubtitle}>caminho completo ou parcial</div>
          </div>
          <div style={{ ...styles.statCard, background: gradients.brownMedium }}>
            <div style={{ ...styles.statCardIcon, filter: 'brightness(0) invert(1)', opacity: 0.9 }}>&#128099;</div>
            <div style={styles.statCardLabel}>Percursos Ativos</div>
            <div style={styles.statCardValue}>{data.activeTrails}</div>
            <div style={styles.statCardSubtitle}>em andamento</div>
          </div>
          <div style={{ ...styles.statCard, background: gradients.sienna }}>
            <div style={{ ...styles.statCardIcon, filter: 'brightness(0) invert(1)', opacity: 0.9 }}>&#127942;</div>
            <div style={styles.statCardLabel}>Caminho Completo</div>
            <div style={styles.statCardValue}>{data.caminhoCompleto || 0}</div>
            <div style={styles.statCardSubtitle}>peregrinos com 13 trechos</div>
          </div>
        </div>

        <div style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>&#128202;</span>
          Analises e Estatisticas
        </div>

        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <div style={styles.chartCardHeader}>
              <h3 style={styles.chartCardTitle}>&#128200; Crescimento Mensal de Cadastros</h3>
              <p style={styles.chartCardSubtitle}>Novos peregrinos cadastrados por mes</p>
            </div>
            <div style={styles.chartCardBody}>
              <Line data={monthlyDataChart} options={chartOptions} />
            </div>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartCardHeader}>
              <h3 style={styles.chartCardTitle}>&#127919; Status do Caminho</h3>
              <p style={styles.chartCardSubtitle}>Distribuicao por trechos completados</p>
            </div>
            <div style={{ ...styles.chartCardBody, display: 'flex', justifyContent: 'center' }}>
              <div style={{ maxWidth: '280px' }}>
                <Doughnut 
                  data={statusCaminhoChart} 
                  options={{
                    responsive: true,
                    cutout: '60%',
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 10, font: { size: 11 } } } }
                  }} 
                />
              </div>
            </div>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartCardHeader}>
              <h3 style={styles.chartCardTitle}>&#128197; Periodo de Maior Incidencia</h3>
              <p style={styles.chartCardSubtitle}>Percursos concluidos nos ultimos 2 anos (completos vs parciais)</p>
            </div>
            <div style={styles.chartCardBody}>
              <Line 
                data={completionsByMonthChart} 
                options={{
                  ...chartOptions,
                  plugins: { 
                    legend: { display: true, position: 'top', labels: { boxWidth: 12, padding: 15 } }
                  }
                }} 
              />
            </div>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartCardHeader}>
              <h3 style={styles.chartCardTitle}>&#127942; Top 5 Peregrinos</h3>
              <p style={styles.chartCardSubtitle}>Ranking por pontuacao</p>
            </div>
            <div style={styles.chartCardBody}>
              <Bar data={topPilgrimsChart} options={{ ...chartOptions, indexAxis: 'y' }} />
            </div>
          </div>
        </div>

        {/* Novo grafico de tempo medio por trecho */}
        <div style={{ ...styles.chartCard, marginBottom: '32px' }}>
          <div style={styles.chartCardHeader}>
            <h3 style={styles.chartCardTitle}>&#9201; Tempo Medio de Conclusao por Trecho</h3>
            <p style={styles.chartCardSubtitle}>Tempo medio em horas para completar cada um dos 13 trechos</p>
          </div>
          <div style={styles.chartCardBody}>
            <Bar 
              data={avgTimeByRouteChart} 
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  x: { ...chartOptions.scales.x, ticks: { maxRotation: 45, minRotation: 45 } }
                }
              }} 
            />
          </div>
        </div>

        <div style={{ ...styles.chartCard, marginBottom: '32px' }}>
          <div style={styles.chartCardHeader}>
            <h3 style={styles.chartCardTitle}>&#128506; Trechos do Caminho</h3>
            <p style={styles.chartCardSubtitle}>Quantidade de conclusoes por trecho</p>
          </div>
          <div style={styles.chartCardBody}>
            <Bar 
              data={partsCompletionChart} 
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  x: { ...chartOptions.scales.x, ticks: { maxRotation: 45, minRotation: 45 } }
                }
              }} 
            />
          </div>
        </div>

        <div style={styles.sectionTitle}>
          <span style={{ ...styles.sectionIcon, background: '#efebe9', color: '#5d4037' }}>&#127942;</span>
          Ranking Detalhado
        </div>
        <p style={{ color: '#8d6e63', marginBottom: '20px', fontSize: '13px' }}>
          <span style={{ background: '#efebe9', padding: '6px 12px', borderRadius: '20px' }}>
            <strong>Pontuacao:</strong> 10 pts/km + 1000 pts (vel. 4-6 km/h) + 500 pts/percurso + 1000 pts (caminho completo)
          </span>
        </p>

        <div style={styles.chartCard}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Peregrino</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Idade</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Sexo</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Percursos</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Trechos</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Distancia</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Tempo</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Vel. Media</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Pontuacao</th>
                </tr>
              </thead>
              <tbody>
                {top10Pilgrims.map((pilgrim, index) => (
                  <tr 
                    key={index} 
                    style={{ background: index === 0 ? '#efebe9' : index === 1 ? '#f5f0e8' : index === 2 ? '#fbe9e7' : '#fffcf8' }}
                  >
                    <td style={styles.td}>
                      <span style={{ fontSize: '24px' }}>
                        {pilgrim.rank === 1 ? String.fromCodePoint(129351) : pilgrim.rank === 2 ? String.fromCodePoint(129352) : pilgrim.rank === 3 ? String.fromCodePoint(129353) : pilgrim.rank}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={styles.avatar}>{pilgrim.nickname.charAt(0).toUpperCase()}</div>
                        <span style={{ fontWeight: '600', color: '#4e342e' }}>{pilgrim.nickname}</span>
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center', color: '#5d4037' }}>{pilgrim.age} anos</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={{ ...styles.badge, background: pilgrim.sex === 'M' ? '#d7ccc8' : pilgrim.sex === 'F' ? '#efebe9' : '#f5f0e8', color: pilgrim.sex === 'M' ? '#5d4037' : pilgrim.sex === 'F' ? '#6d4c41' : '#795548' }}>
                        {pilgrim.sex}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={{ ...styles.badge, background: '#efebe9', color: '#5d4037' }}>{pilgrim.trails}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={{ ...styles.badge, background: '#d7ccc8', color: '#4e342e' }}>{pilgrim.routes}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500' }}>
                      {pilgrim.distance.toLocaleString('pt-BR')} km
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      {formatTime(pilgrim.totalHours)}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      {pilgrim.averageSpeed > 0 ? pilgrim.averageSpeed.toFixed(1) + ' km/h' : '-'}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <span style={styles.pointsBadge}>{pilgrim.points.toLocaleString('pt-BR')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer style={styles.footer}>
          <p>Caminho de Cora &#169; 2026 - Dashboard Publico de Estatisticas</p>
        </footer>
      </main>
    </div>
  );
}

export default PublicDashboard;