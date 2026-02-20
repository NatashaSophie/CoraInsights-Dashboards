import React from 'react';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import './DashboardManager.css';

// Dados estáticos para teste - Gestor (ID: 211)
const MANAGER_DASHBOARD_DATA = {
  manager: {
    id: 211,
    username: 'gestor@cora.com',
    email: 'gestor@cora.com'
  },
  kpiData: {
    totalUsers: 163,
    totalTrails: 50,
    publishedTrails: 45,
    draftTrails: 5,
    completionRate: 90,
    totalMerchants: 3,
    completedTrails: 45,
    fullPathTrails: 38
  },
  merchants: [
    {
      id: 1,
      name: 'Pousada Águas do Cerrado',
      email: 'contato@pousadaaguasdocerrado.com.br',
      pointsOfSale: 2,
      status: 'approved',
      registrationDate: '15/01/2026',
      category: 'Hospedagem'
    },
    {
      id: 2,
      name: 'Restaurante Sabor Goiano',
      email: 'contato@sabor-goiano.com.br',
      pointsOfSale: 1,
      status: 'approved',
      registrationDate: '20/01/2026',
      category: 'Restaurante'
    },
    {
      id: 3,
      name: 'Loja de Souvenirs Pirenópolis',
      email: 'vendas@souvenirs-pirenopolis.com.br',
      pointsOfSale: 3,
      status: 'pending',
      registrationDate: '28/01/2026',
      category: 'Comércio'
    }
  ],
  trailsData: {
    totalTrails: 50,
    completedTrails: 45,
    inProgressTrails: 5,
    modalities: {
      'Pedestre': 28,
      'Bicicleta': 22
    },
    completionByDifficulty: {
      'Fácil': 85,
      'Moderado': 90,
      'Difícil': 92
    }
  },
  usersData: {
    totalUsers: 163,
    maleUsers: 98,
    femaleUsers: 65,
    registrationsByMonth: {
      'Janeiro 2026': 12,
      'Dezembro 2025': 18,
      'Novembro 2025': 22,
      'Outubro 2025': 25,
      'Setembro 2025': 20,
      'Agosto 2025': 15,
      'Julho 2025': 10
    }
  }
};

