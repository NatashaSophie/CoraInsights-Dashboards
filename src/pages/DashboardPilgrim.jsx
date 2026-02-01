import React from 'react';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import './DashboardPilgrim.css';

export function DashboardPilgrim() {
  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout>
      <div className="dashboard-grid">
        {/* KPI Cards */}
        <section className="kpi-section">
          <h2>Seus Indicadores</h2>
          <div className="kpi-cards">
            <div className="kpi-card">
              <div className="kpi-icon">📍</div>
              <div className="kpi-content">
                <p className="kpi-label">Trechos Completados</p>
                <p className="kpi-value">5/13</p>
                <div className="kpi-progress">
                  <div className="progress-bar" style={{ width: '38%' }}></div>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">⏱️</div>
              <div className="kpi-content">
                <p className="kpi-label">Tempo Gasto</p>
                <p className="kpi-value">45h 30m</p>
                <p className="kpi-subtext">Desde o início</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">📅</div>
              <div className="kpi-content">
                <p className="kpi-label">Próximo Trecho</p>
                <p className="kpi-value">Trecho 6</p>
                <p className="kpi-subtext">A definir</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🏆</div>
              <div className="kpi-content">
                <p className="kpi-label">Pontos Acumulados</p>
                <p className="kpi-value">1.250</p>
                <p className="kpi-subtext">Com comércios parceiros</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gráficos e Análises */}
        <section className="charts-section">
          <h2>Análises da Jornada</h2>
          <div className="charts-container">
            <div className="chart-card placeholder">
              <h3>Progresso da Trilha</h3>
              <div className="placeholder-content">
                [Gráfico de Progresso]
              </div>
            </div>

            <div className="chart-card placeholder">
              <h3>Tempo por Trecho</h3>
              <div className="placeholder-content">
                [Gráfico de Tempo]
              </div>
            </div>
          </div>
        </section>

        {/* Tabelas */}
        <section className="table-section">
          <h2>Trechos Realizados</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trecho</th>
                  <th>Data de Início</th>
                  <th>Data de Conclusão</th>
                  <th>Tempo Gasto</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Trecho 1</td>
                  <td>01/01/2024</td>
                  <td>05/01/2024</td>
                  <td>4h 30m</td>
                  <td><span className="badge completed">Concluído</span></td>
                </tr>
                <tr>
                  <td>Trecho 2</td>
                  <td>06/01/2024</td>
                  <td>10/01/2024</td>
                  <td>5h 15m</td>
                  <td><span className="badge completed">Concluído</span></td>
                </tr>
                <tr>
                  <td>Trecho 3</td>
                  <td>12/01/2024</td>
                  <td>16/01/2024</td>
                  <td>3h 45m</td>
                  <td><span className="badge completed">Concluído</span></td>
                </tr>
                <tr>
                  <td>Trecho 4</td>
                  <td>18/01/2024</td>
                  <td>22/01/2024</td>
                  <td>6h 00m</td>
                  <td><span className="badge completed">Concluído</span></td>
                </tr>
                <tr>
                  <td>Trecho 5</td>
                  <td>24/01/2024</td>
                  <td>28/01/2024</td>
                  <td>5h 30m</td>
                  <td><span className="badge completed">Concluído</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Próximos Passos */}
        <section className="next-steps-section">
          <h2>Próximos Passos</h2>
          <div className="next-steps-container">
            <div className="next-step-card">
              <div className="step-number">6</div>
              <div className="step-content">
                <h4>Próximo Trecho</h4>
                <p>Prepare-se para iniciar o trecho 6. Confira o mapa e as informações disponíveis.</p>
                <button className="btn btn-primary">Visualizar Trecho</button>
              </div>
            </div>
          </div>
        </section>
      </div>
      </DashboardLayout>
    </>
  );
}
