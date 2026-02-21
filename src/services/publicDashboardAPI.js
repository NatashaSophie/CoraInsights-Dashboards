/**
 * Serviço para buscar dados públicos do Strapi
 * Consome os endpoints diretos do Strapi
 */

const API_URL = 'http://localhost:1337';

export async function fetchPublicAnalytics() {
  try {
    console.log('[PublicDashboard] Iniciando busca de dados...');

    // Buscar dados dos endpoints existentes em paralelo
    const [usersRes, trailsRes, trailRoutesRes] = await Promise.all([
      fetch(`${API_URL}/users?_limit=1000`),
      fetch(`${API_URL}/trails?_limit=1000`),
      fetch(`${API_URL}/trail-routes?_limit=2000`)
    ]);

    if (!usersRes.ok || !trailsRes.ok || !trailRoutesRes.ok) {
      console.error('[PublicDashboard] Erro ao buscar dados');
      return getDefaultData();
    }

    const users = await usersRes.json();
    const trails = await trailsRes.json();
    const trailRoutes = await trailRoutesRes.json();
    
    // Trail-parts pode não estar disponível (403), então usar array vazio
    let trailParts = [];
    try {
      const trailPartsRes = await fetch(`${API_URL}/trail-parts?_limit=100`);
      if (trailPartsRes.ok) {
        trailParts = await trailPartsRes.json();
      }
    } catch (e) {
      console.warn('[PublicDashboard] Trail-parts não disponível, usando array vazio');
    }

    console.log('[PublicDashboard] Dados carregados com sucesso:', {
      users: users.length,
      trails: trails.length,
      trailRoutes: trailRoutes.length,
      trailParts: trailParts.length
    });

    // ============================================
    // 1. TOTAL DE PEREGRINOS
    // ============================================
    const totalPilgrims = users.length;
    const malePilgrims = users.filter(u => u.sex === 'male').length;
    const femalePilgrims = users.filter(u => u.sex === 'female').length;

    // ============================================
    // 2. PERCURSOS CONCLUÍDOS
    // ============================================
    const completedTrailsSet = new Set();
    trails.forEach(trail => {
      if (trail.finishedAt) {
        completedTrailsSet.add(trail.user?.id);
      }
    });
    const completedTrailsCount = completedTrailsSet.size;

    // ============================================
    // 3. CRESCIMENTO MENSAL (últimos 12 meses)
    // ============================================
    const monthlyGrowth = calculateMonthlyGrowth(users);

    // ============================================
    // 4. STATUS DO CAMINHO (distribuição de percursos por trechos completados)
    // ============================================
    const caminhoStatus = calculateCaminhoStatus(trails, trailRoutes);

    // ============================================
    // 5. PERÍODO DE MAIOR INCIDÊNCIA (início e conclusão por quantidade de trechos)
    // ============================================
    const incidenceByMonth = calculateIncidenceByMonth(trails, trailRoutes);

    // ============================================
    // 6. TEMPO MÉDIO POR TRECHO
    // ============================================
    const avgTimePerTrecho = calculateAvgTimePerTrecho(trailRoutes, trailParts);

    // ============================================
    // 7. CONCLUSÕES POR TRECHO (quantos peregrinos completaram cada trecho)
    // ============================================
    const conclusionsByTrecho = calculateConclusionsByTrecho(trailRoutes, trailParts);

    // ============================================
    // 8. RANKING DETALHADO (Top 10)
    // ============================================
    const rankingDetalhado = calculateRankingDetalhado(users, trails, trailRoutes, trailParts);

    return {
      // KPIs
      totalPilgrims,
      malePilgrims,
      femalePilgrims,
      completedTrailsCount,

      // Gráficos
      monthlyGrowth,
      caminhoStatus,
      incidenceByMonth,
      avgTimePerTrecho,
      conclusionsByTrecho,
      
      // Tabela
      rankingDetalhado
    };
  } catch (error) {
    console.error('[PublicDashboard] Erro ao buscar analytics:', error);
    return getDefaultData();
  }
}

