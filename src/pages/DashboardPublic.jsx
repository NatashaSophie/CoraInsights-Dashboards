import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
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
    background: 'linear-gradient(135deg, #f4f6fb 0%, #fbfcff 50%, #eef1f9 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    background: 'linear-gradient(135deg, #5d4037 0%, #6d4c41 50%, #795548 100%)',
    color: 'white',
    padding: '24px 0',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
    position: 'sticky',
    top: '64px',
    zIndex: 900
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
    color: '#1f2937',
    background: '#ffffff',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e5e7eb',
    borderLeft: '6px solid #6366f1',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statCardIcon: { fontSize: '34px', lineHeight: 1 },
  statCardContent: { display: 'flex', flexDirection: 'column', gap: '6px' },
  statCardLabel: { fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280' },
  statCardValue: { fontSize: '32px', fontWeight: '700', color: '#111827' },
  statCardSubtitle: { fontSize: '13px', color: '#6b7280' },
  sectionTitle: {
    fontSize: '20px',
    color: '#333',
    margin: '0 0 20px 0',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  sectionIcon: {
    background: '#e0e7ff',
    color: '#4338ca',
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
    background: '#ffffff',
    borderRadius: '18px',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
    overflow: 'hidden',
    border: '1px solid #e5e7eb'
  },
  chartCardHeader: {
    padding: '18px 24px',

  },
  chartCardTitle: { fontSize: '18px', fontWeight: '600', color: '#2d3748', margin: 0 },
  chartCardSubtitle: { fontSize: '13px', color: '#7a8699', marginTop: '6px' },
  chartCardBody: { padding: '20px 24px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  tableHeader: { background: '#f5f7fa', color: '#666' },
  th: { padding: '16px 12px', textAlign: 'left', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' },
  td: { padding: '16px 12px', borderBottom: '1px solid #e5e7eb' },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f5f7fa, #f5f7fa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  legend: {
    marginBottom: '16px',
    color: '#475569',
    fontSize: '12px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  pointsBadge: {
    background: '#f3f4f6',
    color: '#9ca3af',
    padding: '6px 14px',
    borderRadius: '20px',
    fontWeight: '600'
  },
  footer: { textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '14px' },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f4f6fb 0%, #fbfcff 100%)'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

const gradients = {
  blueDark: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
  blue: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
  blueMedium: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
  teal: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)'
};

function DashboardPublic({ hidePublicNav = false, hidePublicHeader = false }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

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
        <button
          onClick={fetchData}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            background: '#e65100',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!data) {
    return <div style={styles.loading}>Sem dados disponíveis</div>;
  }

  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months[parseInt(month, 10) - 1] + '/' + year.slice(2);
  };

  const formatTime = (hours) => {
    if (!hours || hours <= 0) return '-';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? h + 'h' + (m > 0 ? m + 'min' : '') : m + 'min';
  };

  const lineColors = [
    '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#6A3D9A',
    '#8C564B', '#E377C2', '#7F7F7F', '#B8860B', '#17BECF',
    '#FF1493', '#003F5C', '#A3E635'
  ];

  const completionsByMonthData = data.completionsByMonth || { months: [], series: [] };
  const completionsByMonthChart = {
    labels: (completionsByMonthData.months || []).map(m => formatMonth(m)),
    datasets: (completionsByMonthData.series || []).map((series, index) => {
      const routeIndex = Number(series.routeCount ?? series.route ?? index + 1);
      const color = routeIndex === 13 ? '#EDC948' : (lineColors[routeIndex - 1] || lineColors[index % lineColors.length]);
      return {
        label: series.label,
        data: series.data,
        borderColor: color,
        backgroundColor: 'transparent',
        tension: 0.3,
        fill: false,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 3,
        borderWidth: series.routeCount === 13 ? 3 : 2
      };
    })
  };

  const pedestreAvgParts = data.partsCompletionDataPedestre
    || data.avgTimeByRoutePedestre
    || [];
  const bicicletaAvgParts = data.partsCompletionDataBicicleta
    || data.avgTimeByRouteBicicleta
    || [];

  const avgTimeByRoutePedestreChart = {
    labels: pedestreAvgParts.map(p => String(p.id)),
    datasets: [{
      label: 'Tempo Medio (horas)',
      data: pedestreAvgParts.map(p => p.avgTimeHours || 0),
      backgroundColor: '#2d9cdb',
      borderRadius: 6
    }]
  };

  const avgTimeByRouteBicicletaChart = {
    labels: bicicletaAvgParts.map(p => String(p.id)),
    datasets: [{
      label: 'Tempo Medio (horas)',
      data: bicicletaAvgParts.map(p => p.avgTimeHours || 0),
      backgroundColor: '#00b894',
      borderRadius: 6
    }]
  };

  const partsCompletionData = data.partsCompletionData || [];
  const avgTimePartsData = Array.isArray(data.avgTimePerTrecho) ? data.avgTimePerTrecho : [];
  const rawPartsData = partsCompletionData.length ? partsCompletionData : avgTimePartsData;

  const getNumericValue = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
      return Number(value);
    }
    return null;
  };

  const getFirstNumeric = (source, keys) => {
    for (const key of keys) {
      const candidate = getNumericValue(source?.[key]);
      if (candidate !== null) return candidate;
    }
    return 0;
  };

  const partsLegend = rawPartsData.map(p => ({
    id: p.id,
    name: p.name || 'Trecho ' + p.id
  }));
  const partsNameMap = rawPartsData.reduce((acc, part) => {
    acc[String(part.id)] = part.name || 'Trecho ' + part.id;
    return acc;
  }, {});
  const getPartName = (id) => partsNameMap[String(id)] || `Trecho ${id}`;

  const pedestreCountMap = rawPartsData.reduce((acc, part) => {
    const count = part.pedestreCount ?? part.pedestre ?? part.walkers ?? 0;
    acc[String(part.id)] = count;
    return acc;
  }, {});
  const bicicletaCountMap = rawPartsData.reduce((acc, part) => {
    const count = part.bicicletaCount ?? part.bicicleta ?? part.cyclists ?? 0;
    acc[String(part.id)] = count;
    return acc;
  }, {});

  const pedestreTimeMap = rawPartsData.reduce((acc, part) => {
    const time = getFirstNumeric(part, [
      'avgTimePedestreHours',
      'avgTimePedestre',
      'avgTimePedestrian',
      'avgTimeCaminhanteHours',
      'avgTimeCaminhante',
      'avgTimeWalkingHours',
      'avgTimeWalking',
      'avgTimeWalkers',
      'avgTimeHours',
      'avgTime'
    ]);
    acc[String(part.id)] = time;
    return acc;
  }, {});
  const bicicletaTimeMap = rawPartsData.reduce((acc, part) => {
    const time = getFirstNumeric(part, [
      'avgTimeBicicletaHours',
      'avgTimeBicicleta',
      'avgTimeCyclist',
      'avgTimeCiclistaHours',
      'avgTimeCiclista',
      'avgTimeCyclingHours',
      'avgTimeCycling'
    ]);
    acc[String(part.id)] = time;
    return acc;
  }, {});

  const pedestreParts = Array.isArray(data.avgTimeByRoutePedestre) ? data.avgTimeByRoutePedestre : [];
  const bicicletaParts = Array.isArray(data.avgTimeByRouteBicicleta) ? data.avgTimeByRouteBicicleta : [];
  pedestreParts.forEach(part => {
    pedestreTimeMap[String(part.id)] = part.avgTimeHours || part.avgTime || 0;
  });
  bicicletaParts.forEach(part => {
    bicicletaTimeMap[String(part.id)] = part.avgTimeHours || part.avgTime || 0;
  });

  const partsForChartFromMaps = Array.from(new Set([
    ...Object.keys(pedestreTimeMap),
    ...Object.keys(bicicletaTimeMap)
  ])).filter((value) => value && value !== 'undefined' && value !== 'null');

  const partsForChart = partsLegend.length
    ? partsLegend.map(item => String(item.id))
    : partsForChartFromMaps.length
      ? partsForChartFromMaps
      : Array.from(new Set([...pedestreParts, ...bicicletaParts]
        .map(part => String(part.id))
        .filter((value) => value && value !== 'undefined' && value !== 'null')));

  const statusColors = [
    '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#6A3D9A',
    '#8C564B', '#E377C2', '#7F7F7F', '#B8860B', '#17BECF',
    '#FF1493', '#003F5C', '#A3E635'
  ];
  const statusCaminhoSorted = (data.statusCaminho || [])
    .slice()
    .sort((a, b) => {
      const aId = Number(String(a.status).match(/\d+/)?.[0] ?? 0);
      const bId = Number(String(b.status).match(/\d+/)?.[0] ?? 0);
      return aId - bId;
    });

  const statusCaminhoChart = {
    labels: statusCaminhoSorted.map(s => s.status),
    datasets: [{
      data: statusCaminhoSorted.map(s => s.count),
      backgroundColor: statusCaminhoSorted.map((s, i) => {
        if (s.status.includes('Completo')) return '#EDC948';
        if (s.status.includes('Andamento')) return '#A05195';
        const statusIndex = Number(String(s.status).match(/\d+/)?.[0] ?? 0);
        return statusColors[statusIndex - 1] || statusColors[i % statusColors.length];
      }),
      borderWidth: 3,
      borderColor: '#ffffff'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.2)' }, ticks: { color: '#64748b' } },
      x: { grid: { display: false }, ticks: { color: '#64748b' } }
    }
  };

  const avgTimeFallbackChart = data.avgTimePerTrecho
    && Array.isArray(data.avgTimePerTrecho.labels)
    && Array.isArray(data.avgTimePerTrecho.datasets);

  const isFallbackAvgTime = avgTimeFallbackChart && partsForChart.length === 0;

  const avgTimePedestreChart = isFallbackAvgTime
    ? data.avgTimePerTrecho
    : {
        labels: partsForChart,
        datasets: [
          {
            label: 'Caminhantes',
            data: partsForChart.map(id => pedestreTimeMap[id] || 0),
            backgroundColor: '#93c5fd',
            borderRadius: 6
          }
        ]
      };

  const avgTimeBicicletaChart = isFallbackAvgTime
    ? data.avgTimePerTrecho
    : {
        labels: partsForChart,
        datasets: [
          {
            label: 'Ciclistas',
            data: partsForChart.map(id => bicicletaTimeMap[id] || 0),
            backgroundColor: '#6366f1',
            borderRadius: 6
          }
        ]
      };

  const top10Pilgrims = (data.topPilgrims || []).slice(0, 10);

  return (
    <div style={styles.page}>
      <style>{String.raw`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {!hidePublicNav && (
        <nav
          style={{
            background: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            padding: '16px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            marginBottom: 0
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              cursor: 'pointer',
              letterSpacing: '0.5px'
            }}
            onClick={() => navigate('/')}
          >
            Caminho de Cora - Dashboards
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '8px 12px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => (e.target.style.color = '#1d4ed8')}
              onMouseLeave={(e) => (e.target.style.color = '#64748b')}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '8px 12px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => (e.target.style.color = '#1d4ed8')}
              onMouseLeave={(e) => (e.target.style.color = '#64748b')}
            >
              Login
            </button>
          </div>
        </nav>
      )}

      {!hidePublicHeader && (
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={{ ...styles.headerIcon, filter: 'brightness(0) invert(1)' }}>&#128694;</div>
            <div>
              <h1 style={styles.headerTitle}>Caminho de Cora</h1>
              <p style={styles.headerSubtitle}>Dashboard de Estatísticas Públicas</p>
            </div>
          </div>
        </header>
      )}

      <main style={styles.main}>
        <div style={styles.cardsGrid}>
          <div style={{ ...styles.statCard, borderLeftColor: '#667eea' }}>
            <div style={{ ...styles.statCardIcon, color: '#667eea' }}>&#128694;</div>
            <div style={styles.statCardContent}>
              <div style={styles.statCardLabel}>Total de Peregrinos Ativos</div>
              <div style={styles.statCardValue}>{data.totalPilgrims}</div>
              <div style={styles.statCardSubtitle}>
                {data.malePilgrims} masc. / {data.femalePilgrims} fem.
              </div>
            </div>
          </div>
          <div style={{ ...styles.statCard, borderLeftColor: '#667eea' }}>
            <div style={{ ...styles.statCardIcon, color: '#667eea' }}>🛣️</div>
            <div style={styles.statCardContent}>
              <div style={styles.statCardLabel}>Percursos Concluídos</div>
              <div style={styles.statCardValue}>{data.completedTrails}</div>
              <div style={styles.statCardSubtitle}>caminho completo ou parcial</div>
            </div>
          </div>
          <div style={{ ...styles.statCard, borderLeftColor: '#667eea' }}>
            <div style={{ ...styles.statCardIcon, color: '#667eea' }}>&#128099;</div>
            <div style={styles.statCardContent}>
              <div style={styles.statCardLabel}>Percursos Ativos</div>
              <div style={styles.statCardValue}>{data.activeTrails}</div>
              <div style={styles.statCardSubtitle}>em andamento</div>
            </div>
          </div>
          <div style={{ ...styles.statCard, borderLeftColor: '#667eea' }}>
            <div style={{ ...styles.statCardIcon, color: '#667eea' }}>&#127942;</div>
            <div style={styles.statCardContent}>
              <div style={styles.statCardLabel}>Caminho Completo</div>
              <div style={styles.statCardValue}>{data.caminhoCompleto || 0}</div>
              <div style={styles.statCardSubtitle}>13 trechos concluídos em sequência</div>
            </div>
          </div>
        </div>

        <div style={styles.sectionTitle}>
          Ranking Detalhado
        </div>

        <div style={{ ...styles.chartCard, marginBottom: '32px' }}>
          <div style={styles.chartCardBody}>
            <p style={{ color: '#64748b', marginBottom: '12px', fontSize: '13px' }}>
                <strong>Legenda:</strong> Modalidade: C = Caminhada | B = Bicicleta -- Sexo: M = Masculino | F = Feminino -- Percursos: Quantidade de Percusos Concluídos (caminho completo ou parcial) -- Trechos: Quantidade de Trechos Concluídos nos percursos
            </p>
            <p style={{ color: '#64748b', marginBottom: '12px', fontSize: '13px' }}>
                <strong>Cálculo da Pontuação:</strong> 10 pts/km + 500 pts/percurso + 1000 pts (cada caminho completado)
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Peregrino</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Idade</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Sexo</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Modalidade</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Percursos</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Trechos</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Distância</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Tempo</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Vel. média</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Pontuação</th>
                  </tr>
                </thead>
                <tbody>
                  {top10Pilgrims.map((pilgrim, index) => (
                    <tr
                      key={index}
                      style={{
                        background:
                          index === 0 ? '#fff7cc' : index === 1 ? '#f2f4f8' : index === 2 ? '#f8efe3' : '#ffffff'
                      }}
                    >
                      <td style={styles.td}>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          {pilgrim.rank === 1
                            ? String.fromCodePoint(129351)
                            : pilgrim.rank === 2
                              ? String.fromCodePoint(129352)
                              : pilgrim.rank === 3
                                ? String.fromCodePoint(129353)
                                : pilgrim.rank}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={styles.avatar}>{pilgrim.nickname.charAt(0).toUpperCase()}</div>
                          <span style={{ fontWeight: '600', color: '#666' }}>{pilgrim.nickname}</span>
                        </div>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center', color: '#475569' }}>{pilgrim.age} anos</td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span
                          style={{
                            ...styles.badge,
                            background: pilgrim.sex === 'M' ? '#e0e7ff' : pilgrim.sex === 'F' ? '#dbeafe' : '#eef2ff',
                            color: '#666'
                          }}
                        >
                          {pilgrim.sex}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        {(() => {
                          const seq = Array.isArray(pilgrim.modalitySequence) && pilgrim.modalitySequence.length > 0
                            ? pilgrim.modalitySequence.join(' | ')
                            : pilgrim.modality || '-';
                          const base = seq.includes('B') && !seq.includes('C') ? 'B' : seq.includes('C') && !seq.includes('B') ? 'C' : '-';
                          return (
                            <span
                              style={{
                                ...styles.badge,
                                background: base === 'C' ? '#e0e7ff' : base === 'B' ? '#dbeafe' : '#eef2ff',
                                color: '#666'
                              }}
                            >
                              {seq}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={{ ...styles.badge, background: '#e0e7ff', color: '#666' }}>{pilgrim.trails}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={{ ...styles.badge, background: '#dbeafe', color: '#666' }}>{pilgrim.routes}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500' }}>
                        <span style={{ color: '#666' }}>{pilgrim.distance.toLocaleString('pt-BR')} km</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <span style={{ color: '#666' }}>{formatTime(pilgrim.totalHours)}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        {pilgrim.averageSpeed > 0 ? <span style={{ color: '#666' }}>{pilgrim.averageSpeed.toFixed(1) + ' km/h'}</span> : '-'}
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
        </div>

        <div style={styles.sectionTitle}>
          Análises e Estatísticas
        </div>

        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <div style={styles.chartCardHeader}>
              <h3 style={styles.chartCardTitle}>Status do Caminho</h3>
              <p style={styles.chartCardSubtitle}>Distribuição por trechos completados</p>
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
              <h3 style={styles.chartCardTitle}>Período de Maior Incidência</h3>
              <p style={styles.chartCardSubtitle}>Percursos concluídos (completos e parciais)</p>
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
        </div>

        <div style={{ ...styles.chartCard, marginBottom: '32px' }}>
          <div style={styles.chartCardHeader}>
            <h3 style={styles.chartCardTitle}>Tempo Médio por Trecho</h3>
            <p style={styles.chartCardSubtitle}>Tempo médio em horas para completar cada um dos 13 trechos</p>
          </div>
          <div style={{ ...styles.chartCardBody, display: 'flex', gap: '24px', alignItems: 'stretch' }}>
            <div style={{ flex: 2, minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px', alignSelf: 'stretch' }}>
              <div style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '13px', color: '#7a8699' }}>Caminhantes</div>
                <Bar
                  data={avgTimeByRoutePedestreChart}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                    plugins: {
                      ...chartOptions.plugins,
                      tooltip: {
                        callbacks: {
                          title: (items) => {
                            const id = items?.[0]?.label;
                            return getPartName(id);
                          }
                        }
                      }
                    },
                    scales: {
                      ...chartOptions.scales,
                      x: { ...chartOptions.scales.x, ticks: { maxRotation: 45, minRotation: 45 } }
                    }
                  }}
                />
              </div>
                <div style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '13px', color: '#7a8699' }}>Ciclistas</div>
                <Bar
                  data={avgTimeByRouteBicicletaChart}
                  options={{
                      ...chartOptions,
                      maintainAspectRatio: false,
                    plugins: {
                      ...chartOptions.plugins,
                      tooltip: {
                        callbacks: {
                          title: (items) => {
                            const id = items?.[0]?.label;
                            return getPartName(id);
                          }
                        }
                      }
                    },
                    scales: {
                      ...chartOptions.scales,
                      x: { ...chartOptions.scales.x, ticks: { maxRotation: 45, minRotation: 45 } }
                    }
                  }}
                />
              </div>
            </div>
              <div style={{ flex: '0 0 260px', fontSize: '12px', color: '#475569', alignSelf: 'stretch', background: '#f3f4f6', borderRadius: '12px', padding: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>Legenda (ID - Trecho)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                {partsLegend.map(item => (
                  <div key={item.id} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <strong>{item.id}</strong> - {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>Caminho de Cora &#169; 2026 - Dashboards</p>
      </footer>
    </div>
  );
}

export default DashboardPublic;
