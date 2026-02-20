/**
 * Analytics API Service
 * Consome os endpoints /analytics/* do backend
 */

const API_URL = 'http://localhost:1337/';

/**
 * Formata data para YYYY-MM-DD
 */
function formatDateForAPI(date) {
  return new Date(date).toISOString().split('T')[0];
}

/**
 * Busca analytics do peregrino (sem filtro de período)
 */
export async function fetchPilgrimAnalytics() {
  try {
    console.log('[ANALYTICS-API] ===== FETCHPILGRIMANALYTICS =====');
    
    const token = localStorage.getItem('jwt');
    console.log('[ANALYTICS-API] Token encontrado:', token ? `${token.substring(0, 20)}...` : 'NÃO ENCONTRADO');
    
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    console.log('[ANALYTICS-API] Enviando requisição para:', `${API_URL}api/analytics/pilgrim`);

    const response = await fetch(`${API_URL}api/analytics/pilgrim`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('[ANALYTICS-API] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ANALYTICS-API] ❌ Erro na resposta:', response.status, errorText);
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }

    const data = await response.json();
    console.log('[ANALYTICS-API] ✅ Dados recebidos:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar analytics do peregrino:', error);
    throw error;
  }
}

/**
 * Busca analytics do gestor
 */
export async function fetchManagerAnalytics(startDate = null, endDate = null) {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    console.log('[ANALYTICS-MANAGER] Token from localStorage:', token.substring(0, 50) + '...');

    // Se não houver datas, usar últimos 30 dias
    const end = endDate ? formatDateForAPI(endDate) : formatDateForAPI(new Date());
    const start = startDate ? formatDateForAPI(startDate) : formatDateForAPI(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const response = await fetch(`${API_URL}api/analytics/manager?start=${start}&end=${end}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar analytics do gestor:', error);
    throw error;
  }
}

/**
 * Busca analytics do comerciante
 */
export async function fetchMerchantAnalytics(merchantId, startDate = null, endDate = null) {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    if (!merchantId) {
      throw new Error('merchantId é obrigatório');
    }

    // Se não houver datas, usar últimos 30 dias
    const end = endDate ? formatDateForAPI(endDate) : formatDateForAPI(new Date());
    const start = startDate ? formatDateForAPI(startDate) : formatDateForAPI(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const response = await fetch(`${API_URL}api/analytics/merchant?start=${start}&end=${end}&merchantId=${merchantId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar analytics do comerciante:', error);
    throw error;
  }
}
