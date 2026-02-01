/**
 * Analytics API Service
 * Consome os endpoints /analytics/* do backend
 */

const API_URL = 'http://localhost:1337/api';

/**
 * Formata data para YYYY-MM-DD
 */
function formatDateForAPI(date) {
  return new Date(date).toISOString().split('T')[0];
}

/**
 * Busca analytics do peregrino
 */
export async function fetchPilgrimAnalytics(startDate = null, endDate = null) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    // Se não houver datas, usar últimos 30 dias
    const end = endDate ? formatDateForAPI(endDate) : formatDateForAPI(new Date());
    const start = startDate ? formatDateForAPI(startDate) : formatDateForAPI(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const response = await fetch(`${API_URL}/analytics/pilgrim?start=${start}&end=${end}`, {
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
    console.error('Erro ao buscar analytics do peregrino:', error);
    throw error;
  }
}

/**
 * Busca analytics do gestor
 */
export async function fetchManagerAnalytics(startDate = null, endDate = null) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    // Se não houver datas, usar últimos 30 dias
    const end = endDate ? formatDateForAPI(endDate) : formatDateForAPI(new Date());
    const start = startDate ? formatDateForAPI(startDate) : formatDateForAPI(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const response = await fetch(`${API_URL}/analytics/manager?start=${start}&end=${end}`, {
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
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    if (!merchantId) {
      throw new Error('merchantId é obrigatório');
    }

    // Se não houver datas, usar últimos 30 dias
    const end = endDate ? formatDateForAPI(endDate) : formatDateForAPI(new Date());
    const start = startDate ? formatDateForAPI(startDate) : formatDateForAPI(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const response = await fetch(`${API_URL}/analytics/merchant?start=${start}&end=${end}&merchantId=${merchantId}`, {
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