/**
 * Retorna dados padrão quando não conseguir buscar do Strapi
 */
function getDefaultData() {
  const months = generateLast12Months();
  return {
    totalPilgrims: 0,
    malePilgrims: 0,
    femalePilgrims: 0,
    completedTrailsCount: 0,
    monthlyGrowth: { 
      labels: months,
      datasets: [{
        label: 'Novos Peregrinos',
        data: Array(months.length).fill(0),
        borderColor: '#8b6f47',
        backgroundColor: 'rgba(139, 111, 71, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    caminhoStatus: { 
      labels: [],
      datasets: [{
        label: 'Percursos',
        data: [],
        backgroundColor: []
      }]
    },
    incidenceByMonth: { 
      labels: months,
      datasets: []
    },
    avgTimePerTrecho: { 
      labels: [],
      datasets: [{
        label: 'Tempo Médio (horas)',
        data: [],
        backgroundColor: '#8b6f47'
      }]
    },
    conclusionsByTrecho: { 
      labels: [],
      datasets: [{
        label: 'Conclusões',
        data: [],
        backgroundColor: '#a16c38'
      }]
    },
    rankingDetalhado: []
  };
}

/**
 * Calcula crescimento mensal de cadastros (últimos 12 meses)
 */
function calculateMonthlyGrowth(users) {
  const monthlyData = {};
  const now = new Date();
  
  // Gerar últimos 12 meses
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push(monthKey);
    monthlyData[monthKey] = 0;
  }

  // Contar usuários por mês
  users.forEach(user => {
    if (user.created_at) {
      const date = new Date(user.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey]++;
      }
    }
  });

  return {
    labels: months,
    datasets: [{
      label: 'Novos Peregrinos',
      data: months.map(m => monthlyData[m]),
      borderColor: '#8b6f47',
      backgroundColor: 'rgba(139, 111, 71, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#8b6f47',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5
    }]
  };
}

/**
 * Calcula status do caminho (distribuição de percursos por quantidade de trechos completados)
 */
function calculateCaminhoStatus(trails, trailRoutes) {
  const statusMap = {};
  
  trails.forEach(trail => {
    const routes = trailRoutes.filter(tr => tr.trail?.id === trail.id);
    const completedCount = routes.filter(r => r.finishedAt).length;
    
    const status = String(completedCount);
    
    if (!statusMap[status]) {
      statusMap[status] = 0;
    }
    statusMap[status]++;
  });

  // Ordenar labels - mostrar somente os que têm dados
  const labels = [];
  const data = [];
  const colorPalette = [
    '#e0e0e0', '#e8d4c4', '#d4a574', '#c99968', '#bf8d5c', '#b58250',
    '#ab7744', '#a16c38', '#97612c', '#8d5620', '#834b14',
    '#7a3f08', '#703408', '#6629fb'
  ];

  // Primeiro mostrar "Em Andamento" (0 trechos)
  if (statusMap['0']) {
    labels.push('Em Andamento (0)');
    data.push(statusMap['0']);
  }

  // Depois mostrar trechos completados (1-13) apenas se houver dados
  for (let i = 1; i <= 13; i++) {
    if (statusMap[String(i)]) {
      const label = i === 13 ? 'Caminho Completo (13)' : `${i} trecho(s)`;
      labels.push(label);
      data.push(statusMap[String(i)]);
    }
  }

  return {
    labels,
    datasets: [{
      label: 'Distribuição de percursos por trechos completados',
      data,
      backgroundColor: colorPalette
    }]
  };
}

/**
 * Calcula período de maior incidência (linhas por quantidade de trechos, mostrando início e conclusão)
 */
