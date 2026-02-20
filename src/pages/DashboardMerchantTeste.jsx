import React from 'react';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import './DashboardMerchant.css';

// Dados estáticos para teste - Comerciante2 (ID: 213)
const MERCHANT_DASHBOARD_DATA = {
  establishment: {
    id: 1,
    name: 'Pousada Águas do Cerrado',
    description: 'Uma pousada aconchegante localizada no coração do Cerrado, perfeita para peregrinos em busca de descanso e conforto.',
    address: 'Estrada de Terra, Km 45, Pirenópolis - GO',
    phone: '(62) 3331-1234',
    email: 'contato@pousadaaguasdocerrado.com.br',
    website: 'www.pousadaaguasdocerrado.com.br',
    category: 'Hospedagem',
    latitude: -15.8004,
    longitude: -48.8168,
    openingHours: '6h - 22h'
  },
  trailSection: {
    id: 1,
    name: 'Cidade de Corumbá ao Salto de Corumbá',
    slug: 'corumba-salto-corumba',
    distance: 12.5,
    difficulty: 'Moderado',
    estimatedTime: 4.5
  },
  statistics: {
    totalPilgrims: 245,
    averageAge: 38.5,
    genderDistribution: {
      'Masculino': 147,
      'Feminino': 85,
      'Não informado': 13
    },
    genderPercentages: {
      'Masculino': '60.0',
      'Feminino': '34.7',
      'Não informado': '5.3'
    },
    modalityDistribution: {
      'A Pé': 135,
      'Bicicleta': 110
    },
    modalityPercentages: {
      'A Pé': '55.1',
      'Bicicleta': '44.9'
    },
    monthlyFrequency: {
      'Janeiro 2026': 42,
      'Dezembro 2025': 38,
      'Novembro 2025': 35,
      'Outubro 2025': 40,
      'Setembro 2025': 32,
      'Agosto 2025': 28,
      'Julho 2025': 30
    },
    dominantGender: 'Masculino',
    dominantModality: 'A Pé'
  }
};

