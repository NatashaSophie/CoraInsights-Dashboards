import React, { useMemo, useState } from 'react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { useManagerDashboard } from '../hooks/useManagerDashboard';
import { TrailMap } from '../components/TrailMap/TrailMap';
import { createEstablishment, createMerchant, updateEstablishment, updateMerchantApproval } from '../services/analyticsAPI';
import './DashboardManager.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const lineColors = ['#2d9cdb', '#6c5ce7', '#00b894', '#e17055', '#e84393', '#fdcb6e'];
const DEFAULT_MERCHANT_PASSWORD = 'Cora@123';


/*
  TRATAMENTO DE ERROS
*/

export function DashboardManager() {
  const {
    data,
    kpiData,
    loading,
    error,
    trailParts,
    checkpoints,
    establishments,
    merchants,
    segmentsWithEstablishments,
    segmentCompletions,
    monthlyRegistrations,
    pilgrimStats,
    directionStats,
    modalityStats,
    refresh
  } = useManagerDashboard();

  const [yearVisibility, setYearVisibility] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    ownerId: '',
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
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [rejectionState, setRejectionState] = useState({
    show: false,
    id: null,
    reason: '',
    establishment: null
  });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [merchantSortConfig, setMerchantSortConfig] = useState({ key: 'status', direction: 'asc' });
  const [merchantAction, setMerchantAction] = useState({ mode: '', merchant: null, reason: '' });
  const [merchantActionStatus, setMerchantActionStatus] = useState({ loading: false, error: '', success: '' });
  const [merchantDraft, setMerchantDraft] = useState({
    name: '',
    nickname: '',
    email: '',
    birthdate: '',
    sex: ''
  });

  
  // Dados fallback quando há erro
  const fallbackKpiData = {
    totalUsers: 0,
    totalTrails: 0,
    publishedTrails: 0,
    completionRate: 0,
    activeUsers: 0
  };


  const displayKpiData = error ? fallbackKpiData : kpiData;

  const handleFieldChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormMode('create');
    setFormState({
      ownerId: '',
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
    setFormStatus({ loading: false, error: '', success: '' });
  };

  const startCreate = () => {
    setEditingId(null);
    setFormMode('create');
    setShowForm(true);
    setFormState({
      ownerId: '',
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

  const startEdit = (establishment) => {
    setEditingId(establishment.id);
    setFormMode('edit');
    setShowForm(true);
    setFormState({
      ownerId: establishment.ownerId || '',
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

  const startView = (establishment) => {
    setEditingId(establishment.id);
    setFormMode('view');
    setShowForm(true);
    setFormState({
      ownerId: establishment.ownerId || '',
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
    if (formMode === 'view') {
      return;
    }

    setFormStatus({ loading: true, error: '', success: '' });
    const locationX = Number(formState.locationX);
    const locationY = Number(formState.locationY);
    if (!Number.isFinite(locationX) || !Number.isFinite(locationY)) {
      setFormStatus({ loading: false, error: 'Informe as coordenadas X e Y do local.', success: '' });
      return;
    }

    const ownerId = Number(formState.ownerId);
    if (!Number.isFinite(ownerId)) {
      setFormStatus({ loading: false, error: 'Informe o dono do estabelecimento.', success: '' });
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
      owner: ownerId,
      location: { x: locationX, y: locationY }
    };

    try {
      if (editingId) {
        await updateEstablishment(editingId, payload);
        setFormStatus({ loading: false, error: '', success: '' });
        setSuccessModal({ open: true, message: 'Estabelecimento salvo com sucesso.' });
      } else {
        await createEstablishment(payload);
        setFormStatus({ loading: false, error: '', success: '' });
        setSuccessModal({ open: true, message: 'Estabelecimento salvo com sucesso.' });
      }
      refresh();
      resetForm();
    } catch (submitError) {
      setFormStatus({ loading: false, error: submitError.message, success: '' });
    }
  };

  const handleApprove = async (establishment) => {
    setFormStatus({ loading: true, error: '', success: '' });
    try {
      await updateEstablishment(establishment.id, { isActive: true, rejectionReason: null });
      refresh();
      setFormStatus({ loading: false, error: '', success: 'Estabelecimento aprovado.' });
    } catch (submitError) {
      setFormStatus({ loading: false, error: submitError.message, success: '' });
    }
  };

  const handleRejectOpen = (establishment) => {
    setRejectionState({
      show: true,
      id: establishment.id,
      reason: '',
      establishment
    });
  };

  const handleRejectSubmit = async (event) => {
    event.preventDefault();
    if (!rejectionState.id) {
      return;
    }
    if (!rejectionState.reason.trim()) {
      setFormStatus({ loading: false, error: 'Informe a justificativa da rejeição.', success: '' });
      return;
    }
    setFormStatus({ loading: true, error: '', success: '' });
    try {
      await updateEstablishment(rejectionState.id, {
        isActive: false,
        rejectionReason: rejectionState.reason.trim()
      });
      refresh();
      setFormStatus({ loading: false, error: '', success: 'Estabelecimento rejeitado.' });
      setRejectionState({ show: false, id: null, reason: '', establishment: null });
    } catch (submitError) {
      setFormStatus({ loading: false, error: submitError.message, success: '' });
    }
  };

  const handleDeactivate = async (establishment) => {
    setFormStatus({ loading: true, error: '', success: '' });
    try {
      await updateEstablishment(establishment.id, { isActive: false });
      refresh();
      setFormStatus({ loading: false, error: '', success: 'Estabelecimento inativado.' });
    } catch (submitError) {
      setFormStatus({ loading: false, error: submitError.message, success: '' });
    }
  };

  const handleReactivate = async (establishment) => {
    setFormStatus({ loading: true, error: '', success: '' });
    try {
      await updateEstablishment(establishment.id, { isActive: true, rejectionReason: null });
      refresh();
      setFormStatus({ loading: false, error: '', success: 'Estabelecimento reativado.' });
    } catch (submitError) {
      setFormStatus({ loading: false, error: submitError.message, success: '' });
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleMerchantSort = (key) => {
    setMerchantSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getStatus = (establishment) => {
    if (establishment.isActive === true) {
      return { label: 'Ativo', className: 'approved' };
    }
    if (establishment.isActive === false) {
      return { label: 'Inativo', className: 'inactive' };
    }
    return { label: 'Aguardando', className: 'pending' };
  };

  const getMerchantStatus = (approvedValue) => {
    if (approvedValue === true) {
      return { label: 'Aprovado', className: 'approved' };
    }
    if (approvedValue === false) {
      return { label: 'Rejeitado', className: 'rejected' };
    }
    return { label: 'Aguardando', className: 'pending' };
  };

  const formatBirthdate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatSexLabel = (value) => {
    const raw = String(value || '').toLowerCase();
    if (raw === 'male' || raw === 'masculino') return 'Masculino';
    if (raw === 'female' || raw === 'feminino') return 'Feminino';
    return '-';
  };

  const normalizeSexValue = (value) => {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'male' || raw === 'masculino' || raw === 'm') return 'Male';
    if (raw === 'female' || raw === 'feminino' || raw === 'f') return 'Female';
    return null;
  };

  const formatUserTypeLabel = (value) => {
    const raw = String(value || '').toLowerCase();
    if (raw === 'manager' || raw === 'gestor') return 'Gestor';
    if (raw === 'merchant' || raw === 'comerciante') return 'Comerciante';
    return 'Peregrino';
  };

  const openMerchantView = (merchant) => {
    setMerchantActionStatus({ loading: false, error: '', success: '' });
    setMerchantAction({ mode: 'view', merchant, reason: '' });
  };

  const openMerchantReject = (merchant) => {
    setMerchantActionStatus({ loading: false, error: '', success: '' });
    setMerchantAction({ mode: 'reject', merchant, reason: '' });
  };

  const openMerchantCreate = () => {
    setMerchantActionStatus({ loading: false, error: '', success: '' });
    setMerchantDraft({ name: '', nickname: '', email: '', birthdate: '', sex: '' });
    setMerchantAction({ mode: 'create', merchant: null, reason: '' });
  };

  const closeMerchantAction = () => {
    setMerchantActionStatus({ loading: false, error: '', success: '' });
    setMerchantAction({ mode: '', merchant: null, reason: '' });
  };

  const handleMerchantApprove = async (merchant) => {
    if (!merchant?.id) return;
    setMerchantActionStatus({ loading: true, error: '', success: '' });
    try {
      await updateMerchantApproval(merchant.id, { approved: true });
      refresh();
      closeMerchantAction();
    } catch (submitError) {
      setMerchantActionStatus({ loading: false, error: submitError.message, success: '' });
    }
  };

  const handleMerchantRejectSubmit = async (event) => {
    event.preventDefault();
    if (!merchantAction.merchant?.id) return;
    if (!merchantAction.reason.trim()) {
      setMerchantActionStatus({ loading: false, error: 'Informe a justificativa da rejeicao.', success: '' });
      return;
    }
    setMerchantActionStatus({ loading: true, error: '', success: '' });
    try {
      await updateMerchantApproval(merchantAction.merchant.id, {
        approved: false,
        reason: merchantAction.reason.trim()
      });
      refresh();
      closeMerchantAction();
    } catch (submitError) {
      setMerchantActionStatus({ loading: false, error: submitError.message, success: '' });
    }
  };

  const handleMerchantDraftChange = (field, value) => {
    setMerchantDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleMerchantCreateSubmit = async (event) => {
    event.preventDefault();
    const name = merchantDraft.name.trim();
    const email = merchantDraft.email.trim();

    if (!name) {
      setMerchantActionStatus({ loading: false, error: 'Informe o nome completo.', success: '' });
      return;
    }

    if (!email) {
      setMerchantActionStatus({ loading: false, error: 'Informe o email.', success: '' });
      return;
    }

    setMerchantActionStatus({ loading: true, error: '', success: '' });
    try {
      await createMerchant({
        name,
        nickname: merchantDraft.nickname.trim() || null,
        email,
        birthdate: merchantDraft.birthdate || null,
        sex: normalizeSexValue(merchantDraft.sex),
        password: DEFAULT_MERCHANT_PASSWORD
      });
      refresh();
      setMerchantActionStatus({
        loading: false,
        error: '',
        success: `Comerciante cadastrado. Senha inicial: ${DEFAULT_MERCHANT_PASSWORD}`
      });
    } catch (submitError) {
      setMerchantActionStatus({ loading: false, error: submitError.message, success: '' });
    }
  };

  const isYearVisible = (year) => {
    if (yearVisibility[year] === undefined) return true;
    return yearVisibility[year];
  };

  const toggleYear = (year) => {
    setYearVisibility(prev => ({
      ...prev,
      [year]: prev[year] === undefined ? false : !prev[year]
    }));
  };

  const orderedEstablishments = useMemo(() => {
    const sorted = [...establishments];
    sorted.sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      const getValue = (item) => {
        if (sortConfig.key === 'owner') return item.ownerName || '';
        if (sortConfig.key === 'status') return getStatus(item).label;
        return item[sortConfig.key] || '';
      };
      const aValue = getValue(a);
      const bValue = getValue(b);
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
    return sorted;
  }, [establishments, sortConfig]);

  const orderedMerchants = useMemo(() => {
    const sorted = [...merchants];
    const statusRank = (approvedValue) => {
      if (approvedValue === null || approvedValue === undefined) return 0;
      if (approvedValue === true) return 1;
      return 2;
    };
    const getName = (item) => String(item.name || item.username || item.email || '').toLowerCase();

    sorted.sort((a, b) => {
      const direction = merchantSortConfig.direction === 'asc' ? 1 : -1;
      if (merchantSortConfig.key === 'status') {
        const rankDiff = (statusRank(a.merchantApproved) - statusRank(b.merchantApproved)) * direction;
        if (rankDiff !== 0) return rankDiff;
        return getName(a).localeCompare(getName(b));
      }

      const getValue = (item) => {
        if (merchantSortConfig.key === 'name') return item.name || item.username || item.email || '';
        if (merchantSortConfig.key === 'email') return item.email || '';
        return item[merchantSortConfig.key] || '';
      };
      const aValue = getValue(a);
      const bValue = getValue(b);
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
    return sorted;
  }, [merchants, merchantSortConfig]);

  const activeEstablishments = useMemo(() => {
    return establishments.filter(item => item.isActive === true);
  }, [establishments]);

  const activeSegmentsWithEstablishments = useMemo(() => {
    return new Set(
      activeEstablishments
        .map(item => item.trailPartId)
        .filter(Boolean)
    );
  }, [activeEstablishments]);

  const orderedCheckpoints = useMemo(() => {
    if (!trailParts.length || !checkpoints.length) {
      return checkpoints;
    }

    const checkpointMap = new Map(
      checkpoints.map(checkpoint => [checkpoint.id, checkpoint])
    );

    const orderedParts = [...trailParts].sort((a, b) => Number(a.id) - Number(b.id));
    const sequence = [];

    orderedParts.forEach((part, index) => {
      if (index === 0 && part.fromCheckpointId) {
        const fromCheckpoint = checkpointMap.get(part.fromCheckpointId);
        if (fromCheckpoint) {
          sequence.push(fromCheckpoint);
        }
      }
      if (part.toCheckpointId) {
        const toCheckpoint = checkpointMap.get(part.toCheckpointId);
        if (toCheckpoint) {
          sequence.push(toCheckpoint);
        }
      }
    });

    return sequence.length ? sequence : checkpoints;
  }, [trailParts, checkpoints]);

  const mapSegments = useMemo(() => {
    const partByCheckpointPair = new Map();
    trailParts.forEach(part => {
      if (part.fromCheckpointId && part.toCheckpointId) {
        partByCheckpointPair.set(`${part.fromCheckpointId}-${part.toCheckpointId}`, part);
      }
    });

    const segmentNames = [];
    const segmentStatus = [];
    const segmentTooltips = [];

    if (!orderedCheckpoints.length) {
      const fallbackNames = trailParts.map(part => part.name || `Trecho ${part.id}`);
      const fallbackStatus = trailParts.map(part => ({
        completed: activeSegmentsWithEstablishments.has(part.id)
      }));
      const fallbackTooltips = trailParts.map(part => {
        const hasEstablishment = activeSegmentsWithEstablishments.has(part.id);
        return hasEstablishment
          ? `${part.name || `Trecho ${part.id}`} - Com estabelecimentos`
          : `${part.name || `Trecho ${part.id}`} - Sem estabelecimentos`;
      });
      return { segmentNames: fallbackNames, segmentStatus: fallbackStatus, segmentTooltips: fallbackTooltips };
    }

    for (let i = 0; i < orderedCheckpoints.length - 1; i += 1) {
      const fromId = orderedCheckpoints[i].id;
      const toId = orderedCheckpoints[i + 1].id;
      const part = partByCheckpointPair.get(`${fromId}-${toId}`)
        || partByCheckpointPair.get(`${toId}-${fromId}`);

      const partName = part?.name || `Trecho ${i + 1}`;
      const hasEstablishment = part ? activeSegmentsWithEstablishments.has(part.id) : false;
      segmentNames.push(partName);
      segmentStatus.push({ completed: hasEstablishment });
      segmentTooltips.push(
        hasEstablishment
          ? `${partName} - Com estabelecimentos`
          : `${partName} - Sem estabelecimentos`
      );
    }

    return { segmentNames, segmentStatus, segmentTooltips };
  }, [trailParts, orderedCheckpoints, activeSegmentsWithEstablishments]);

  const checkpointMarkers = useMemo(() => {
    return orderedCheckpoints.map(checkpoint => ({
      ...checkpoint,
      name: checkpoint.name,
      tooltip: checkpoint.name
    }));
  }, [orderedCheckpoints]);

  const establishmentMarkers = useMemo(() => {
    return activeEstablishments
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
  }, [activeEstablishments]);

  const registrationYears = useMemo(() => Object.keys(monthlyRegistrations || {}).sort(), [monthlyRegistrations]);
  const registrationColors = useMemo(() => {
    return registrationYears.reduce((acc, year, index) => {
      acc[year] = lineColors[index % lineColors.length];
      return acc;
    }, {});
  }, [registrationYears]);

  const registrationDatasets = registrationYears
    .filter(year => isYearVisible(year))
    .map((year) => ({
      label: year,
      data: monthlyRegistrations[year] || Array.from({ length: 12 }, () => 0),
      borderColor: registrationColors[year],
      backgroundColor: 'transparent',
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 2
    }));

  const registrationLineData = {
    labels: monthLabels,
    datasets: registrationDatasets.length
      ? registrationDatasets
      : [{
          label: 'Sem dados',
          data: Array.from({ length: 12 }, () => 0),
          borderColor: '#d0d5dd',
          backgroundColor: 'transparent',
          borderDash: [4, 4],
          pointRadius: 0
        }]
  };

  const registrationLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { ticks: { maxRotation: 0, minRotation: 0 } }
    }
  };

  const segmentLabels = segmentCompletions.map(segment => String(segment.id));
  const segmentBarData = {
    labels: segmentLabels,
    datasets: [
      {
        label: 'Caminhantes',
        data: segmentCompletions.map(segment => segment.foot || 0),
        backgroundColor: '#2d9cdb',
        borderRadius: 6,
        stack: 'total'
      },
      {
        label: 'Ciclistas',
        data: segmentCompletions.map(segment => segment.bike || 0),
        backgroundColor: '#00b894',
        borderRadius: 6,
        stack: 'total'
      }
    ]
  };

  const segmentBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (items) => {
            const index = items[0]?.dataIndex ?? 0;
            const segment = segmentCompletions[index];
            if (!segment) return 'Trecho';
            return `${segment.name} (Trecho ${segment.id})`;
          },
          afterBody: (items) => {
            const index = items[0]?.dataIndex ?? 0;
            const segment = segmentCompletions[index];
            if (!segment) return '';
            const total = (segment.foot || 0) + (segment.bike || 0);
            return `Total: ${total}`;
          }
        }
      }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  const maleCount = pilgrimStats?.male || 0;
  const femaleCount = pilgrimStats?.female || 0;
  const totalPilgrims = displayKpiData?.totalUsers || 0;
  const fullPathCount = data?.completionStats?.fullPathCompletions || 0;

  const ageDonutData = {
    labels: ['Ate 29', '30-44', '45-59', '60+'],
    datasets: [
      {
        data: [
          pilgrimStats?.ageUnder30 || 0,
          pilgrimStats?.age30To44 || 0,
          pilgrimStats?.age45To59 || 0,
          pilgrimStats?.age60Plus || 0
        ],
        backgroundColor: ['#74b9ff', '#a29bfe', '#55efc4', '#ffeaa7'],
        borderWidth: 0
      }
    ]
  };

  const ageDonutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false } }
  };

  const insightsCoverage = useMemo(() => {
    const normalizeServices = (services) => {
      if (!services) return [];
      if (Array.isArray(services)) return services.map(item => String(item).trim()).filter(Boolean);
      if (typeof services === 'string') {
        return services.split(',').map(item => item.trim()).filter(Boolean);
      }
      if (typeof services === 'object') {
        return Object.keys(services).filter(key => services[key]);
      }
      return [];
    };

    const overallCategories = new Set(
      activeEstablishments.map(item => item.category).filter(Boolean)
    );
    const overallServices = new Set(
      activeEstablishments.flatMap(item => normalizeServices(item.services))
    );

    const attention = [];
    const adequate = [];
    const insufficient = [];

    trailParts.forEach(part => {
      const name = part.name || `Trecho ${part.id}`;
      const segmentEstablishments = activeEstablishments.filter(item => item.trailPartId === part.id);
      if (segmentEstablishments.length === 0) {
        attention.push(name);
        return;
      }

      const segmentCategories = new Set(segmentEstablishments.map(item => item.category).filter(Boolean));
      const segmentServices = new Set(
        segmentEstablishments.flatMap(item => normalizeServices(item.services))
      );
      const hasAllCategories = overallCategories.size === 0 || segmentCategories.size >= overallCategories.size;
      const hasAllServices = overallServices.size === 0 || segmentServices.size >= overallServices.size;

      if (hasAllCategories && hasAllServices) {
        adequate.push(name);
      } else {
        insufficient.push(name);
      }
    });

    const totalSegments = trailParts.length;
    const attentionCount = attention.length;
    const adequateCount = adequate.length;
    const insufficientCount = insufficient.length;
    const withEstablishmentsCount = Math.max(totalSegments - attentionCount, 0);
    const coveragePercent = totalSegments ? (withEstablishmentsCount / totalSegments) * 100 : 0;
    const adequatePercent = totalSegments ? (adequateCount / totalSegments) * 100 : 0;
    const insufficientPercent = totalSegments ? (insufficientCount / totalSegments) * 100 : 0;
    const attentionPercent = totalSegments ? (attentionCount / totalSegments) * 100 : 0;

    return {
      attention,
      adequate,
      insufficient,
      totalSegments,
      attentionCount,
      adequateCount,
      insufficientCount,
      withEstablishmentsCount,
      coveragePercent,
      adequatePercent,
      insufficientPercent,
      attentionPercent
    };
  }, [trailParts, activeEstablishments]);

  const insightsRegistrations = useMemo(() => {
    const monthTotals = Array.from({ length: 12 }, () => 0);
    const series = [];

    Object.entries(monthlyRegistrations || {}).forEach(([year, values]) => {
      (values || []).forEach((value, index) => {
        const total = Number(value) || 0;
        monthTotals[index] += total;
        series.push({ year: Number(year), month: index + 1, total });
      });
    });

    const orderedSeries = series
      .sort((a, b) => (a.year - b.year) || (a.month - b.month));

    const lowEntries = [...orderedSeries]
      .filter(item => item.total > 0)
      .sort((a, b) => a.total - b.total)
      .slice(0, 3);
    const lowMonths = lowEntries
      .map(item => `${monthLabels[item.month - 1]}/${item.year} (${item.total})`);

    const fallbackMonths = lowMonths.length
      ? lowMonths
      : monthTotals
        .map((total, index) => ({ total, index }))
        .sort((a, b) => a.total - b.total)
        .slice(0, 3)
        .map(item => `${monthLabels[item.index]} (${item.total})`);

    let trendMessage = 'Cadastros estáveis nos últimos meses.';

    const lastMonth = orderedSeries[orderedSeries.length - 1] || null;
    const lastMonthLabel = lastMonth
      ? `${monthLabels[lastMonth.month - 1]}/${lastMonth.year}`
      : 'Sem dados';

    const lastSix = orderedSeries.slice(-6);
    const lastThree = lastSix.slice(-3);
    const prevThree = lastSix.slice(0, 3);
    const lastThreeTotal = lastThree.reduce((sum, item) => sum + item.total, 0);
    const prevThreeTotal = prevThree.reduce((sum, item) => sum + item.total, 0);
    const trendPercent = prevThreeTotal > 0
      ? Math.round(((lastThreeTotal - prevThreeTotal) / prevThreeTotal) * 100)
      : null;

    if (trendPercent !== null) {
      if (trendPercent >= 20) {
        trendMessage = 'Crescimento relevante de cadastros no último trimestre.';
      } else if (trendPercent <= -20) {
        trendMessage = 'Queda relevante de cadastros no último trimestre. Reforçar campanhas.';
      }
    }

    const totalRegistrations = monthTotals.reduce((sum, total) => sum + total, 0);
    const monthsWithData = monthTotals.filter(total => total > 0).length;
    const averageMonthly = monthsWithData
      ? Math.round(totalRegistrations / monthsWithData)
      : 0;

    const bestMonthEntry = [...orderedSeries]
      .sort((a, b) => b.total - a.total)[0];
    const bestMonth = bestMonthEntry
      ? `${monthLabels[bestMonthEntry.month - 1]}/${bestMonthEntry.year}`
      : 'Sem dados';

    return {
      lowMonths: fallbackMonths,
      trendMessage,
      lastMonthLabel,
      lastMonthTotal: lastMonth?.total || 0,
      lastThreeTotal,
      prevThreeTotal,
      trendPercent,
      totalRegistrations,
      averageMonthly,
      bestMonth,
      bestMonthTotal: bestMonthEntry?.total || 0
    };
  }, [monthlyRegistrations]);

  const insightsTrails = useMemo(() => {
    const segments = segmentCompletions.map(segment => ({
      id: segment.id,
      name: segment.name || `Trecho ${segment.id}`,
      total: segment.total || 0
    }));

    const totalCompletions = segments.reduce((sum, item) => sum + item.total, 0);
    const withPercent = (items) => items.map(item => ({
      ...item,
      percent: totalCompletions ? Math.round((item.total / totalCompletions) * 100) : 0
    }));

    const topSegments = withPercent([...segments]
      .sort((a, b) => b.total - a.total)
      .slice(0, 3));
    const lowSegments = withPercent([...segments]
      .sort((a, b) => a.total - b.total)
      .slice(0, 3));

    const completionRate = displayKpiData?.completionRate || 0;
    const completedTrails = displayKpiData?.publishedTrails || 0;
    const fullPath = fullPathCount || 0;

    let completionMessage = 'Taxa de conclusão do caminho completo dentro do esperado.';
    if (completedTrails > 0 && completionRate < 50) {
      completionMessage = `Taxa de conclusão do caminho completo está baixa. Apenas ${completionRate}% (${fullPath} de ${completedTrails} percursos). É recomendável reforçar campanhas de incentivo e engajamento para que os peregrinos percorram o caminho completo.`;
    }

    return {
      topSegments,
      lowSegments,
      completionMessage,
      totalCompletions
    };
  }, [segmentCompletions, displayKpiData, fullPathCount]);

  const formatSegmentList = (segments) => {
    if (!segments || segments.length === 0) {
      return 'Nenhum';
    }
    return segments.join(', ');
  };

  const renderBulletList = (items) => {
    const safeItems = (items || []).filter(Boolean);
    if (safeItems.length === 0) {
      return (
        <ul className="insight-bullets">
          <li>Nenhum</li>
        </ul>
      );
    }
    return (
      <ul className="insight-bullets">
        {safeItems.map((item, index) => (
          <li key={`${index}-${item}`}>{item}</li>
        ))}
      </ul>
    );
  };

  const formatPercent = (value) => {
    if (!Number.isFinite(value)) return '0%';
    return `${Math.round(value)}%`;
  };

  const directionBarData = {
    labels: ['Direcao correta', 'Direcao inversa'],
    datasets: [
      {
        label: 'Peregrinos',
        data: [directionStats?.direct || 0, directionStats?.inverse || 0],
        backgroundColor: ['#2d9cdb', '#00b894'],
        borderRadius: 6,
        barThickness: 16,
        maxBarThickness: 18
      }
    ]
  };

  const directionBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x} Peregrinos`
        }
      }
    },
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } },
      y: { ticks: { display: false } }
    }
  };

  const modalityPieData = {
    labels: ['Caminhada', 'Bike'],
    datasets: [
      {
        data: [modalityStats?.foot || 0, modalityStats?.bike || 0],
        backgroundColor: ['#2d9cdb', '#6c5ce7'],
        borderWidth: 0
      }
    ]
  };

  const modalityPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout>
        {/* Debug Info - Para testes */}
        {error && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h3 style={{ marginTop: 0 }}>📊 Debug - Dados Carregados</h3>
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Expandir / Recolher</summary>
              <pre style={{ 
                backgroundColor: '#fff', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                
{`Dados Disponíveis:
${data ? '✅ Data Object' : '❌ Data Object'}
${data?.users ? '  ✅ Users' : '  ❌ Users'}
${data?.trails ? '  ✅ Trails' : '  ❌ Trails'}
${data?.activity ? '  ✅ Activity' : '  ❌ Activity'}
${data?.topTrails ? '  ✅ Top Trails' : '  ❌ Top Trails'}
${data?.completionRate ? '  ✅ Completion Rate' : '  ❌ Completion Rate'}
${data?.activeUsers ? '  ✅ Active Users' : '  ❌ Active Users'}



Erro: ${error || 'Nenhum erro'}`}
              </pre>
            </details>
          </div>
        )}

        {/* Mensagem de Erro */}
        {error && (
          <div className="error-message" style={{ marginBottom: '20px' }}>
            <p>⚠️ Erro ao carregar dados: {error}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Os gráficos e dados estão zerados até que o carregamento seja bem-sucedido.</p>
          </div>
        )}
      
      
      
      <div className="dashboard-grid">
        {/* KPI Cards */}
        <section className="kpi-section">
          <h2>Indicadores Gerenciais</h2>
          <div className="kpi-cards">
            <div className="kpi-card">
              <div className="kpi-icon">👥</div>
              <div className="kpi-content">
                <p className="kpi-label">Total de Peregrinos</p>
                <p className="kpi-value">{loading ? '-' : displayKpiData?.totalUsers || 0}</p>
                <p className="kpi-subtext">Usuários ativos</p>
                <p className="kpi-subtext">Masc.: {loading ? '-' : maleCount} | Fem.: {loading ? '-' : femaleCount}</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">✅</div>
              <div className="kpi-content">
                <p className="kpi-label">Taxa de conclusão do caminho</p>
                <p className="kpi-value">{loading ? '-' : `${displayKpiData?.completionRate || 0}%`}</p>
                <p className="kpi-subtext">{loading ? '-' : fullPathCount} caminhos completados</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">⏳</div>
              <div className="kpi-content">
                <p className="kpi-label">Percursos concluídos</p>
                <p className="kpi-value">{loading ? '-' : displayKpiData?.publishedTrails || 0}</p>
                <p className="kpi-subtext">Caminho completo ou parcial</p>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🏪</div>
              <div className="kpi-content">
                <p className="kpi-label">Percursos ativos</p>
                <p className="kpi-value">{loading ? '-' : displayKpiData?.activeUsers || 0}</p>
                <p className="kpi-subtext">Trilhas em andamento</p>
              </div>
            </div>
          </div>
          <div className="analysis-container kpi-analysis">
            <div className="analysis-card completion-card">
              <h3>Taxa de Conclusão por Trecho</h3>
              <div className="segment-chart-layout">
                <div className="chart-wrapper">
                  <Bar data={segmentBarData} options={segmentBarOptions} />
                </div>
                <div className="segment-legend">
                  <h4>ID - Trecho</h4>
                  {segmentCompletions.length === 0 && <p>Sem dados de trechos.</p>}
                  {segmentCompletions.map(segment => (
                    <div key={segment.id}>
                      {segment.id} - {segment.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="kpi-side">
              <div className="analysis-card direction-card">
                <h3>Sentido do percurso</h3>
                <div className="chart-bar">
                  <Bar data={directionBarData} options={directionBarOptions} />
                </div>
                <div className="direction-legend">
                  <div className="direction-legend-item">
                    <span className="direction-swatch" style={{ backgroundColor: '#2d9cdb' }} />
                    Direção Correta: Sentido Corumbá de Goiás -> Cidade de Goiás
                  </div>
                  <div className="direction-legend-item">
                    <span className="direction-swatch" style={{ backgroundColor: '#00b894' }} />
                    Direção Inversa: Sentido Cidade de Goiás -> Corumbá de Goiás
                  </div>
                </div>
              </div>
              <div className="analysis-card modality-card">
                <h3>Modalidade utilizada</h3>
                <div className="modality-layout">
                  <div className="chart-pie">
                    <Pie data={modalityPieData} options={modalityPieOptions} />
                  </div>
                  <div className="modality-legend">
                    <div className="modality-legend-item">
                      <span className="modality-swatch" style={{ backgroundColor: '#2d9cdb' }} /> Caminhada
                    </div>
                    <div className="modality-legend-item">
                      <span className="modality-swatch" style={{ backgroundColor: '#6c5ce7' }} /> Bike
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="controls controls-bottom" />
        </section>

        <section className="analysis-section">
          <h2>Gerenciamento de Peregrinos</h2>
          <div className="analysis-container pilgrims-grid">
            <div className="analysis-card pilgrims-main">
              <div className="analysis-card-header">
                <h3>Taxa Mensal de Cadastros</h3>
                <div className="year-toggles">
                  {registrationYears.length === 0 && <span className="year-empty">Sem dados</span>}
                  {registrationYears.map(year => (
                    <label
                      key={year}
                      className={`year-toggle ${isYearVisible(year) ? '' : 'inactive'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isYearVisible(year)}
                        onChange={() => toggleYear(year)}
                      />
                      <span className="year-swatch" style={{ backgroundColor: registrationColors[year] }} />
                      <span>{year}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="chart-wrapper">
                <Line data={registrationLineData} options={registrationLineOptions} />
              </div>
            </div>
            <div className="analysis-card pilgrims-side">
              <h3>Faixa etária dos peregrinos</h3>
              <div className="age-card-layout">
                <div className="chart-doughnut">
                  <Doughnut data={ageDonutData} options={ageDonutOptions} />
                  <div className="chart-center">
                    <span>Total</span>
                    <strong>{loading ? '-' : totalPilgrims}</strong>
                  </div>
                </div>
                <div className="age-legend">
                  <div className="age-legend-item">
                    <span className="age-swatch" style={{ backgroundColor: '#74b9ff' }} /> Até 29
                  </div>
                  <div className="age-legend-item">
                    <span className="age-swatch" style={{ backgroundColor: '#a29bfe' }} /> 30-44
                  </div>
                  <div className="age-legend-item">
                    <span className="age-swatch" style={{ backgroundColor: '#55efc4' }} /> 45-59
                  </div>
                  <div className="age-legend-item">
                    <span className="age-swatch" style={{ backgroundColor: '#ffeaa7' }} /> 60+
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="controls controls-bottom" />
        </section>

        {/* Tabelas de Gestão */}
        <section className="table-section">
          <h2>Gerenciamento de Comerciantes</h2>
          <div className="analysis-card span-full merchant-map-card">
            <h3>Mapa de Estabelecimentos</h3>
            <div className="map-card">
              <TrailMap
                kmlUrl="http://localhost:1337/maps/caminho-cora.kml"
                completedCount={activeSegmentsWithEstablishments.size}
                totalCount={trailParts.length}
                segmentNames={mapSegments.segmentNames}
                segmentStatus={mapSegments.segmentStatus}
                segmentTooltips={mapSegments.segmentTooltips}
                checkpoints={checkpointMarkers}
                markers={establishmentMarkers}
              />
            </div>
          </div>
          <h3 className="table-subtitle">Estabelecimentos cadastrados</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <button className="sort-button" type="button" onClick={() => handleSort('name')}>
                      Estabelecimento
                      <span className="sort-indicator">{sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                    </button>
                  </th>
                  <th>
                    <button className="sort-button" type="button" onClick={() => handleSort('email')}>
                      Email
                      <span className="sort-indicator">{sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                    </button>
                  </th>
                  <th>
                    <button className="sort-button" type="button" onClick={() => handleSort('phone')}>
                      Telefone
                      <span className="sort-indicator">{sortConfig.key === 'phone' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                    </button>
                  </th>
                  <th>
                    <button className="sort-button" type="button" onClick={() => handleSort('owner')}>
                      Dono
                      <span className="sort-indicator">{sortConfig.key === 'owner' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                    </button>
                  </th>
                  <th>
                    <button className="sort-button" type="button" onClick={() => handleSort('status')}>
                      Status
                      <span className="sort-indicator">{sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span>
                    </button>
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orderedEstablishments.length === 0 && (
                  <tr>
                    <td colSpan={6}>Nenhum estabelecimento encontrado.</td>
                  </tr>
                )}
                {orderedEstablishments.map(establishment => {
                  const status = getStatus(establishment);
                  const isInactive = establishment.isActive === false;
                  return (
                    <tr key={establishment.id}>
                      <td>{establishment.name || '-'}</td>
                      <td>{establishment.email || '-'}</td>
                      <td>{establishment.phone || '-'}</td>
                      <td>{establishment.ownerName || '-'}</td>
                      <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                      <td>
                        <div className="action-group">
                          <button
                            className="action-btn icon"
                            type="button"
                            onClick={() => startEdit(establishment)}
                            aria-label="Editar"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn icon"
                            type="button"
                            onClick={() => startView(establishment)}
                            aria-label="Visualizar"
                            title="Visualizar"
                          >
                            👁️
                          </button>
                          {isInactive ? (
                            <button
                              className="action-btn icon"
                              type="button"
                              onClick={() => handleReactivate(establishment)}
                              aria-label="Reativar"
                              title="Reativar"
                            >
                              🔄
                            </button>
                          ) : (
                            <button
                              className="action-btn icon"
                              type="button"
                              onClick={() => handleDeactivate(establishment)}
                              aria-label="Inativar"
                              title="Inativar"
                            >
                              ⏻
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="controls controls-bottom">
            <button className="btn btn-secondary" type="button" onClick={startCreate}>+ Novo Estabelecimento</button>
          </div>
          {showForm && (
            <section className="manager-form-section">
              <h2>
                {formMode === 'view'
                  ? 'Visualizar estabelecimento'
                  : (editingId ? 'Editar estabelecimento' : 'Cadastrar novo estabelecimento')}
              </h2>
              <form className="manager-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="manager-owner">Dono</label>
                    <select
                      id="manager-owner"
                      value={formState.ownerId}
                      onChange={(event) => handleFieldChange('ownerId', event.target.value)}
                      disabled={formMode === 'view' || formStatus.loading}
                      required
                    >
                      <option value="">Selecione</option>
                      {merchants.map(merchant => (
                        <option key={merchant.id} value={merchant.id}>
                          {merchant.username || merchant.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="manager-name">Nome</label>
                    <input
                      id="manager-name"
                      type="text"
                      value={formState.name}
                      onChange={(event) => handleFieldChange('name', event.target.value)}
                      disabled={formMode === 'view' || formStatus.loading}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="manager-category">Categoria</label>
                    <input
                      id="manager-category"
                      type="text"
                      value={formState.category}
                      onChange={(event) => handleFieldChange('category', event.target.value)}
                      disabled={formMode === 'view' || formStatus.loading}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="manager-address">Endereço</label>
                    <input
                      id="manager-address"
                      type="text"
                      value={formState.address}
                      onChange={(event) => handleFieldChange('address', event.target.value)}
                      disabled={formMode === 'view' || formStatus.loading}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="manager-email">Email</label>
                    <input
                      id="manager-email"
                      type="email"
                      value={formState.email}
                      onChange={(event) => handleFieldChange('email', event.target.value)}
                      disabled={formMode === 'view' || formStatus.loading}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="manager-phone">Telefone</label>
                    <input
                      id="manager-phone"
                      type="text"
                      value={formState.phone}
                      onChange={(event) => handleFieldChange('phone', event.target.value)}
                      disabled={formMode === 'view' || formStatus.loading}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="manager-hours">Horario de funcionamento</label>
                    <input
                      id="manager-hours"
                      type="text"
                      value={formState.openingHours}
                      onChange={(event) => handleFieldChange('openingHours', event.target.value)}
                      disabled={formMode === 'view' || formStatus.loading}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="manager-x">Coordenada X (UTM)</label>
                    <input
                      id="manager-x"
                      type="number"
                      value={formState.locationX}
                      onChange={(event) => handleFieldChange('locationX', event.target.value)}
                      disabled={formMode === 'view' || formStatus.loading}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="manager-y">Coordenada Y (UTM)</label>
                    <input
                      id="manager-y"
                      type="number"
                      value={formState.locationY}
                      onChange={(event) => handleFieldChange('locationY', event.target.value)}
                      disabled={formMode === 'view' || formStatus.loading}
                      required
                    />
                  </div>
                  <div className="form-field full">
                    <label htmlFor="manager-description">Descrição</label>
                    <textarea
                      id="manager-description"
                      rows="3"
                      value={formState.description}
                      onChange={(event) => handleFieldChange('description', event.target.value)}
                      disabled={formMode === 'view' || formStatus.loading}
                    />
                  </div>
                </div>
                {formStatus.error && <p className="form-message error">{formStatus.error}</p>}
                <div className="form-actions">
                  {formMode !== 'view' && (
                    <button className="btn btn-primary" type="submit" disabled={formStatus.loading}>
                      {editingId ? 'Salvar alterações' : 'Cadastrar estabelecimento'}
                    </button>
                  )}
                  <button className="btn btn-secondary" type="button" onClick={resetForm}>
                    {formMode === 'view' ? 'Fechar' : 'Cancelar'}
                  </button>
                </div>
              </form>
            </section>
          )}
          <h3 className="table-subtitle merchants-title">Comerciantes cadastrados</h3>
          <div className="table-container merchants-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <button className="sort-button" type="button" onClick={() => handleMerchantSort('name')}>
                      Nome
                      <span className="sort-indicator">
                        {merchantSortConfig.key === 'name'
                          ? (merchantSortConfig.direction === 'asc' ? '▲' : '▼')
                          : ''}
                      </span>
                    </button>
                  </th>
                  <th>
                    <button className="sort-button" type="button" onClick={() => handleMerchantSort('email')}>
                      Email
                      <span className="sort-indicator">
                        {merchantSortConfig.key === 'email'
                          ? (merchantSortConfig.direction === 'asc' ? '▲' : '▼')
                          : ''}
                      </span>
                    </button>
                  </th>
                  <th>
                    <button className="sort-button" type="button" onClick={() => handleMerchantSort('status')}>
                      Status
                      <span className="sort-indicator">
                        {merchantSortConfig.key === 'status'
                          ? (merchantSortConfig.direction === 'asc' ? '▲' : '▼')
                          : ''}
                      </span>
                    </button>
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orderedMerchants.length === 0 && (
                  <tr>
                    <td colSpan={4}>Nenhum comerciante encontrado.</td>
                  </tr>
                )}
                {orderedMerchants.map(merchant => {
                  const status = getMerchantStatus(merchant.merchantApproved);
                  const isApproved = merchant.merchantApproved === true;
                  const isRejected = merchant.merchantApproved === false;
                  const name = merchant.name || merchant.username || '-';
                  return (
                    <tr key={merchant.id}>
                      <td>{name}</td>
                      <td>{merchant.email || '-'}</td>
                      <td>
                        <span className={`badge ${status.className}`}>{status.label}</span>
                      </td>
                      <td>
                        <div className="action-group">
                          <button
                            className="action-btn action-view"
                            type="button"
                            onClick={() => openMerchantView(merchant)}
                          >
                            Visualizar
                          </button>
                          <button
                            className="action-btn action-approve"
                            type="button"
                            onClick={() => handleMerchantApprove(merchant)}
                            disabled={merchantActionStatus.loading || isApproved}
                          >
                            Aprovar
                          </button>
                          <button
                            className="action-btn action-reject"
                            type="button"
                            onClick={() => openMerchantReject(merchant)}
                            disabled={isRejected}
                          >
                            Rejeitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="controls controls-bottom">
            <button className="btn btn-secondary" type="button" onClick={openMerchantCreate}>+ Novo Comerciante</button>
          </div>
          {merchantAction.mode === 'create' && (
            <div className="merchant-action-card">
              <div className="merchant-action-header">
                <h4>Novo comerciante</h4>
                <button className="action-btn" type="button" onClick={closeMerchantAction}>Fechar</button>
              </div>
              <form className="merchant-profile-card" onSubmit={handleMerchantCreateSubmit}>
                <div className="merchant-profile-avatar">
                  <div className="merchant-avatar-placeholder">
                    {(merchantDraft.name || merchantDraft.nickname || 'NC')
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map(part => part[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                </div>
                <div className="merchant-profile-form">
                  <div className="merchant-form-row full">
                    <div className="merchant-form-group full">
                      <label>Nome completo</label>
                      <input
                        type="text"
                        value={merchantDraft.name}
                        onChange={(event) => handleMerchantDraftChange('name', event.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="merchant-form-row">
                    <div className="merchant-form-group">
                      <label>Nickname</label>
                      <input
                        type="text"
                        value={merchantDraft.nickname}
                        onChange={(event) => handleMerchantDraftChange('nickname', event.target.value)}
                      />
                    </div>
                    <div className="merchant-form-group">
                      <label>E-Mail</label>
                      <input
                        type="email"
                        value={merchantDraft.email}
                        onChange={(event) => handleMerchantDraftChange('email', event.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="merchant-form-row">
                    <div className="merchant-form-group">
                      <label>Data de Nascimento</label>
                      <input
                        type="date"
                        value={merchantDraft.birthdate}
                        onChange={(event) => handleMerchantDraftChange('birthdate', event.target.value)}
                      />
                    </div>
                    <div className="merchant-form-group">
                      <label>Sexo</label>
                      <select
                        value={merchantDraft.sex}
                        onChange={(event) => handleMerchantDraftChange('sex', event.target.value)}
                      >
                        <option value="">Selecione</option>
                        <option value="Female">Feminino</option>
                        <option value="Male">Masculino</option>
                      </select>
                    </div>
                  </div>
                  {merchantActionStatus.error && (
                    <p className="form-message error">{merchantActionStatus.error}</p>
                  )}
                  {merchantActionStatus.success && (
                    <p className="form-message success">{merchantActionStatus.success}</p>
                  )}
                  <div className="form-actions">
                    <button className="btn btn-primary" type="submit" disabled={merchantActionStatus.loading}>
                      Salvar
                    </button>
                    <button className="btn btn-secondary" type="button" onClick={closeMerchantAction}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {merchantAction.mode === 'view' && merchantAction.merchant && (
            <div className="merchant-action-card">
              <div className="merchant-action-header">
                <h4>Dados do comerciante</h4>
                <button className="action-btn" type="button" onClick={closeMerchantAction}>Fechar</button>
              </div>
              <div className="merchant-profile-card">
                <div className="merchant-profile-avatar">
                  <div className="merchant-avatar-placeholder">
                    {(merchantAction.merchant.name || merchantAction.merchant.username || 'US')
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map(part => part[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                </div>
                <div className="merchant-profile-form">
                  <div className="merchant-form-row full">
                    <div className="merchant-form-group full">
                      <label>Nome completo</label>
                      <input
                        type="text"
                        value={merchantAction.merchant.name || merchantAction.merchant.username || '-'}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="merchant-form-row">
                    <div className="merchant-form-group">
                      <label>Nickname</label>
                      <input
                        type="text"
                        value={merchantAction.merchant.nickname || '-'}
                        disabled
                      />
                    </div>
                    <div className="merchant-form-group">
                      <label>E-Mail</label>
                      <input
                        type="text"
                        value={merchantAction.merchant.email || '-'}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="merchant-form-row">
                    <div className="merchant-form-group">
                      <label>Data de Nascimento</label>
                      <input
                        type="text"
                        value={formatBirthdate(merchantAction.merchant.birthdate) || '-'}
                        disabled
                      />
                    </div>
                    <div className="merchant-form-group">
                      <label>Sexo</label>
                      <input
                        type="text"
                        value={formatSexLabel(merchantAction.merchant.sex)}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="merchant-form-row">
                    <div className="merchant-form-group">
                      <label>Tipo de Usuario</label>
                      <input
                        type="text"
                        value={formatUserTypeLabel(merchantAction.merchant.userType)}
                        disabled
                      />
                    </div>
                    <div className="merchant-form-group">
                      <label>Status</label>
                      <input
                        type="text"
                        value={getMerchantStatus(merchantAction.merchant.merchantApproved).label}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {merchantAction.mode === 'reject' && merchantAction.merchant && (
            <div className="merchant-action-card">
              <div className="merchant-action-header">
                <h4>Rejeitar comerciante</h4>
                <button className="action-btn" type="button" onClick={closeMerchantAction}>Fechar</button>
              </div>
              <form className="merchant-action-form" onSubmit={handleMerchantRejectSubmit}>
                <div className="merchant-action-grid">
                  <div>
                    <span className="merchant-action-label">Nome</span>
                    <span className="merchant-action-value">
                      {merchantAction.merchant.name || merchantAction.merchant.username || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="merchant-action-label">Email</span>
                    <span className="merchant-action-value">
                      {merchantAction.merchant.email || '-'}
                    </span>
                  </div>
                </div>
                <div className="merchant-action-field merchant-action-field-spaced">
                  <label htmlFor="merchant-reject-reason">Justificativa da rejeição</label>
                  <textarea
                    id="merchant-reject-reason"
                    rows="3"
                    value={merchantAction.reason}
                    onChange={(event) =>
                      setMerchantAction(prev => ({ ...prev, reason: event.target.value }))
                    }
                  />
                </div>
                {merchantActionStatus.error && (
                  <p className="form-message error">{merchantActionStatus.error}</p>
                )}
                <div className="form-actions">
                  <button className="btn btn-primary" type="submit" disabled={merchantActionStatus.loading}>
                    Confirmar rejeicao
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={closeMerchantAction}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        {rejectionState.show && (
          <section className="rejection-section">
            <h2>Justificativa da rejeição</h2>
            <form className="rejection-form" onSubmit={handleRejectSubmit}>
              <div className="rejection-summary">
                <div className="rejection-item">
                  <span className="rejection-label">Nome</span>
                  {rejectionState.establishment?.name || '-'}
                </div>
                <div className="rejection-item">
                  <span className="rejection-label">Email</span>
                  {rejectionState.establishment?.email || '-'}
                </div>
                <div className="rejection-item">
                  <span className="rejection-label">Telefone</span>
                  {rejectionState.establishment?.phone || '-'}
                </div>
                <div className="rejection-item">
                  <span className="rejection-label">Dono</span>
                  {rejectionState.establishment?.ownerName || '-'}
                </div>
              </div>
              <textarea
                rows="3"
                value={rejectionState.reason}
                onChange={(event) => setRejectionState(prev => ({ ...prev, reason: event.target.value }))}
                placeholder="Descreva o motivo da rejeição"
              />
              {formStatus.error && <p className="form-message error">{formStatus.error}</p>}
              {formStatus.success && <p className="form-message success">{formStatus.success}</p>}
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={formStatus.loading}>
                  Confirmar rejeição
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setRejectionState({ show: false, id: null, reason: '', establishment: null })}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {successModal.open && (
          <div className="success-modal-overlay" role="dialog" aria-modal="true">
            <div className="success-modal">
              <div className="success-modal-icon">✅</div>
              <h3>Estabelecimento salvo</h3>
              <p>{successModal.message}</p>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setSuccessModal({ open: false, message: '' })}
              >
                OK
              </button>
            </div>
          </div>
        )}

        <section className="insights-section">
          <h2>Insights</h2>
          <div className="insights-grid">
            <div className="analysis-card insights-card">
              <div className="insights-header">
                <div>
                  <h3>Estabelecimentos por trecho</h3>
                  <p className="insights-subtitle">Cobertura total e variedade de serviços em cada trecho.</p>
                </div>
                <span className="insights-badge info">
                  {formatPercent(insightsCoverage.coveragePercent)} cobertura
                </span>
              </div>
              <div className="insights-coverage-grid">
                <div className="insights-coverage-col">
                  <div className="insight-stat good">
                    <span><strong>Cobertura adequada</strong></span>
                    <small className="insight-note">Os estabelecimentos cadastrados proporcionam cobertura completa de categorias e serviços.</small>
                    <strong>{formatPercent(insightsCoverage.adequatePercent)}</strong>
                    <small>{insightsCoverage.adequateCount} de {insightsCoverage.totalSegments} trechos</small>
                  </div>
                  <div className="insight-block good">
                    <h4>Cobertura adequada</h4>
                    {renderBulletList(insightsCoverage.adequate)}
                  </div>
                </div>
                <div className="insights-coverage-col">
                  <div className="insight-stat warn">
                    <span><strong>Cobertura insuficiente</strong></span>
                    <small className="insight-note">Tem estabelecimentos cadastrados, mas faltam categorias ou serviços.</small>
                    <strong>{formatPercent(insightsCoverage.insufficientPercent)}</strong>
                    <small>{insightsCoverage.insufficientCount} de {insightsCoverage.totalSegments} trechos</small>
                  </div>
                  <div className="insight-block warn">
                    <h4>Cobertura insuficiente</h4>
                    {renderBulletList(insightsCoverage.insufficient)}
                  </div>
                </div>
                <div className="insights-coverage-col">
                  <div className="insight-stat alert">
                    <span><strong>Requer atenção</strong></span>
                    <small className="insight-note">Não possui estabelecimentos cadastrados ou estão aguardando aprovação.</small>
                    <strong>{formatPercent(insightsCoverage.attentionPercent)}</strong>
                    <small>{insightsCoverage.attentionCount} de {insightsCoverage.totalSegments} trechos</small>
                  </div>
                  <div className="insight-block alert">
                    <h4>Requer atenção</h4>
                    {renderBulletList(insightsCoverage.attention)}
                  </div>
                </div>
              </div>
            </div>

            <div className="analysis-card insights-card">
              <div className="insights-header">
                <div>
                  <h3>Cadastro de novos peregrinos</h3>
                  <p className="insights-subtitle">Ritmo recente, sazonalidade e variação trimestral.</p>
                </div>
                <span className={`insights-badge ${insightsRegistrations.trendPercent > 0 ? 'good' : insightsRegistrations.trendPercent < 0 ? 'alert' : 'info'}`}>
                  {insightsRegistrations.trendPercent === null
                    ? 'Sem base'
                    : `${insightsRegistrations.trendPercent > 0 ? '+' : ''}${insightsRegistrations.trendPercent}%`}
                </span>
              </div>
              <div className="insights-coverage-grid">
                <div className="insights-coverage-col">
                  <div className="insight-stat info">
                    <span><strong>Último mês</strong></span>
                    <small className="insight-note">Cadastros no último mês registrado.</small>
                    <strong>{insightsRegistrations.lastMonthTotal}</strong>
                    <small>{insightsRegistrations.lastMonthLabel}</small>
                  </div>
                  <div className="insight-block info">
                    <h4>Resumo do último mês</h4>
                    {renderBulletList([
                      `Período: ${insightsRegistrations.lastMonthLabel}`,
                      `Cadastros: ${insightsRegistrations.lastMonthTotal}`,
                      `Média mensal: ${insightsRegistrations.averageMonthly}`
                    ])}
                  </div>
                </div>
                <div className="insights-coverage-col">
                  <div className="insight-stat good">
                    <span><strong>Últimos 3 meses</strong></span>
                    <small className="insight-note">Comparação com o trimestre anterior.</small>
                    <strong>{insightsRegistrations.lastThreeTotal}</strong>
                    <small>Anterior: {insightsRegistrations.prevThreeTotal}</small>
                  </div>
                  <div className="insight-block good">
                    <h4>Tendência trimestral</h4>
                    {renderBulletList([
                      `Variação: ${insightsRegistrations.trendPercent === null ? 'Sem base' : `${insightsRegistrations.trendPercent > 0 ? '+' : ''}${insightsRegistrations.trendPercent}%`}`,
                      `Alerta: ${insightsRegistrations.trendMessage}`
                    ])}
                  </div>
                </div>
                <div className="insights-coverage-col">
                  <div className="insight-stat warn">
                    <span><strong>Média mensal</strong></span>
                    <small className="insight-note">Média considerando meses com dados.</small>
                    <strong>{insightsRegistrations.averageMonthly}</strong>
                    <small>Total: {insightsRegistrations.totalRegistrations}</small>
                  </div>
                  <div className="insight-block warn">
                    <h4>Sazonalidade</h4>
                    {renderBulletList([
                      `Meses com menos cadastros: ${insightsRegistrations.lowMonths.join(', ') || 'Sem dados suficientes'}`,
                      `Melhor mês: ${insightsRegistrations.bestMonth} (${insightsRegistrations.bestMonthTotal})`
                    ])}
                  </div>
                </div>
              </div>
            </div>

            <div className="analysis-card insights-card">
              <div className="insights-header">
                <div>
                  <h3>Trechos do caminho</h3>
                  <p className="insights-subtitle">Aderência por trecho e conclusão do caminho completo.</p>
                </div>
                <span className="insights-badge info">{insightsTrails.totalCompletions} check-ins</span>
              </div>
              <div className="insights-metrics">
                <div className="insight-stat good">
                  <span><strong>Conclusão completa</strong></span>
                  <small className="insight-note">Conclusão dos 13 trechos do caminho no mesmo percurso</small>
                  <strong>{displayKpiData?.completionRate || 0}%</strong>
                  <small>{fullPathCount} de {displayKpiData?.publishedTrails || 0} percursos concluídos</small>
                </div>
                <div className="insight-stat info">
                  <span><strong>Trechos percorridos</strong></span>
                  <small className="insight-note">Quantidade de trechos percorridos por peregrinos</small>
                  <strong>{insightsTrails.totalCompletions}</strong>
                  <small>{displayKpiData?.publishedTrails || 0} percursos concluídos</small>
                </div>
                <div className="insight-stat warn">
                  <span><strong>Atenção!</strong></span>
                  <small>{insightsTrails.completionMessage}</small>
                </div>
              </div>
              <div className="insights-detail">
                <div className="insight-block good">
                  <h4>Trechos com Maior adesão</h4>
                  {renderBulletList(insightsTrails.topSegments.map(item => `${item.name} (${item.total}, ${item.percent}%)`))}
                </div>
                <div className="insight-block alert">
                  <h4>Trechos com Menor adesão</h4>
                  {renderBulletList(insightsTrails.lowSegments.map(item => `${item.name} (${item.total}, ${item.percent}%)`))}
                </div>
              </div>
            </div>
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
