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
  }, [merchantId, startDate, endDate]);

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
    visitors: data?.visitors || {},
    activity: data?.activity || [],
    peakHours: data?.peakHours || [],
    services: data?.services || [],
    loading,
    error
  };
}
