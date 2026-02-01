/**
 * Hook para buscar analytics do Gestor (Manager)
 * Retorna dados formatados pronto para usar no DashboardManager
 */

import { useState, useEffect } from 'react';
import { fetchManagerAnalytics } from '../services/analyticsAPI';

export function useManagerDashboard(startDate = null, endDate = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchManagerAnalytics(startDate, endDate);
        setData(result);
      } catch (err) {
        console.error('Erro ao carregar dados do gestor:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [startDate, endDate]);

  // Dados formatados para KPIs
  const kpiData = data ? {
    totalUsers: data.users?.reduce((sum, u) => sum + u.count, 0) || 0,
    totalTrails: data.trails?.total || 0,
    publishedTrails: data.trails?.published || 0,
    completionRate: data.completionRate?.percentage || 0,
    activeUsers: data.activeUsers?.count || 0
  } : null;

  return {
    data,
    kpiData,
    users: data?.users || [],
    trails: data?.trails || {},
    topTrails: data?.topTrails || [],
    activity: data?.activity || [],
    completionRate: data?.completionRate || {},
    activeUsers: data?.activeUsers || {},
    loading,
    error
  };
}
