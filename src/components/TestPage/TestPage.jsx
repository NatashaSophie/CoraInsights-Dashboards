import React, { useState, useEffect } from 'react';
import { fetchTestData } from '../../services/testDatabaseAPI';
import './TestPage.css';

export default function TestPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchTestData();
        setData(result);
        setErrors(result.errors);
      } catch (e) {
        setErrors([`Erro ao carregar dados: ${e.message}`]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const DataBlock = ({ title, data, expectedFields }) => (
    <div className="test-block">
      <h3>{title}</h3>
      {data ? (
        <div className="data-container">
          <pre>{JSON.stringify(data, null, 2)}</pre>
          {expectedFields && (
            <div className="fields-list">
              <strong>Campos esperados:</strong>
              <ul>
                {expectedFields.map((field, idx) => (
                  <li key={idx} className={data[field] !== undefined ? 'found' : 'missing'}>
                    {field}: {data[field] !== undefined ? '✓' : '✗'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="no-data">Dados não disponíveis</p>
      )}
    </div>
  );

  if (loading) {
    return <div className="test-page"><div className="loading">Carregando dados...</div></div>;
  }

  return (
    <div className="test-page">
      <div className="test-container">
        <h1>🧪 Página de Teste - Estrutura do Banco de Dados</h1>
        
        {/* Seção de Problemas Identificados */}
        <div style={{
          background: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#856404', marginTop: 0 }}>⚠️ Problemas Identificados</h2>
          <ul style={{ color: '#856404', marginBottom: 0 }}>
            <li><strong>Modality Inconsistente</strong>: API retorna "bicicleta" mas modelo define enum["foot", "bike"]. 
              <br/>✅ <em>Solução aplicada: convertendo para "bike" automaticamente</em></li>
            <li><strong>Timezone (+3h)</strong>: API retorna em UTC mas dados em hora local. 
              <br/>✅ <em>Solução aplicada: subtraindo 3 horas para Brasília (UTC-3)</em></li>
            <li><strong>Endpoints 403 Forbidden</strong>: /trail-parts, /checkpoints, /establishments, /certificates, /roles, /permissions
              <br/>⏳ <em>Necessário habilitar permissões no Strapi Admin</em></li>
          </ul>
        </div>
        
        {errors.length > 0 && (
          <div className="errors-list">
            <h3>⚠️ Erros encontrados:</h3>
            <ul>
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="data-sections">
          <DataBlock
            title="👤 USUÁRIOS (users-permissions_user)"
            data={data?.users}
            expectedFields={[
              'id', 'username', 'email', 'password', 'name', 'nickname',
              'birthdate', 'sex', 'provider', 'blocked', 'role',
              'establishments', 'trails', 'created_at', 'updated_at'
            ]}
          />

          <DataBlock
            title="🥾 PERCURSOS (trails) - ✅ CONVERTIDO"
            data={data?.trails}
            expectedFields={[
              'id', 'user', 'startedAt', 'finishedAt', 'modality',
              'inversePaths', 'routes', 'certificate', 'created_at', 'updated_at'
            ]}
          />
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '-10px' }}>
            <em>ℹ️ Campos modality e datas convertidos para padrão correto</em>
          </p>

          <DataBlock
            title="🛣️ TRILHAS PERCORRIDAS (trail_routes) - ✅ CONVERTIDO"
            data={data?.trailRoutes}
            expectedFields={[
              'id', 'trail', 'route', 'finishedAt', 'trackedPath',
              'mapUrl', 'published_at', 'created_at', 'updated_at'
            ]}
          />

          <DataBlock
            title="📍 TRECHOS PRÉ-DEFINIDOS (trail_parts)"
            data={data?.trailParts}
            expectedFields={[
              'id', 'name', 'slug', 'description', 'difficulty',
              'distance', 'time', 'fromCheckpoint', 'toCheckpoint', 'created_at', 'updated_at'
            ]}
          />

          <DataBlock
            title="🗺️ CHECKPOINTS (checkpoints)"
            data={data?.checkpoints}
            expectedFields={[
              'id', 'name', 'location', 'estabelecimentos', 'created_at', 'updated_at'
            ]}
          />

          <DataBlock
            title="🏪 ESTABELECIMENTOS (establishments)"
            data={data?.establishments}
            expectedFields={[
              'id', 'name', 'address', 'email', 'phone', 'category',
              'location', 'owner', 'description', 'openingHours', 'services',
              'isActive', 'created_at', 'updated_at'
            ]}
          />

          <DataBlock
            title="🎓 CERTIFICADOS (certificates)"
            data={data?.certificates}
            expectedFields={[
              'id', 'code', 'trail', 'file', 'created_at', 'updated_at'
            ]}
          />

          <DataBlock
            title="👥 PAPÉIS (users-permissions_role)"
            data={data?.roles}
            expectedFields={[
              'id', 'name', 'description', 'type', 'created_at', 'updated_at'
            ]}
          />

          <DataBlock
            title="🔐 PERMISSÕES (users-permissions_permission)"
            data={data?.permissions}
            expectedFields={[
              'id', 'role', 'type', 'controller', 'action',
              'enabled', 'policy', 'created_at', 'updated_at'
            ]}
          />
        </div>
      </div>
    </div>
  );
}