function calculateIncidenceByMonth(trails, trailRoutes) {
  const months = generateLast12Months();
  
  // Mapear trails por quantidade de trechos completados
  const trailsByTrechoCount = {};
  
  trails.forEach(trail => {
    const routes = trailRoutes.filter(tr => tr.trail?.id === trail.id);
    const completedCount = routes.filter(r => r.finishedAt).length;
    
    // Somente incluir trails com pelo menos 1 trecho completado
    if (completedCount > 0) {
      if (!trailsByTrechoCount[completedCount]) {
        trailsByTrechoCount[completedCount] = [];
      }
      trailsByTrechoCount[completedCount].push(trail);
    }
  });

  const datasets = [];
  const colorPalette = [
    '#e8d4c4', '#d4a574', '#c99968', '#bf8d5c', '#b58250',
    '#ab7744', '#a16c38', '#97612c', '#8d5620', '#834b14',
    '#7a3f08', '#703408', '#6629fb'
  ];

  // Criar uma linha para cada quantidade de trechos que tem dados
  for (let trechoCount = 1; trechoCount <= 13; trechoCount++) {
    const trailsForCount = trailsByTrechoCount[trechoCount];
    
    if (trailsForCount && trailsForCount.length > 0) {
      const monthData = {};
      months.forEach(m => monthData[m] = 0);

      // Para cada trail nessa categoria, contar inícios
      trailsForCount.forEach(trail => {
        // Contar início (createdAt ou startedAt)
        if (trail.startedAt) {
          const date = new Date(trail.startedAt);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (monthData[monthKey] !== undefined) {
            monthData[monthKey]++;
          }
        }
      });

      datasets.push({
        label: trechoCount === 13 ? 'Caminho Completo (13 trechos)' : `${trechoCount} trecho(s)`,
        data: months.map(m => monthData[m]),
        borderColor: colorPalette[trechoCount - 1],
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6
      });
    }
  }

  return {
    labels: months,
    datasets
  };
}

/**
 * Calcula tempo médio por trecho usando nomes reais dos trechos
 */
function calculateAvgTimePerTrecho(trailRoutes, trailParts) {
  const trechoData = {};
  
  // Criar map de nomes dos trechos
  const partsMap = {};
  trailParts.forEach(part => {
    partsMap[part.id] = part.name || `Trecho ${part.id}`;
  });

  trailRoutes.forEach(route => {
    const routeId = route.route?.id;
    const routeName = route.route?.name || partsMap[routeId] || `Trecho ${routeId}`;
    
    if (!trechoData[routeId]) {
      trechoData[routeId] = {
        name: routeName,
        totalTime: 0,
        count: 0
      };
    }
    
    if (route.finishedAt && route.route?.time) {
      // Converter segundos para horas se necessário
      const hours = route.route.time > 1000 ? route.route.time / 3600 : route.route.time;
      trechoData[routeId].totalTime += hours;
      trechoData[routeId].count++;
    }
  });

  const labels = [];
  const data = [];
  
  // Ordenar por ID de trecho
  const sortedTrechos = Object.keys(trechoData).sort();
  
  sortedTrechos.forEach(routeId => {
    const stats = trechoData[routeId];
    const avgTime = stats.count > 0 ? stats.totalTime / stats.count : 0;
    labels.push(stats.name);
    data.push(Math.round(avgTime * 100) / 100); // Arredondar para 2 casas decimais
  });

  return {
    labels,
    datasets: [{
      label: 'Tempo Médio (horas)',
      data,
      backgroundColor: '#8b6f47',
      borderColor: '#6d4c41',
      borderWidth: 1
    }]
  };
}

/**
 * Calcula conclusões por trecho usando nomes reais dos trechos
 */
function calculateConclusionsByTrecho(trailRoutes, trailParts) {
  const trechoData = {};
  
  // Criar map de nomes dos trechos
  const partsMap = {};
  trailParts.forEach(part => {
    partsMap[part.id] = part.name || `Trecho ${part.id}`;
  });

  trailRoutes.forEach(route => {
    const routeId = route.route?.id;
    const routeName = route.route?.name || partsMap[routeId] || `Trecho ${routeId}`;
    
    if (!trechoData[routeId]) {
      trechoData[routeId] = {
        name: routeName,
        completions: 0
      };
    }
    
    if (route.finishedAt) {
      trechoData[routeId].completions++;
    }
  });

  const labels = [];
  const data = [];
  
  // Ordenar por ID de trecho
  const sortedTrechos = Object.keys(trechoData).sort();
  
  sortedTrechos.forEach(routeId => {
    const stats = trechoData[routeId];
    labels.push(stats.name);
    data.push(stats.completions);
  });

  return {
    labels,
    datasets: [{
      label: 'Conclusões por Trecho',
      data,
      backgroundColor: '#a16c38',
      borderColor: '#6d4c41',
      borderWidth: 1
    }]
  };
}

