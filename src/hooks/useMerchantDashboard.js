/**
 * Hook para buscar analytics do Comerciante (Merchant)
 * Retorna dados formatados pronto para usar no DashboardMerchant
 */

import { useState, useEffect } from 'react';
import { fetchMerchantAnalytics } from '../services/analyticsAPI';

export function useMerchantDashboard(merchantId = null, startDate = null, endDate = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = () => setReloadToken(prev => prev + 1);

  useEffect(() => {
    async function loadData() {
      if (!merchantId) {
        setError('Merchant ID é obrigatório');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await fetchMerchantAnalytics(merchantId, startDate, endDate);
        setData(result);
      } catch (err) {
        console.error('Erro ao carregar dados do comerciante:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [merchantId, startDate, endDate, reloadToken]);

  // Dados formatados para KPIs
  const kpiData = data ? {
    totalVisitors: data.visitors?.total || 0,
    recentVisitors: data.visitors?.recent || 0,
    peakHour: data.peakHours?.[0]?.hour || 0,
    servicesCount: data.services?.length || 0
  } : null;

  return {
    data,
    kpiData,
    establishment: data?.establishment || {},
    establishments: data?.establishments || [],
    trailParts: data?.trailParts || [],
    checkpoints: data?.checkpoints || [],
    segmentsWithEstablishments: data?.segmentsWithEstablishments || [],
    segmentStats: data?.segmentStats || [],
    visitors: data?.visitors || {},
    activity: data?.activity || [],
    peakHours: data?.peakHours || [],
    services: data?.services || [],
    loading,
    error,
    refresh
  };
}
