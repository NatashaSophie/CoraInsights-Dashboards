import React, { useMemo, useState } from 'react';
import { Line, Doughnut, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { useMerchantDashboard } from '../hooks/useMerchantDashboard';
import { useAuth } from '../context/AuthContext';
import { TrailMap } from '../components/TrailMap/TrailMap';
import { createEstablishment, updateEstablishment } from '../services/analyticsAPI';
import './DashboardMerchant.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

export function DashboardMerchant() {
  const { user } = useAuth();
  const merchantId = user?.id || null;
  const {
    establishments,
    trailParts,
    checkpoints,
    segmentsWithEstablishments,
    segmentStats,
    loading,
    error,
    refresh
  } = useMerchantDashboard(merchantId);

  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    category: '',
    address: '',
    email: '',
    phone: '',
    openingHours: '',
    description: '',
    locationX: '',
    locationY: ''
  });
  const [formStatus, setFormStatus] = useState({ loading: false, error: '', success: '' });
  const isFormDisabled = !merchantId || formStatus.loading;
  const [yearVisibility, setYearVisibility] = useState({});
  const [showForm, setShowForm] = useState(false);

  const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const lineColors = ['#2d9cdb', '#6c5ce7', '#00b894', '#e17055', '#e84393', '#fdcb6e'];

  const handleFieldChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormState({
      name: '',
      category: '',
      address: '',
      email: '',
      phone: '',
      openingHours: '',
      description: '',
      locationX: '',
      locationY: ''
    });
  };

  const getStatus = (establishment) => {
    if (establishment.isActive === true) {
      return { label: 'Aprovado', className: 'approved' };
    }
    if (establishment.isActive === false) {
      return { label: 'Rejeitado', className: 'rejected' };
    }
    return { label: 'Aguardando aprovação', className: 'pending' };
  };

  const establishmentCounts = useMemo(() => {
    return establishments.reduce(
      (acc, item) => {
        if (item.isActive === true) acc.approved += 1;
        else if (item.isActive === false) acc.rejected += 1;
        else acc.pending += 1;
        acc.total += 1;
        return acc;
      },
      { total: 0, approved: 0, pending: 0, rejected: 0 }
    );
  }, [establishments]);

  const isYearVisible = (segmentId, year) => {
    const visibility = yearVisibility[segmentId];
    if (!visibility || visibility[year] === undefined) return true;
    return visibility[year];
  };

  const toggleYear = (segmentId, year) => {
    setYearVisibility(prev => {
      const current = prev[segmentId] || {};
      const nextValue = current[year] === undefined ? false : !current[year];
      return {
        ...prev,
        [segmentId]: {
          ...current,
          [year]: nextValue
        }
      };
    });
  };

  const mapSegments = useMemo(() => {
    const segmentNames = trailParts.map(part => part.name || `Trecho ${part.id}`);
    const segmentStatus = trailParts.map(part => ({
      completed: segmentsWithEstablishments.includes(part.id)
    }));
    const segmentTooltips = trailParts.map(part => {
      const hasEstablishment = segmentsWithEstablishments.includes(part.id);
      return hasEstablishment
        ? `${part.name || `Trecho ${part.id}`} - Com estabelecimentos`
        : `${part.name || `Trecho ${part.id}`} - Sem estabelecimentos`;
    });
    return { segmentNames, segmentStatus, segmentTooltips };
  }, [trailParts, segmentsWithEstablishments]);

  const orderedSegmentStats = useMemo(() => {
    return [...segmentStats].sort((a, b) => Number(a.id) - Number(b.id));
  }, [segmentStats]);

  const checkpointMarkers = useMemo(() => {
    return checkpoints.map(checkpoint => {
      return {
        ...checkpoint,
        name: checkpoint.name,
        tooltip: checkpoint.name
      };
    });
  }, [checkpoints]);

  const establishmentMarkers = useMemo(() => {
    return establishments
      .filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lon))
      .map(item => ({
        lat: item.lat,
        lon: item.lon,
        name: item.name || 'Estabelecimento',
        tooltip: item.trailPartName
          ? `${item.name || 'Estabelecimento'} - ${item.trailPartName}`
          : (item.name || 'Estabelecimento'),
        iconUrl: '/maps/pin.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      }));
  }, [establishments]);

  const startEdit = (establishment) => {
    setEditingId(establishment.id);
    setShowForm(true);
    setFormState({
      name: establishment.name || '',
      category: establishment.category || '',
      address: establishment.address || '',
      email: establishment.email || '',
      phone: establishment.phone || '',
      openingHours: establishment.openingHours || '',
      description: establishment.description || '',
      locationX: establishment.location?.x ?? '',
      locationY: establishment.location?.y ?? ''
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!merchantId) {
      setFormStatus({ loading: false, error: 'Usuario nao identificado.', success: '' });
      return;
    }
    setFormStatus({ loading: true, error: '', success: '' });

    const locationX = Number(formState.locationX);
    const locationY = Number(formState.locationY);
    if (!Number.isFinite(locationX) || !Number.isFinite(locationY)) {
      setFormStatus({ loading: false, error: 'Informe as coordenadas X e Y do local.', success: '' });
      return;
    }

    const payload = {
      name: formState.name,
      category: formState.category,
      address: formState.address,
      email: formState.email,
      phone: formState.phone,
      openingHours: formState.openingHours,
      description: formState.description,
      owner: merchantId,
      location: { x: locationX, y: locationY }
    };

    try {
      if (editingId) {
        await updateEstablishment(editingId, payload);
        setFormStatus({ loading: false, error: '', success: 'Estabelecimento atualizado com sucesso.' });
      } else {
        await createEstablishment(payload);
        setFormStatus({ loading: false, error: '', success: 'Estabelecimento cadastrado com sucesso.' });
      }
      refresh();
      resetForm();
    } catch (submitError) {
      setFormStatus({ loading: false, error: submitError.message, success: '' });
    }
  };

  const handleDeactivate = async (establishment) => {
    if (!merchantId) {
      setFormStatus({ loading: false, error: 'Usuario nao identificado.', success: '' });
      return;
    }
    const shouldProceed = window.confirm('Deseja inativar este estabelecimento?');
    if (!shouldProceed) return;

    setFormStatus({ loading: true, error: '', success: '' });
    try {
      await updateEstablishment(establishment.id, { isActive: false });
      refresh();
      setFormStatus({ loading: false, error: '', success: 'Estabelecimento inativado.' });
    } catch (submitError) {
      setFormStatus({ loading: false, error: submitError.message, success: '' });
    }
  };

  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout>
        {!merchantId && (
          <div className="status-banner warning">
            <div className="banner-content">
              <span className="banner-icon">⚠️</span>
              <div>
                <h3>Usuário não identificado</h3>
                <p>Faça login novamente para carregar seus estabelecimentos.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="status-banner warning">
            <div className="banner-content">
              <span className="banner-icon">⚠️</span>
              <div>
                <h3>Não foi possível carregar os dados</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          <section className="kpi-section">
            <h2>Seus estabelecimentos</h2>
            <div className="kpi-cards">
              <div className="kpi-card">
                <div className="kpi-icon">🏪</div>
                <div className="kpi-content">
                  <p className="kpi-label">Total cadastrados</p>
                  <p className="kpi-value">{loading ? '-' : establishmentCounts.total}</p>
                  <p className="kpi-subtext">Seus estabelecimentos</p>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">✅</div>
                <div className="kpi-content">
                  <p className="kpi-label">Aprovados</p>
                  <p className="kpi-value">{loading ? '-' : establishmentCounts.approved}</p>
                  <p className="kpi-subtext">Liberados no sistema</p>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">⏳</div>
                <div className="kpi-content">
                  <p className="kpi-label">Aguardando</p>
                  <p className="kpi-value">{loading ? '-' : establishmentCounts.pending}</p>
                  <p className="kpi-subtext">Em análise</p>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">⛔</div>
                <div className="kpi-content">
                  <p className="kpi-label">Rejeitados</p>
                  <p className="kpi-value">{loading ? '-' : establishmentCounts.rejected}</p>
                  <p className="kpi-subtext">Necessitam ajuste</p>
                </div>
              </div>
            </div>
          </section>

          <section className="points-section">
            <div className="points-grid">
              {loading && (
                <div className="point-card">
                  <p>Carregando estabelecimentos...</p>
                </div>
              )}
              {!loading && establishments.length === 0 && (
                <div className="point-card">
                  <p>Nenhum estabelecimento cadastrado ainda.</p>
                </div>
              )}
              {establishments.map(establishment => {
                const status = getStatus(establishment);
                return (
                  <div className="point-card" key={establishment.id}>
                    <div className="point-header">
                      <h3>{establishment.name || 'Estabelecimento'}</h3>
                      <span className={`badge ${status.className}`}>{status.label}</span>
                    </div>
                    <div className="point-details">
                      <p><strong>Categoria:</strong> {establishment.category || '-'}</p>
                      <p><strong>Endereço:</strong> {establishment.address || '-'}</p>
                      <p><strong>Telefone:</strong> {establishment.phone || '-'}</p>
                      <p><strong>Email:</strong> {establishment.email || '-'}</p>
                      <p><strong>Horário:</strong> {establishment.openingHours || '-'}</p>
                      <p><strong>Trecho:</strong> {establishment.trailPartName || '-'}</p>
                      {establishment.isActive === false && (
                        <p><strong>Motivo da rejeição:</strong> {establishment.rejectionReason || 'Motivo não informado'}</p>
                      )}
                    </div>
                    <div className="point-actions">
                      <button className="btn btn-secondary" type="button" onClick={() => startEdit(establishment)}>
                        Editar
                      </button>
                      <button className="btn btn-secondary" type="button" onClick={() => handleDeactivate(establishment)}>
                        Inativar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="section-header">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setShowForm(true);
                  setFormState({
                    name: '',
                    category: '',
                    address: '',
                    email: '',
                    phone: '',
                    openingHours: '',
                    description: '',
                    locationX: '',
                    locationY: ''
                  });
                }}
                disabled={isFormDisabled}
              >
                + Novo estabelecimento
              </button>
            </div>
          </section>

          {showForm && (
            <section className="merchant-form-section">
              <h2>{editingId ? 'Editar estabelecimento' : 'Cadastrar novo estabelecimento'}</h2>
              <form className="merchant-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="merchant-name">Nome</label>
                  <input
                    id="merchant-name"
                    type="text"
                    value={formState.name}
                    onChange={(event) => handleFieldChange('name', event.target.value)}
                    disabled={isFormDisabled}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="merchant-category">Categoria</label>
                  <input
                    id="merchant-category"
                    type="text"
                    value={formState.category}
                    onChange={(event) => handleFieldChange('category', event.target.value)}
                    disabled={isFormDisabled}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="merchant-address">Endereço</label>
                  <input
                    id="merchant-address"
                    type="text"
                    value={formState.address}
                    onChange={(event) => handleFieldChange('address', event.target.value)}
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="merchant-email">Email</label>
                  <input
                    id="merchant-email"
                    type="email"
                    value={formState.email}
                    onChange={(event) => handleFieldChange('email', event.target.value)}
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="merchant-phone">Telefone</label>
                  <input
                    id="merchant-phone"
                    type="text"
                    value={formState.phone}
                    onChange={(event) => handleFieldChange('phone', event.target.value)}
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="merchant-hours">Horario de funcionamento</label>
                  <input
                    id="merchant-hours"
                    type="text"
                    value={formState.openingHours}
                    onChange={(event) => handleFieldChange('openingHours', event.target.value)}
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="merchant-x">Coordenada X (UTM)</label>
                  <input
                    id="merchant-x"
                    type="number"
                    value={formState.locationX}
                    onChange={(event) => handleFieldChange('locationX', event.target.value)}
                    disabled={isFormDisabled}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="merchant-y">Coordenada Y (UTM)</label>
                  <input
                    id="merchant-y"
                    type="number"
                    value={formState.locationY}
                    onChange={(event) => handleFieldChange('locationY', event.target.value)}
                    disabled={isFormDisabled}
                    required
                  />
                </div>
                <div className="form-field full">
                  <label htmlFor="merchant-description">Descrição</label>
                  <textarea
                    id="merchant-description"
                    rows="3"
                    value={formState.description}
                    onChange={(event) => handleFieldChange('description', event.target.value)}
                    disabled={isFormDisabled}
                  />
                </div>
              </div>
                {formStatus.error && <p className="form-message error">{formStatus.error}</p>}
                {formStatus.success && <p className="form-message success">{formStatus.success}</p>}
                <div className="form-actions">
                  <button className="btn btn-primary" type="submit" disabled={isFormDisabled}>
                    {editingId ? 'Salvar alteracoes' : 'Cadastrar estabelecimento'}
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={resetForm}>
                    Cancelar
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="analysis-section">
            <h2>Mapa dos trechos com estabelecimentos</h2>
            <div className="analysis-card">
              <TrailMap
                kmlUrl="http://localhost:1337/maps/caminho-cora.kml"
                completedCount={segmentsWithEstablishments.length}
                totalCount={trailParts.length}
                segmentNames={mapSegments.segmentNames}
                segmentStatus={mapSegments.segmentStatus}
                segmentTooltips={mapSegments.segmentTooltips}
                checkpoints={checkpointMarkers}
                markers={establishmentMarkers}
              />
            </div>
          </section>

          <section className="analysis-section">
            <h2>Informações dos trechos com estabelecimentos</h2>
            <div className={`segment-stats-grid ${segmentStats.length > 1 ? 'stacked' : ''}`}>
              {segmentStats.length === 0 && (
                <div className="analysis-card">
                  <p>Nenhuma informação de trecho disponível no momento.</p>
                </div>
              )}
              {orderedSegmentStats.map(stat => (
                <div className="analysis-card segment-card" key={stat.id}>
                  <h3>{stat.name}</h3>
                  <div className="segment-subcards">
                    {(() => {
                      const monthlyByYear = stat.monthlyByYear || {};
                      const years = Object.keys(monthlyByYear).sort();
                      const yearColors = years.reduce((acc, year, index) => {
                        acc[year] = lineColors[index % lineColors.length];
                        return acc;
                      }, {});
                      const datasets = years
                        .filter(year => isYearVisible(stat.id, year))
                        .map((year, index) => ({
                          label: year,
                          data: monthlyByYear[year] || Array.from({ length: 12 }, () => 0),
                          borderColor: yearColors[year],
                          backgroundColor: 'transparent',
                          borderWidth: 2,
                          tension: 0.3,
                          pointRadius: 2
                        }));
                      const lineData = {
                        labels: monthLabels,
                        datasets: datasets.length
                          ? datasets
                          : [{
                              label: 'Sem dados',
                              data: Array.from({ length: 12 }, () => 0),
                              borderColor: '#d0d5dd',
                              backgroundColor: 'transparent',
                              borderDash: [4, 4],
                              pointRadius: 0
                            }]
                      };
                      const lineOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { beginAtZero: true, ticks: { precision: 0 } },
                          x: { ticks: { maxRotation: 0, minRotation: 0 } }
                        }
                      };

                      return (
                        <div className="segment-subcard span-full">
                          <div className="segment-subcard-header">
                            <h4>Inciência por Meses do Ano</h4>
                            <div className="year-toggles">
                              {years.length === 0 && <span className="year-empty">Sem dados</span>}
                              {years.map(year => (
                                <label
                                  key={year}
                                  className={`year-toggle ${isYearVisible(stat.id, year) ? '' : 'inactive'}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isYearVisible(stat.id, year)}
                                    onChange={() => toggleYear(stat.id, year)}
                                  />
                                  <span className="year-swatch" style={{ backgroundColor: yearColors[year] }} />
                                  <span>{year}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="chart-wrapper">
                            <Line data={lineData} options={lineOptions} />
                          </div>
                        </div>
                      );
                    })()}

                    {(() => {
                      const male = stat.demographics?.male || 0;
                      const female = stat.demographics?.female || 0;
                      const total = stat.totalCompletions || (male + female);
                      const doughnutData = {
                        labels: ['Masculino', 'Feminino'],
                        datasets: [
                          {
                            data: [male, female],
                            backgroundColor: ['#2d9cdb', '#e84393'],
                            borderWidth: 0
                          }
                        ]
                      };
                      const doughnutOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%',
                        plugins: { legend: { display: false } }
                      };

                      return (
                        <div className="segment-subcard">
                          <h4>Total de peregrinos</h4>
                          <div className="chart-doughnut">
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                            <div className="chart-center">
                              <span>Total</span>
                              <strong>{total}</strong>
                            </div>
                          </div>
                          <div className="chart-legend">
                            <div className="chart-legend-item">
                              <span className="chart-swatch male" /> Masculino ({male})
                            </div>
                            <div className="chart-legend-item">
                              <span className="chart-swatch female" /> Feminino ({female})
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {(() => {
                      const ageData = {
                        labels: ['Até 29', '30-44', '45-59', '60+'],
                        datasets: [
                          {
                            data: [
                              stat.demographics?.ageUnder30 || 0,
                              stat.demographics?.age30To44 || 0,
                              stat.demographics?.age45To59 || 0,
                              stat.demographics?.age60Plus || 0
                            ],
                            backgroundColor: ['#74b9ff', '#a29bfe', '#55efc4', '#ffeaa7'],
                            borderWidth: 0
                          }
                        ]
                      };
                      const pieOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom' } }
                      };

                      return (
                        <div className="segment-subcard">
                          <h4>Faixa etária</h4>
                          <div className="chart-wrapper">
                            <Pie data={ageData} options={pieOptions} />
                          </div>
                        </div>
                      );
                    })()}

                    {(() => {
                      const modalityData = {
                        labels: ['Caminhada', 'Bike'],
                        datasets: [
                          {
                            data: [stat.modality?.foot || 0, stat.modality?.bike || 0],
                            backgroundColor: ['#00b894', '#0984e3'],
                            borderRadius: 6
                          }
                        ]
                      };
                      const barOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                      };

                      return (
                        <div className="segment-subcard">
                          <h4>Modalidade</h4>
                          <div className="chart-wrapper">
                            <Bar data={modalityData} options={barOptions} />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <footer className="dashboard-footer">
          <p>Caminho de Cora &#169; 2026 - Dashboards</p>
        </footer>
      </DashboardLayout>
    </>
  );
}
