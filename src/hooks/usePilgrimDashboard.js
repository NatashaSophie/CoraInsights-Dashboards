/**
 * Hook para buscar analytics do Peregrino
 * Retorna dados formatados pronto para usar no DashboardPilgrim
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPilgrimAnalytics } from '../services/analyticsAPI';

export function usePilgrimDashboard(startDate = null, endDate = null) {
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
        
        console.log('[DEBUG] Iniciando loadData...', { user, startDate, endDate });
        
        // Debug: Verificar token
        const token = localStorage.getItem('jwt');
        console.log('[DEBUG] Token disponível:', !!token);
        
        const result = await fetchPilgrimAnalytics(startDate, endDate);
        console.log('[DEBUG] Resposta do backend:', result);
        
        // Analisar o que conseguiu carregar
        const loadedFields = [];
        const failedFields = [];
        
        if (result?.trails) loadedFields.push('trails');
        else failedFields.push('trails');
        
        if (result?.routes) loadedFields.push('routes');
        else failedFields.push('routes');
        
        if (result?.routeProgress?.length) loadedFields.push('routeProgress');
        else failedFields.push('routeProgress');
        
        if (result?.recentActivity?.length) loadedFields.push('recentActivity');
        else failedFields.push('recentActivity');
        
        if (result?.timeStats) loadedFields.push('timeStats');
        else failedFields.push('timeStats');
        
        if (result?.achievements?.length) loadedFields.push('achievements');
        else failedFields.push('achievements');
        
        console.log('[DEBUG] Campos carregados:', loadedFields);
        console.log('[DEBUG] Campos falhados:', failedFields);
        
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
        console.error('[DEBUG] Erro ao carregar dados:', err);
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
  }, [startDate, endDate, user]);

  // Dados formatados para KPIs
  const kpiData = data ? {
    routesCompleted: data.routes?.completed || 0,
    totalRoutes: data.routes?.total || 13,
    completionPercentage: data.routes?.percentage || 0,
    avgTimeHours: data.timeStats?.avgHours || 0,
    achievements: data.achievements?.length || 0,
    recentActivity: data.recentActivity || []
  } : {
    routesCompleted: 0,
    totalRoutes: 13,
    completionPercentage: 0,
    avgTimeHours: 0,
    achievements: 0,
    recentActivity: []
  };

  return {
    data,
    kpiData,
    routeProgress: data?.routeProgress || [],
    recentActivity: data?.recentActivity || [],
    timeStats: data?.timeStats || {},
    trails: data?.trails || {},
    loading,
    error,
    debugInfo
  };
}
  };
}
