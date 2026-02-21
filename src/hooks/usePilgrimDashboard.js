/**
 * Hook para buscar analytics do Peregrino
 * Retorna dados formatados pronto para usar no DashboardPilgrim
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPilgrimAnalytics } from '../services/analyticsAPI';

export function usePilgrimDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[PILGRIM-DASHBOARD] ===== INICIANDO CARREGAMENTO =====');
        console.log('[PILGRIM-DASHBOARD] Usuário:', user);
        
        // Debug: Verificar token
        const token = localStorage.getItem('jwt');
        console.log('[PILGRIM-DASHBOARD] Token disponível:', !!token);
        if (token) {
          console.log('[PILGRIM-DASHBOARD] Token preview:', token.substring(0, 50) + '...');
        }
        
        console.log('[PILGRIM-DASHBOARD] Chamando fetchPilgrimAnalytics...');
        const result = await fetchPilgrimAnalytics();
        console.log('[PILGRIM-DASHBOARD] ===== RESPOSTA DO BACKEND =====');
        console.log('[PILGRIM-DASHBOARD] Resultado completo:', result);
        console.log('[PILGRIM-DASHBOARD] Tipo:', typeof result);
        console.log('[PILGRIM-DASHBOARD] É objeto?', result && typeof result === 'object');
        
        // Analisar o que conseguiu carregar
        const loadedFields = [];
        const failedFields = [];
        
        console.log('[PILGRIM-DASHBOARD] ===== VALIDANDO CAMPOS =====');
        
        if (result?.trails) {
          loadedFields.push('trails');
          console.log('[PILGRIM-DASHBOARD] ✅ trails presente:', result.trails);
        } else {
          failedFields.push('trails');
          console.log('[PILGRIM-DASHBOARD] ❌ trails ausente');
        }
        
        if (result?.routes) {
          loadedFields.push('routes');
          console.log('[PILGRIM-DASHBOARD] ✅ routes presente:', result.routes);
        } else {
          failedFields.push('routes');
          console.log('[PILGRIM-DASHBOARD] ❌ routes ausente');
        }
        
        if (result?.routeProgress?.length) {
          loadedFields.push('routeProgress');
          console.log('[PILGRIM-DASHBOARD] ✅ routeProgress presente:', result.routeProgress.length, 'items');
        } else {
          failedFields.push('routeProgress');
          console.log('[PILGRIM-DASHBOARD] ❌ routeProgress ausente ou vazio');
        }
        
        if (result?.recentActivity?.length) {
          loadedFields.push('recentActivity');
          console.log('[PILGRIM-DASHBOARD] ✅ recentActivity presente:', result.recentActivity.length, 'items');
        } else {
          failedFields.push('recentActivity');
          console.log('[PILGRIM-DASHBOARD] ❌ recentActivity ausente ou vazio');
        }
        
        if (result?.timeStats) {
          loadedFields.push('timeStats');
          console.log('[PILGRIM-DASHBOARD] ✅ timeStats presente:', result.timeStats);
        } else {
          failedFields.push('timeStats');
          console.log('[PILGRIM-DASHBOARD] ❌ timeStats ausente');
        }
        
        if (result?.achievements?.length) {
          loadedFields.push('achievements');
          console.log('[PILGRIM-DASHBOARD] ✅ achievements presente:', result.achievements.length, 'items');
        } else {
          failedFields.push('achievements');
          console.log('[PILGRIM-DASHBOARD] ❌ achievements ausente ou vazio');
        }
        
        console.log('[PILGRIM-DASHBOARD] ===== RESUMO =====');
        console.log('[PILGRIM-DASHBOARD] Campos carregados:', loadedFields);
        console.log('[PILGRIM-DASHBOARD] Campos falhados:', failedFields);
        
        setDebugInfo({
          loadedFields,
          failedFields,
          timestamp: new Date().toLocaleString('pt-BR'),
          userInfo: {
            userId: user?.id,
            username: user?.username,
            userType: user?.userType
          }
        });
        
        setData(result);
      } catch (err) {
        console.error('[PILGRIM-DASHBOARD] ===== ERRO AO CARREGAR =====');
        console.error('[PILGRIM-DASHBOARD] Erro:', err);
        console.error('[PILGRIM-DASHBOARD] Mensagem:', err.message);
        console.error('[PILGRIM-DASHBOARD] Stack:', err.stack);
        
        setError(err.message);
        setDebugInfo({
          loadedFields: [],
          failedFields: ['todas as categorias'],
          error: err.message,
          timestamp: new Date().toLocaleString('pt-BR'),
          userInfo: {
            userId: user?.id,
            username: user?.username,
            userType: user?.userType
          }
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Dados formatados para KPIs
  const totalRoutes = data?.routes?.total || 13;
  const routesCompleted = data?.routes?.completed || 0;
  const completionPercentage = totalRoutes > 0
    ? Math.min(100, Math.round((routesCompleted / totalRoutes) * 100))
    : 0;

  const kpiData = data ? {
    routesCompleted,
    totalRoutes,
    completionPercentage,
    avgTimeHours: data.timeStats?.avgHours || 0,
    avgSpeedKmh: data.speedStats?.avgKmh || 0,
    achievements: data.achievements?.length || 0,
    recentActivity: data.recentActivity || [],
    fullPathCompletions: data.fullPathCompletions || 0,
    completedTrailsByModality: data.completedTrailsByModality || { foot: 0, bike: 0 },
    completedTrailsByDirection: data.completedTrailsByDirection || { correct: 0, inverse: 0 },
    inProgressRoute: data.inProgressRoute || { hasActive: false }
  } : {
    routesCompleted: 0,
    totalRoutes: 13,
    completionPercentage: 0,
    avgTimeHours: 0,
    avgSpeedKmh: 0,
    achievements: 0,
    recentActivity: [],
    fullPathCompletions: 0,
    completedTrailsByModality: { foot: 0, bike: 0 },
    completedTrailsByDirection: { correct: 0, inverse: 0 },
    inProgressRoute: { hasActive: false }
  };

  return {
    data,
    kpiData,
    routeProgress: data?.routeProgress || [],
    routeHistory: data?.routeHistory || [],
    trailParts: data?.trailParts || [],
    allCheckpoints: data?.allCheckpoints || [],
    timePerRoute: data?.timePerRoute || [],
    timePerRouteByModality: data?.timePerRouteByModality || [],
    recentActivity: data?.recentActivity || [],
    timeStats: data?.timeStats || {},
    trails: data?.trails || {},
    loading,
    error,
    debugInfo
  };
}
