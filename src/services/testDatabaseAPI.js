/**
 * Serviço para testar e exibir dados de todas as entidades do banco de dados
 */

const API_URL = 'http://localhost:1337';

// ============================================
// NORMALIZADORES DE DADOS
// ============================================

/**
 * Converte modality do português para inglês
 * Problema: API retorna "bicicleta" mas modelo define enum["foot", "bike"]
 */
function normalizeModality(value) {
  if (!value) return value;
  const map = {
    'bicicleta': 'bike',
    'bike': 'bike',
    'foot': 'foot',
    'pé': 'foot',
    'pedal': 'bike'
  };
  return map[value.toLowerCase()] || value;
}

/**
 * Converte timezone de UTC para Brasil (UTC-3)
 * Problema: API retorna em UTC (Z) mas dados foram salvos em hora local
 * Solução: Subtrair 3 horas do UTC para mostrar hora correta do Brasil
 */
function convertUTCToBrasil(dateString) {
  if (!dateString) return dateString;
  try {
    const date = new Date(dateString);
    // Subtrair 3 horas (180 minutos = 10800 segundos)
    const brasiliDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));
    return brasiliDate.toISOString();
  } catch (e) {
    console.warn('Erro ao converter data:', dateString, e);
    return dateString;
  }
}

/**
 * Normaliza dados de trails/rotas
 */
function normalizeTrailData(data) {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(item => normalizeTrailData(item));
  }
  return {
    ...data,
    modality: normalizeModality(data.modality),
    startedAt: convertUTCToBrasil(data.startedAt),
    finishedAt: convertUTCToBrasil(data.finishedAt)
  };
}

export async function fetchTestData() {
  const result = {
    users: null,
    trails: null,
    trailRoutes: null,
    trailParts: null,
    checkpoints: null,
    establishments: null,
    certificates: null,
    roles: null,
    permissions: null,
    errors: []
  };

  // Buscar USERS
  try {
    const res = await fetch(`${API_URL}/users?_limit=1`);
    if (res.ok) {
      const data = await res.json();
      result.users = Array.isArray(data) ? data[0] : data;
    } else {
      result.errors.push(`Users: Status ${res.status}`);
    }
  } catch (e) {
    result.errors.push(`Users: ${e.message}`);
  }

  // Buscar TRAILS
  try {
    const res = await fetch(`${API_URL}/trails?_limit=1`);
    if (res.ok) {
      const data = await res.json();
      const trail = Array.isArray(data) ? data[0] : data;
      result.trails = normalizeTrailData(trail);
    } else {
      result.errors.push(`Trails: Status ${res.status}`);
    }
  } catch (e) {
    result.errors.push(`Trails: ${e.message}`);
  }

  // Buscar TRAIL-ROUTES
  try {
    const res = await fetch(`${API_URL}/trail-routes?_limit=1`);
    if (res.ok) {
      const data = await res.json();
      const route = Array.isArray(data) ? data[0] : data;
      result.trailRoutes = normalizeTrailData(route);
    } else {
      result.errors.push(`Trail-Routes: Status ${res.status}`);
    }
  } catch (e) {
    result.errors.push(`Trail-Routes: ${e.message}`);
  }

  // Buscar TRAIL-PARTS
  try {
    const res = await fetch(`${API_URL}/trail-parts?_limit=1`);
    if (res.ok) {
      const data = await res.json();
      result.trailParts = Array.isArray(data) ? data[0] : data;
    } else {
      result.errors.push(`Trail-Parts: Status ${res.status}`);
    }
  } catch (e) {
    result.errors.push(`Trail-Parts: ${e.message}`);
  }

  // Buscar CHECKPOINTS
  try {
    const res = await fetch(`${API_URL}/checkpoints?_limit=1`);
    if (res.ok) {
      const data = await res.json();
      result.checkpoints = Array.isArray(data) ? data[0] : data;
    } else {
      result.errors.push(`Checkpoints: Status ${res.status}`);
    }
  } catch (e) {
    result.errors.push(`Checkpoints: ${e.message}`);
  }

  // Buscar ESTABLISHMENTS
  try {
    const res = await fetch(`${API_URL}/establishments?_limit=1`);
    if (res.ok) {
      const data = await res.json();
      result.establishments = Array.isArray(data) ? data[0] : data;
    } else {
      result.errors.push(`Establishments: Status ${res.status}`);
    }
  } catch (e) {
    result.errors.push(`Establishments: ${e.message}`);
  }

  // Buscar CERTIFICATES
  try {
    const res = await fetch(`${API_URL}/certificates?_limit=1`);
    if (res.ok) {
      const data = await res.json();
      result.certificates = Array.isArray(data) ? data[0] : data;
    } else {
      result.errors.push(`Certificates: Status ${res.status}`);
    }
  } catch (e) {
    result.errors.push(`Certificates: ${e.message}`);
  }

  // Buscar ROLES
  try {
    const res = await fetch(`${API_URL}/users-permissions/roles?_limit=1`);
    if (res.ok) {
      const data = await res.json();
      result.roles = data.roles ? data.roles[0] : Array.isArray(data) ? data[0] : data;
    } else {
      result.errors.push(`Roles: Status ${res.status}`);
    }
  } catch (e) {
    result.errors.push(`Roles: ${e.message}`);
  }

  // Buscar PERMISSIONS
  try {
    const res = await fetch(`${API_URL}/users-permissions/permissions?_limit=1`);
    if (res.ok) {
      const data = await res.json();
      result.permissions = data.permissions ? data.permissions[0] : Array.isArray(data) ? data[0] : data;
    } else {
      result.errors.push(`Permissions: Status ${res.status}`);
    }
  } catch (e) {
    result.errors.push(`Permissions: ${e.message}`);
  }

  return result;
}
