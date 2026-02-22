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
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = () => setReloadToken(prev => prev + 1);

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
  }, [startDate, endDate, reloadToken]);

  // Dados formatados para KPIs
  const kpiData = data ? {
    totalUsers: data.totalPilgrims || 0,
    totalTrails: data.trails?.total || 0,
    publishedTrails: data.trails?.published || 0,
    completionRate: data.completionStats?.percentage || 0,
    activeUsers: data.activeRoutes?.count || 0
  } : null;

  return {
    data,
    kpiData,
    users: data?.users || [],
    trails: data?.trails || {},
    topTrails: data?.topTrails || [],
    activity: data?.activity || [],
    directionStats: data?.directionStats || {},
    modalityStats: data?.modalityStats || {},
    completionRate: data?.completionStats || {},
    activeUsers: data?.activeRoutes || {},
    trailParts: data?.trailParts || [],
    checkpoints: data?.checkpoints || [],
    establishments: data?.establishments || [],
    merchants: data?.merchants || [],
    segmentsWithEstablishments: data?.segmentsWithEstablishments || [],
    segmentCompletions: data?.segmentCompletions || [],
    monthlyRegistrations: data?.monthlyRegistrations || {},
    pilgrimStats: data?.pilgrimStats || {},
    loading,
    error,
    refresh
  };
}