export function DashboardManagerTeste() {
  const data = MANAGER_DASHBOARD_DATA;
  const { kpiData, merchants, trailsData, usersData } = data;

  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout>
        <div className="dashboard-grid">
          {/* KPI Cards */}
          <section className="kpi-section">
            <h2>Indicadores Gerenciais</h2>
            <div className="kpi-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="kpi-card">
                <div className="kpi-icon">👥</div>
                <div className="kpi-content">
                  <p className="kpi-label">Total de Peregrinos</p>
                  <p className="kpi-value">{kpiData.totalUsers}</p>
                  <p className="kpi-subtext">Usuários cadastrados</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">✅</div>
                <div className="kpi-content">
                  <p className="kpi-label">Taxa de Conclusão</p>
                  <p className="kpi-value">{kpiData.completionRate}%</p>
                  <p className="kpi-subtext">Jornadas completas</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">🛣️</div>
                <div className="kpi-content">
                  <p className="kpi-label">Percursos Concluídos</p>
                  <p className="kpi-value">{kpiData.completedTrails}</p>
                  <p className="kpi-subtext">Caminho parcial ou completo</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">🛤️</div>
                <div className="kpi-content">
                  <p className="kpi-label">Caminho Completo</p>
                  <p className="kpi-value">{kpiData.fullPathTrails}</p>
                  <p className="kpi-subtext">13 trechos percorridos</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">⏳</div>
                <div className="kpi-content">
                  <p className="kpi-label">Percursos em Andamento</p>
                  <p className="kpi-value">{kpiData.draftTrails}</p>
                  <p className="kpi-subtext">Em desenvolvimento</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon">🛍️</div>
                <div className="kpi-content">
                  <p className="kpi-label">Comerciantes</p>
                  <p className="kpi-value">{kpiData.totalMerchants}</p>
                  <p className="kpi-subtext">Parceiros ativos</p>
                </div>
              </div>

            </div>
          </section>

          {/* Análises em Grid 2 Colunas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', gridColumn: '1 / -1', marginBottom: '20px', alignItems: 'stretch' }}>
            {/* Análises Gerenciais */}
            <section className="analysis-section">
              <h2>Distribuição de Usuários</h2>
            <div className="analysis-card">
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>👨 Masculino</span>
                    <span>{usersData.maleUsers} ({Math.round(usersData.maleUsers / usersData.totalUsers * 100)}%)</span>
                  </div>
                  <div style={{
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    height: '20px'
                  }}>
                    <div style={{
                      backgroundColor: '#2196F3',
                      height: '100%',
                      width: `${Math.round(usersData.maleUsers / usersData.totalUsers * 100)}%`,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
                    <span style={{ fontWeight: 'bold' }}>👩 Feminino</span>
                    <span>{usersData.femaleUsers} ({Math.round(usersData.femaleUsers / usersData.totalUsers * 100)}%)</span>
                  </div>
                  <div style={{
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    height: '20px'
                  }}>
                    <div style={{
                      backgroundColor: '#E91E63',
                      height: '100%',
                      width: `${Math.round(usersData.femaleUsers / usersData.totalUsers * 100)}%`,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
            </section>

            {/* Modalidades de Trilhas */}
            <section className="analysis-section">
              <h2>Trilhas por Modalidade</h2>
            <div className="analysis-card">
              <div style={{ padding: '20px' }}>
                {Object.keys(trailsData.modalities).map(modality => (
                  <div key={modality} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold' }}>{modality}</span>
                      <span>{trailsData.modalities[modality]} ({Math.round(trailsData.modalities[modality] / trailsData.totalTrails * 100)}%)</span>
                    </div>
                    <div style={{
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      height: '20px'
                    }}>
                      <div style={{
                        backgroundColor: modality === 'Pedestre' ? '#4CAF50' : '#FF9800',
                        height: '100%',
                        width: `${Math.round(trailsData.modalities[modality] / trailsData.totalTrails * 100)}%`,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </section>
          </div>

          {/* Registros de Usuários por Mês */}
          <section className="analysis-section" style={{ gridColumn: '1 / -1' }}>
            <h2>Novos Registros por Mês</h2>
            <div className="analysis-card">
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '15px' }}>
                  {Object.keys(usersData.registrationsByMonth).map(month => (
                    <div key={month} style={{
                      textAlign: 'center',
                      padding: '15px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{month}</p>
                      <p style={{ margin: '10px 0 0 0', fontSize: '22px', fontWeight: 'bold', color: '#2196F3' }}>
                        {usersData.registrationsByMonth[month]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Tabelas de Gestão */}
          <section className="table-section" style={{ gridColumn: '1 / -1' }}>
            <h2>Gerenciamento de Comerciantes</h2>
            <div className="controls">
              <button className="btn btn-secondary" style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}>+ Novo Comerciante</button>
              <button className="btn btn-secondary" style={{
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>Exportar Relatório</button>
            </div>
            <div className="table-container">
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Nome</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Pontos de Venda</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Data de Cadastro</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {merchants.map(merchant => (
                    <tr key={merchant.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{merchant.name}</td>
                      <td style={{ padding: '12px' }}>{merchant.email}</td>
                      <td style={{ padding: '12px' }}>{merchant.pointsOfSale}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: merchant.status === 'approved' ? '#C8E6C9' : '#FFE0B2',
                          color: merchant.status === 'approved' ? '#2E7D32' : '#E65100'
                        }}>
                          {merchant.status === 'approved' ? '✅ Aprovado' : '⏳ Aguardando'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{merchant.registrationDate}</td>
                      <td style={{ padding: '12px' }}>
                        <button style={{
                          padding: '6px 12px',
                          marginRight: '8px',
                          backgroundColor: '#F0F0F0',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>✏️</button>
                        <button style={{
                          padding: '6px 12px',
                          backgroundColor: '#F0F0F0',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>👁️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Taxa de Conclusão por Dificuldade */}
          <section className="analysis-section" style={{ gridColumn: '1 / -1' }}>
            <h2>Taxa de Conclusão por Dificuldade</h2>
            <div className="analysis-card">
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  {Object.keys(trailsData.completionByDifficulty).map(difficulty => (
                    <div key={difficulty} style={{
                      padding: '20px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{difficulty}</h4>
                      <div style={{
                        backgroundColor: '#e0e0e0',
                        borderRadius: '4px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          backgroundColor: difficulty === 'Fácil' ? '#4CAF50' : difficulty === 'Moderado' ? '#FF9800' : '#F44336',
                          height: '100%',
                          width: `${trailsData.completionByDifficulty[difficulty]}%`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {trailsData.completionByDifficulty[difficulty]}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Relatórios */}
          <section className="reports-section" style={{ gridColumn: '1 / -1' }}>
            <h2>Relatórios Rápidos</h2>
            <div className="reports-container" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div className="report-card" style={{
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #ddd',
                borderLeft: '4px solid #2196F3'
              }}>
                <h4 style={{ color: '#666', marginTop: 0 }}>📈 Relatório Semanal</h4>
                <p style={{ color: '#666', fontSize: '14px' }}>Dados de atividade da semana passada</p>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>Gerar</button>
              </div>

              <div className="report-card" style={{
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #ddd',
                borderLeft: '4px solid #9C27B0'
              }}>
                <h4 style={{ color: '#666', marginTop: 0 }}>📊 Relatório Mensal</h4>
                <p style={{ color: '#666', fontSize: '14px' }}>Análise completa do mês</p>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>Gerar</button>
              </div>

              <div className="report-card" style={{
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #ddd',
                borderLeft: '4px solid #4CAF50'
              }}>
                <h4 style={{ color: '#666', marginTop: 0 }}>📋 Relatório de Comerciantes</h4>
                <p style={{ color: '#666', fontSize: '14px' }}>Desempenho dos parceiros</p>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>Gerar</button>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    </>
  );
}