export function DashboardMerchantTeste() {
  const data = MERCHANT_DASHBOARD_DATA;
  const { establishment, trailSection, statistics } = data;

  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout>
        <div className="dashboard-grid">
          {/* Informações do Estabelecimento */}
          <section className="info-section" style={{ gridColumn: '1 / -1' }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* Header com título e botões */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
                borderBottom: '2px solid #f0f0f0',
                paddingBottom: '15px'
              }}>
                <div>
                  <h2 style={{ margin: 0, marginBottom: '8px' }}>{establishment.name}</h2>
                  <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
                    📍 {establishment.category}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{
                    padding: '10px 20px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px'
                  }} onMouseOver={e => e.target.style.backgroundColor = '#1976D2'} onMouseOut={e => e.target.style.backgroundColor = '#2196F3'}>
                    ✎ Editar Estabelecimento
                  </button>
                  <button style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px'
                  }} onMouseOver={e => e.target.style.backgroundColor = '#388E3C'} onMouseOut={e => e.target.style.backgroundColor = '#4CAF50'}>
                    + Novo Estabelecimento
                  </button>
                </div>
              </div>

              {/* Descrição */}
              <p style={{
                color: '#666',
                marginBottom: '25px',
                lineHeight: '1.6',
                fontSize: '15px'
              }}>
                {establishment.description}
              </p>

              {/* Grid de Informações */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px'
              }}>
                {/* Card - Contato */}
                <div style={{
                  backgroundColor: '#f9f9f9',
                  padding: '15px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📞 Contato</h4>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Telefone:</strong> {establishment.phone}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Email:</strong> <a href={`mailto:${establishment.email}`} style={{ color: '#2196F3', textDecoration: 'none' }}>{establishment.email}</a>
                  </p>
                </div>

                {/* Card - Localização */}
                <div style={{
                  backgroundColor: '#f9f9f9',
                  padding: '15px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📍 Localização</h4>
                  <p style={{ margin: '5px 0', color: '#666', lineHeight: '1.5' }}>
                    {establishment.address}
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
                    Lat: {establishment.latitude.toFixed(4)} | Lon: {establishment.longitude.toFixed(4)}
                  </p>
                </div>

                {/* Card - Online */}
                <div style={{
                  backgroundColor: '#f9f9f9',
                  padding: '15px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🌐 Online</h4>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Website:</strong>
                  </p>
                  <a 
                    href={`http://${establishment.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: '#2196F3',
                      textDecoration: 'none',
                      fontSize: '14px',
                      wordBreak: 'break-all'
                    }}
                  >
                    {establishment.website}
                  </a>
                </div>

                {/* Card - Horário */}
                <div style={{
                  backgroundColor: '#f9f9f9',
                  padding: '15px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🕐 Funcionamento</h4>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '16px', fontWeight: 'bold' }}>
                    {establishment.openingHours}
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#4CAF50' }}>
                    ● Aberto agora
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de Trechos da Trilha */}
          <section className="kpi-section">
            <h2>Seu Trecho da Trilha</h2>
            <div style={{
              backgroundColor: '#f9f9f9',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <h3>{trailSection.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
                <div>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Distância</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{trailSection.distance} km</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Dificuldade</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{trailSection.difficulty}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Tempo Estimado</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{trailSection.estimatedTime}h</p>
                </div>
              </div>
            </div>
          </section>

          {/* KPI Cards - Peregrinos */}
          <section className="kpi-section" style={{ gridColumn: '1 / -1' }}>
            <h2>Dados de Peregrinos no Seu Trecho</h2>
            <div className="kpi-cards">
              <div className="kpi-card">
                <div className="kpi-icon">👥</div>
                <div className="kpi-content">
                  <p className="kpi-label">Total de Peregrinos</p>
                  <p className="kpi-value">{statistics.totalPilgrims}</p>
                  <p className="kpi-subtext">Que passaram pelo trecho</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">🎂</div>
                <div className="kpi-content">
                  <p className="kpi-label">Idade Média</p>
                  <p className="kpi-value">{statistics.averageAge.toFixed(1)} anos</p>
                  <p className="kpi-subtext">Idade média dos peregrinos</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">{statistics.dominantGender === 'Masculino' ? '👨' : '👩'}</div>
                <div className="kpi-content">
                  <p className="kpi-label">Gênero Dominante</p>
                  <p className="kpi-value">{statistics.dominantGender}</p>
                  <p className="kpi-subtext">{statistics.genderPercentages[statistics.dominantGender]}% dos peregrinos</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">{statistics.dominantModality === 'A Pé' ? '🚶' : '🚴'}</div>
                <div className="kpi-content">
                  <p className="kpi-label">Modalidade Dominante</p>
                  <p className="kpi-value">{statistics.dominantModality}</p>
                  <p className="kpi-subtext">{statistics.modalityPercentages[statistics.dominantModality]}% dos peregrinos</p>
                </div>
              </div>
            </div>
          </section>

          {/* Análises - Distribuição de Gênero */}
          <section className="analysis-section" style={{ gridColumn: '1 / 2' }}>
            <h2>Distribuição por Gênero</h2>
            <div className="analysis-card">
              <div style={{ padding: '20px' }}>
                {Object.keys(statistics.genderDistribution).map(gender => (
                  <div key={gender} style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>{gender}</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {statistics.genderDistribution[gender]} ({statistics.genderPercentages[gender]}%)
                      </span>
                    </div>
                    <div style={{
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      height: '20px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        backgroundColor: gender === 'Masculino' ? '#2196F3' : gender === 'Feminino' ? '#E91E63' : '#9E9E9E',
                        height: '100%',
                        width: `${statistics.genderPercentages[gender]}%`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Análises - Modalidade de Deslocamento */}
          <section className="analysis-section" style={{ gridColumn: '2 / 3' }}>
            <h2>Modalidade de Deslocamento</h2>
            <div className="analysis-card">
              <div style={{ padding: '20px' }}>
                {Object.keys(statistics.modalityDistribution).map(modality => (
                  <div key={modality} style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>{modality}</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {statistics.modalityDistribution[modality]} ({statistics.modalityPercentages[modality]}%)
                      </span>
                    </div>
                    <div style={{
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      height: '20px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        backgroundColor: modality === 'A Pé' ? '#4CAF50' : '#FF9800',
                        height: '100%',
                        width: `${statistics.modalityPercentages[modality]}%`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Frequência Mensal */}
          <section className="analysis-section" style={{ gridColumn: '1 / -1' }}>
            <h2>Frequência de Peregrinos por Mês</h2>
            <div className="analysis-card">
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
                  {Object.keys(statistics.monthlyFrequency).map(month => (
                    <div key={month} style={{
                      textAlign: 'center',
                      padding: '15px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{month}</p>
                      <p style={{ margin: '10px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
                        {statistics.monthlyFrequency[month]}
                      </p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#999' }}>peregrinos</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Resumo de Insights */}
          <section className="analysis-section" style={{ gridColumn: '1 / -1' }}>
            <h2>Insights Estratégicos para Seu Negócio</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              <div style={{
                padding: '15px',
                backgroundColor: '#E3F2FD',
                borderRadius: '8px',
                borderLeft: '4px solid #2196F3'
              }}>
                <h4 style={{ marginTop: 0, color: '#1976D2' }}>👥 Público Principal</h4>
                <p>Seu trecho é visitado principalmente por {statistics.dominantGender.toLowerCase()}s (60%), 
                com idade média de {statistics.averageAge.toFixed(0)} anos. Considere adaptar seus serviços para este público.</p>
              </div>

              <div style={{
                padding: '15px',
                backgroundColor: '#FFF3E0',
                borderRadius: '8px',
                borderLeft: '4px solid #FF9800'
              }}>
                <h4 style={{ marginTop: 0, color: '#F57C00' }}>🚶 Tipo de Peregrinação</h4>
                <p>A maioria dos peregrinos (55%) percorre o trecho a pé. Ofereça serviços voltados para pedestres 
                como água, lanches leves e descanso.</p>
              </div>

              <div style={{
                padding: '15px',
                backgroundColor: '#F3E5F5',
                borderRadius: '8px',
                borderLeft: '4px solid #9C27B0'
              }}>
                <h4 style={{ marginTop: 0, color: '#7B1FA2' }}>📈 Sazonalidade</h4>
                <p>Janeiro é o mês de pico com 42 visitantes. Prepare-se com maior quantidade de estoque 
                e pessoal durante os meses de verão.</p>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    </>
  );
}
