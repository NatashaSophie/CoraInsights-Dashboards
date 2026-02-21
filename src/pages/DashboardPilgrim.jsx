import React, { useMemo, useState } from 'react';
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

export function DashboardPilgrim() {
  const [sortKey, setSortKey] = useState('recent');
  const [sortDir, setSortDir] = useState('desc');
  const {
    kpiData,
    loading,
    error,
    debugInfo,
    routeProgress,
    routeHistory,
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
      label: 'Caminho completo a pé',
      unlocked: (kpiData?.completedTrailsByModality?.foot || 0) > 0
    },
    {
      id: 'full-path-bike',
      label: 'Caminho completo pedalando',
      unlocked: (kpiData?.completedTrailsByModality?.bike || 0) > 0
    },
    {
      id: 'direction-correct',
      label: 'Direção correta',
      unlocked: (kpiData?.completedTrailsByDirection?.correct || 0) > 0
    },
    {
      id: 'direction-inverse',
      label: 'Direção inversa',
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

  const formatDate = (value) => (value ? value.toLocaleDateString('pt-BR') : '-');
  const formatHours = (value) => {
    if (!value || value <= 0) return '-';
    const totalMinutes = Math.round(value * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };
  const modalityLabel = (value) => {
    const raw = String(value || '').toLowerCase();
    if (raw === 'pedestre' || raw === 'foot' || raw === 'pe') return 'Pedestre';
    if (raw === 'bicicleta' || raw === 'bike' || raw === 'pedal') return 'Bicicleta';
    return raw ? raw : '-';
  };

  const directionLabel = (value) => (value ? 'Inversa' : 'Correta');

  const sortColumns = {
    trecho: { label: 'Trecho', accessor: (route) => route.name || `Trecho ${route.routeId}` },
    inicio: { label: 'Data de Início', accessor: (route) => route.startAt ? new Date(route.startAt).getTime() : 0 },
    conclusao: { label: 'Data de Conclusão', accessor: (route) => route.finishedAt ? new Date(route.finishedAt).getTime() : 0 },
    modalidade: { label: 'Modalidade', accessor: (route) => modalityLabel(route.modality) },
    direcao: { label: 'Direção', accessor: (route) => directionLabel(route.direction) },
    tempo: { label: 'Tempo Gasto', accessor: (route) => route.hoursSpent || 0 },
    velocidade: { label: 'Velocidade Média', accessor: (route) => route.avgSpeed || 0 },
    status: { label: 'Status', accessor: (route) => route.status || '' }
  };

  const sortedRouteHistory = useMemo(() => {
    const list = [...(routeHistory || [])];
    if (!list.length) return list;

    if (sortKey === 'recent') {
      return list.sort((a, b) => {
        const aCompleted = a.status === 'concluido';
        const bCompleted = b.status === 'concluido';
        if (aCompleted !== bCompleted) {
          return aCompleted ? 1 : -1;
        }
        const aTime = aCompleted
          ? (a.finishedAt ? new Date(a.finishedAt).getTime() : 0)
          : (a.startAt ? new Date(a.startAt).getTime() : 0);
        const bTime = bCompleted
          ? (b.finishedAt ? new Date(b.finishedAt).getTime() : 0)
          : (b.startAt ? new Date(b.startAt).getTime() : 0);
        return bTime - aTime;
      });
    }

    const column = sortColumns[sortKey];
    if (!column) return list;
    const direction = sortDir === 'asc' ? 1 : -1;
    return list.sort((a, b) => {
      const aVal = column.accessor(a);
      const bVal = column.accessor(b);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }
      return String(aVal).localeCompare(String(bVal), 'pt-BR', { sensitivity: 'base' }) * direction;
    });
  }, [routeHistory, sortKey, sortDir]);

  const visibleRoutes = sortedRouteHistory;
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('asc');
  };

  const insightCards = [
    {
      id: 'regras',
      title: 'Dicas e regras essenciais',
      rules: [
        {
          icon: '/insights/acompanhado.png',
          text: 'Caminhe sempre acompanhado.'
        },
        {
          icon: '/insights/hor%C3%A1rios.png',
          text: 'Fique atento aos horarios.'
        },
        {
          icon: '/insights/porteira.png',
          text: 'Mantenha as porteiras fechadas.'
        },
        {
          icon: '/insights/moto.png',
          text: 'Uso de motocicletas e proibido no caminho.'
        }
      ]
    },
  ];

  const sinalTelefoneInfo = {
    resumo: 'A cobertura varia bastante entre trechos rurais, vilarejos e áreas de natureza preservada.',
    destaques: [
      'A Claro tem apresentado melhor desempenho em boa parte do trajeto, mas não garante sinal contínuo.',
      'Proximidade de cidades e povoados (Corumbá de Goiás, Pirenópolis, Jaraguá e Cidade de Goiás) tende a ter sinal mais estável.',
      'Estradas de terra e serras podem ficar sem sinal por vários quilômetros.'
    ],
    dicas: [
      'Avise familiares sobre possíveis trechos sem comunicação.',
      'Leve bateria extra ou powerbank.',
      'Use mapas e rotas off-line para navegação sem internet.',
      'Aproveite a desconexão como parte da experiência.'
    ],
    fonte: 'https://caminhodecoracoralina.com.br/sinal-de-telefone/'
  };

  const telefonesUteis = {
    aviso: 'Confirme horários e dias de saída com as empresas antes de viajar.',
    grupos: [
      {
        empresa: 'Empresa Moreira',
        contato: '+55 (62) 3018-9511 / (62) 3371-1510',
        site: 'https://empresamoreira.com.br/',
        rotas: [
          'Goiânia -> Cidade de Goiás',
          'Cidade de Goiás -> Goiânia',
          'Brasília -> Cidade de Goiás'
        ]
      },
      {
        empresa: 'Auto Viação Goianésia',
        contato: 'Taguatinga: (62) 9 9217-7969 | Interestadual: (62) 9 9237-3056',
        site: 'http://www.viacaogoianesia.com.br/',
        rotas: [
          'Brasília -> Corumbá de Goiás',
          'Corumbá de Goiás -> Brasília'
        ]
      },
      {
        empresa: 'Expresso São José do Tocantins',
        contato: '(62) 3311-1900 / 3324-1729',
        rotas: [
          'Goiânia -> Corumbá de Goiás',
          'Corumbá de Goiás -> Goiânia',
          'Transporte coletivo - Anápolis -> Corumbá de Goiás -> Anápolis'
        ]
      }
    ],
    fonte: 'https://caminhodecoracoralina.com.br/telefones-uteis/'
  };

  const prepCaminhantes = {
    duration: '13 a 15 dias',
    highlights: [
      'Planeje distância, clima e inclinação do terreno.',
      'Evite caminhar no período noturno.',
      'Saia cedo e caminhe apenas durante o dia.'
    ],
    planejamento: [
      'Calcule o tempo médio por trecho e seu preparo físico.',
      'Planeje para chegar em segurança ao próximo ponto de apoio.',
      'A segurança depende do planejamento do ritmo e do clima.'
    ],
    checklist: [
      'GPS, celular e carregador externo.',
      'Mochila ataque com presilhas no peito e quadris.',
      'Roupas leves e de secagem rápida.',
      'Camiseta UV, chapéu e protetor solar fator 70.',
      'Tênis ou bota de trilha já adaptados.',
      'Lanterna de cabeça, canivete e saco de lixo.',
      'Kit de primeiros socorros e documentos.',
      '3 litros de água (2 congelados).'
    ],
    cuidados: [
      'Repelente, álcool em gel 70% e lenço umedecido.',
      'Higiene pessoal, toalha de trilha e máscara.',
      'Vaselina e esparadrapo para preparar os pés.',
      'Agulha e linha para cuidar de bolhas.',
      'Cajado para apoio quando necessário.'
    ],
    atencao: [
      'Evite caminhar à noite.',
      'Não entre em atalhos.',
      'Saia do local de hospedagem o mais cedo possível.'
    ]
  };

  const prepCiclistas = {
    duration: '4 a 8 dias',
    highlights: [
      'Evite mochila nas costas; use bagageiro.',
      'Evite pedalar no período noturno.',
      'Saia cedo e pedale apenas durante o dia.'
    ],
    planejamento: [
      'Avalie distância, tempo, inclinação e clima.',
      'Ajuste bagagem e ritmo para chegar em segurança.',
      'Planejamento do tempo médio e essencial.'
    ],
    checklist: [
      'GPS, celular e carregador externo.',
      'Luvas, óculos e camiseta UV.',
      'Kit remendo com lixa, espátulas e remendos.',
      'Bomba de mão e duas câmaras de ar reserva.',
      'Canivete multiuso e óleo lubrificante.',
      'Sapatilha ou tênis MTB já adaptados.',
      'Lanterna de cabeça e saco de lixo.'
    ],
    cuidados: [
      'Protetor solar fator 70 e repelente.',
      'Kit de primeiros socorros e documentos.',
      'Higiene pessoal, toalha de trilha e máscara.',
      '3 litros de água (2 congelados).',
      'Lenço umedecido e álcool em gel 70%.'
    ],
    atencao: [
      'Evite pedalar à noite.',
      'Não entre em atalhos.',
      'Saia do local de hospedagem o mais cedo possível.'
    ]
  };

  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout>
        {/* DEBUG: Mostrar informações de carregamento */}
        {/*debugInfo && (
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
        ) */}

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
          <h2>Trechos Realizados e em Andamento</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('trecho')}>
                    Trecho{sortKey === 'trecho' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="sortable" onClick={() => handleSort('inicio')}>
                    Data de Início{sortKey === 'inicio' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="sortable" onClick={() => handleSort('conclusao')}>
                    Data de Conclusão{sortKey === 'conclusao' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="sortable" onClick={() => handleSort('modalidade')}>
                    Modalidade{sortKey === 'modalidade' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="sortable" onClick={() => handleSort('direcao')}>
                    Direção{sortKey === 'direcao' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="sortable" onClick={() => handleSort('tempo')}>
                    Tempo Gasto{sortKey === 'tempo' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="sortable" onClick={() => handleSort('velocidade')}>
                    Velocidade Média{sortKey === 'velocidade' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="sortable" onClick={() => handleSort('status')}>
                    Status{sortKey === 'status' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th>Certificado</th>
                </tr>
              </thead>
              <tbody>
                {visibleRoutes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="table-empty">Nenhum trecho encontrado.</td>
                  </tr>
                ) : visibleRoutes.map((route) => {
                  const startDate = route.startAt ? new Date(route.startAt) : null;
                  const endDate = route.finishedAt ? new Date(route.finishedAt) : null;
                  const isCompleted = route.status === 'concluido';
                  return (
                    <tr key={route.id}>
                      <td>{route.name || `Trecho ${route.routeId}`}</td>
                      <td>{formatDate(startDate)}</td>
                      <td>{formatDate(endDate)}</td>
                      <td>{modalityLabel(route.modality)}</td>
                      <td>{directionLabel(route.direction)}</td>
                      <td>{isCompleted ? formatHours(route.hoursSpent) : '-'}</td>
                      <td>{route.avgSpeed ? `${route.avgSpeed.toFixed(1)} km/h` : '-'}</td>
                      <td>
                        <span className={`badge ${isCompleted ? 'completed' : 'in-progress'}`}>
                          {isCompleted ? 'Concluído' : 'Em andamento'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" disabled={!isCompleted} aria-label="Baixar certificado">
                          <span className="download-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                              <path d="M12 3a1 1 0 0 1 1 1v9.17l2.59-2.58a1 1 0 1 1 1.41 1.41l-4.3 4.3a1 1 0 0 1-1.4 0l-4.3-4.3a1 1 0 1 1 1.41-1.41L11 13.17V4a1 1 0 0 1 1-1zm-7 14a1 1 0 0 1 1 1v2h12v-2a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z" />
                            </svg>
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Insights */}
        <section className="insights-section">
          <h2>Insights</h2>
          <div className="insights-grid">
            {insightCards.map(card => (
              <article
                className={`insight-card ${card.id === 'sinalizacao' || card.id === 'regras' ? 'full-width' : ''} ${card.id === 'regras' ? 'rules' : ''}`}
                key={card.id}
              >
                <h4>{card.title}</h4>
                {card.images && (
                  <div className="insight-images">
                    {card.images.map((image) => (
                      <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
                    ))}
                  </div>
                )}
                {card.rules && (
                  <div className="insight-rules">
                    {card.rules.map((rule) => (
                      <div className="insight-rule" key={rule.text}>
                        <img src={rule.icon} alt="" loading="lazy" />
                        <span>{rule.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {card.text && <p>{card.text}</p>}
                {card.bullets && (
                  <ul className="insight-list">
                    {card.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {card.href && (
                  <a className="insight-link" href={card.href}>
                    {card.linkLabel}
                  </a>
                )}
              </article>
            ))}
            <article className="insight-card full-width">
              <h4>Sinalização do caminho</h4>
              <p className="insight-lead"><strong>Legenda:</strong> Direção Correta: Sentido Corumbá de Goiás -> Cidade de Goiás / Direção Inversa: Sentido Cidade de Goiás -> Corumbá de Goiás</p>
              <div className="insight-images">
                <img
                  src="/insights/sinalizacao-scaled.png"
                  alt="Sinalização oficial do Caminho de Cora Coralina"
                  loading="lazy"
                />
              </div>
            </article>
            <article className="insight-card full-width">
              <h4>Preparação para caminhantes</h4>
              <p className="insight-lead">Orientações para quem vai percorrer o caminho a pé.</p>
              <div className="insight-prep-grid">
                <div className="insight-prep-block">
                  <h5>Duração estimada</h5>
                  <p>{prepCaminhantes.duration}</p>
                  <h5>Destaques</h5>
                  <ul className="insight-prep-list">
                    {prepCaminhantes.highlights.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-prep-block">
                  <h5>Planejamento essencial</h5>
                  <ul className="insight-prep-list">
                    {prepCaminhantes.planejamento.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-prep-block">
                  <h5>Checklist básico</h5>
                  <ul className="insight-prep-list">
                    {prepCaminhantes.checklist.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-prep-block">
                  <h5>Cuidados pessoais</h5>
                  <ul className="insight-prep-list">
                    {prepCaminhantes.cuidados.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <h5>Atenção</h5>
                  <ul className="insight-prep-list">
                    {prepCaminhantes.atencao.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <article className="insight-card full-width">
              <h4>Preparação para ciclistas</h4>
              <p className="insight-lead">Informações para quem vai percorrer o caminho pedalando.</p>
              <div className="insight-prep-grid">
                <div className="insight-prep-block">
                  <h5>Duração estimada</h5>
                  <p>{prepCiclistas.duration}</p>
                  <h5>Destaques</h5>
                  <ul className="insight-prep-list">
                    {prepCiclistas.highlights.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-prep-block">
                  <h5>Planejamento essencial</h5>
                  <ul className="insight-prep-list">
                    {prepCiclistas.planejamento.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-prep-block">
                  <h5>Checklist da bike</h5>
                  <ul className="insight-prep-list">
                    {prepCiclistas.checklist.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-prep-block">
                  <h5>Cuidados pessoais</h5>
                  <ul className="insight-prep-list">
                    {prepCiclistas.cuidados.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <h5>Atenção</h5>
                  <ul className="insight-prep-list">
                    {prepCiclistas.atencao.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <div className="insight-row">
              <article className="insight-card span-two signal-card">
                <h4>Sinal de telefone e internet</h4>
                <div className="insight-images signal-image">
                  <img
                    src="/insights/SinalCelularInternet.png"
                    alt="Sinal de telefone e internet"
                    loading="lazy"
                  />
                </div>
                <p className="insight-lead">{sinalTelefoneInfo.resumo}</p>
                <h5 className="insight-subtitle">Cobertura e operadoras</h5>
                <ul className="insight-list">
                  {sinalTelefoneInfo.destaques.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h5 className="insight-subtitle">Dicas praticas</h5>
                <ul className="insight-list">
                  {sinalTelefoneInfo.dicas.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="insight-card span-one">
                <h4>Mapa completo e altimetria</h4>
                <div className="insight-images map-images">
                  <img src="/insights/MapaCaminho.png" alt="Mapa completo do Caminho" loading="lazy" />
                  <img src="/insights/MapaCaminho-Altimetria.png" alt="Altimetria do Caminho" loading="lazy" />
                </div>
                <p className="insight-lead">Veja o mapa completo com fotos de pontos importantes e perfil altimétrico do percurso.</p>
                <a className="insight-link" href="/insights/Mapa-CCC.pdf" target="_blank" rel="noreferrer">
                  Abrir PDF do mapa
                </a>
              </article>
            </div>
            <article className="insight-card full-width">
              <h4>Telefones úteis</h4>
              <p className="insight-lead">{telefonesUteis.aviso}</p>
              <div className="insight-phones">
                {telefonesUteis.grupos.map((grupo) => (
                  <div className="insight-phone" key={grupo.empresa}>
                    <h5>{grupo.empresa}</h5>
                    <ul className="insight-phone-routes">
                      {grupo.rotas.map((rota) => (
                        <li key={rota}>{rota}</li>
                      ))}
                    </ul>
                    <p><strong>Contato:</strong> {grupo.contato}</p>
                    {grupo.site && (
                      <a className="insight-link" href={grupo.site} target="_blank" rel="noreferrer">
                        Site da empresa
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <a className="insight-link" href={telefonesUteis.fonte} target="_blank" rel="noreferrer">
                Ver pagina completa de telefones
              </a>
            </article>
          </div>
        </section>
      </div>
      <footer className="dashboard-footer">
        <p>Caminho de Cora &#169; 2026 - Dashboards</p>
      </footer>
      </DashboardLayout>
    </>
  );
}