/**
 * Calcula ranking detalhado dos top 10 peregrinos
 */
function calculateRankingDetalhado(users, trails, trailRoutes, trailParts) {
  const ranking = [];
  const trailPartsMap = new Map(
    (trailParts || []).map(part => [part.id, part])
  );

  users.forEach(user => {
    const userTrails = trails.filter(t => t.user?.id === user.id);
    
    if (userTrails.length === 0) return;

    let totalDistance = 0;
    let totalSections = 0;
    let totalTime = 0;
    let completedTrails = 0;
    let hasFullPath = false;

    userTrails.forEach(trail => {
      const routes = trailRoutes.filter(r => r.trail?.id === trail.id);
      const completedRoutes = routes.filter(r => r.finishedAt);

      totalSections += completedRoutes.length;
      
      if (trail.finishedAt) {
        completedTrails++;
        if (completedRoutes.length === 13) {
          hasFullPath = true;
        }
      }

      // Somar distância e tempo real dos trechos
      completedRoutes.forEach(route => {
        let distance = 0;
        if (route.route?.distance) {
          distance = parseFloat(route.route.distance);
        } else {
          const routeId = route.route?.id || route.route;
          const part = trailPartsMap.get(routeId);
          if (part?.distance) {
            distance = parseFloat(part.distance);
          }
        }

        const routeStart = route.created_at || route.createdAt;
        if (route.finishedAt && routeStart && distance > 0) {
          const startTime = new Date(routeStart).getTime();
          const endTime = new Date(route.finishedAt).getTime();
          if (!Number.isNaN(startTime) && !Number.isNaN(endTime) && endTime > startTime) {
            totalDistance += distance;
            totalTime += (endTime - startTime) / 1000;
          }
        }
      });
    });

    // Converter tempo para horas
    const totalTimeHours = totalTime > 0 ? totalTime / 3600 : 0;
    const avgSpeed = totalTimeHours > 0 ? parseFloat((totalDistance / totalTimeHours).toFixed(2)) : 0;
    
    // Calcular pontuação
    const points = calculatePoints(totalDistance, avgSpeed, completedTrails, hasFullPath, userTrails[0]?.modality);

    ranking.push({
      rank: 0,
      nickname: user.nickname || user.username,
      age: 0, // Calcular da data de nascimento se disponível
      sex: user.sex === 'male' ? 'M' : user.sex === 'female' ? 'F' : 'N/A',
      completedTrails,
      totalSections,
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      totalTime: parseFloat(totalTimeHours.toFixed(2)),
      avgSpeed,
      points: Math.round(points)
    });
  });

  ranking.sort((a, b) => b.points - a.points);

  return ranking.slice(0, 10).map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

/**
 * Calcula pontuação do peregrino
 * Pontuacao: 10 pts/km + 500 pts/percurso + 1000 pts (caminho completo)
 */
function calculatePoints(distance, avgSpeed, completedTrails, hasFullPath, modality) {
  let points = 0;
  
  // 10 pontos por km
  points += distance * 10;
  
  // 500 pontos por percurso concluído
  points += completedTrails * 500;

  if (hasFullPath) {
    points += 1000;
  }
  
  // 1000 pontos por velocidade ideal
  void avgSpeed;
  void modality;
  
  return points;
}

/**
 * Gera array dos últimos 12 meses
 */
function generateLast12Months() {
  const months = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push(monthKey);
  }
  
  return months;
}
