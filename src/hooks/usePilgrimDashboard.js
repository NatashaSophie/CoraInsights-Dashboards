/**
 * Hook para buscar analytics do Peregrino
 * Retorna dados formatados pronto para usar no DashboardPilgrim
 */

import { useState, useEffect } from 'react';
import { fetchPilgrimAnalytics } from '../services/analyticsAPI';

export function usePilgrimDashboard(startDate = null, endDate = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchPilgrimAnalytics(startDate, endDate);
        setData(result);
      } catch (err) {
        console.error('Erro ao carregar dados do peregrino:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [startDate, endDate]);

  // Dados formatados para KPIs
  const kpiData = data ? {
    routesCompleted: data.routes?.completed || 0,
    totalRoutes: data.routes?.total || 13,
    completionPercentage: data.routes?.percentage || 0,
    avgTimeHours: data.timeStats?.avgHours || 0,
    achievements: data.achievements?.length || 0,
    recentActivity: data.recentActivity || []
  } : null;

  return {
    data,
    kpiData,
    routeProgress: data?.routeProgress || [],
    recentActivity: data?.recentActivity || [],
    timeStats: data?.timeStats || {},
    trails: data?.trails || {},
    loading,
    error
  };
}
