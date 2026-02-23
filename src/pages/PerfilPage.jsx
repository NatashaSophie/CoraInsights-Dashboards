import React, { useState, useEffect } from 'react';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import './PerfilPage.css';

const API_URL = 'http://localhost:1337';

export function PerfilPage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileStatus, setProfileStatus] = useState({ error: '', success: '' });
  const [editedData, setEditedData] = useState({
    name: '',
    nickname: '',
    email: '',
    birthdate: '',
    sex: '',
    blocked: false
  });
  const [userRoles, setUserRoles] = useState(['pilgrim']);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState({ error: '', success: '' });
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const [privacyStatus, setPrivacyStatus] = useState({ suspended: false, message: '' });
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyModalMode, setPrivacyModalMode] = useState('revoke');
  const [isPolicyExpanded, setIsPolicyExpanded] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  const roleFromUserType = (userTypeValue) => {
    if (!userTypeValue) return 'pilgrim';
    if (typeof userTypeValue === 'number') {
      if (userTypeValue === 2) return 'manager';
      if (userTypeValue === 3) return 'merchant';
      return 'pilgrim';
    }
    const raw = String(userTypeValue).toLowerCase();
    if (raw.includes('manager') || raw.includes('gestor')) return 'manager';
    if (raw.includes('merchant') || raw.includes('comerciante')) return 'merchant';
    return 'pilgrim';
  };

  const getTokenUserId = (jwt) => {
    if (!jwt) return null;
    const parts = String(jwt).split('.');
    if (parts.length !== 3) return null;
    try {
      const payload = JSON.parse(atob(parts[1]));
      return payload?.id ? Number(payload.id) : null;
    } catch (error) {
      return null;
    }
  };

  const isMerchant = userRoles.includes('merchant');

  useEffect(() => {
    if (!user) return;

    const normalizeSex = (value) => {
      const raw = String(value || '').trim().toLowerCase();
      if (!raw) return '';
      if (raw === 'female' || raw === 'feminino' || raw === 'f') return 'female';
      if (raw === 'male' || raw === 'masculino' || raw === 'm') return 'male';
      if (raw === 'other' || raw === 'outro') return 'other';
      if (raw === 'prefer_not' || raw === 'prefiro nao informar' || raw === 'prefiro não informar') {
        return 'prefer_not';
      }
      return raw;
    };

    const applyProfile = (profile) => {
      setEditedData(prev => ({
        ...prev,
        name: profile.name || prev.name || '',
        nickname: profile.nickname || prev.nickname || '',
        email: profile.email || prev.email || '',
        birthdate: profile.birthdate || prev.birthdate || '',
        sex: normalizeSex(profile.sex || prev.sex || ''),
        blocked: Boolean(profile.blocked)
      }));

      if (profile.blocked) {
        setPrivacyAccepted(false);
        setPrivacyStatus({ suspended: true, message: 'Conta suspensa por nao aceitar a politica de privacidade.' });
        setPrivacyModalMode('suspended');
        setShowPrivacyModal(true);
      } else {
        setPrivacyAccepted(true);
      }
    };

    const userRole = roleFromUserType(user.userType);
    const rolesFromUser = userRole === 'manager'
      ? ['pilgrim', 'manager']
      : (userRole === 'merchant' ? ['pilgrim', 'merchant'] : ['pilgrim']);

    applyProfile(user);
    setUserRoles(rolesFromUser);

    const token = user?.jwt || localStorage.getItem('jwt');
    if (!token) return;

    const fetchProfile = async () => {
      setProfileLoading(true);
      setProfileError('');
      try {
        const profileUrl = `${API_URL}/dashboards/auth/me?token=${encodeURIComponent(token)}`;
        const response = await fetch(profileUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Nao foi possivel carregar os dados do usuario.');
        }

        const profile = await response.json();
        const profileId = profile?.id ? Number(profile.id) : null;
        const userId = user?.id ? Number(user.id) : null;
        const tokenUserId = getTokenUserId(token);
        const expectedId = tokenUserId || userId || null;
        if (expectedId && profileId && profileId !== expectedId) {
          setProfileError('Dados do perfil nao conferem com o usuario logado.');
          return;
        }
        applyProfile(profile);
        setProfileError('');
        const resolvedRole = roleFromUserType(profile.userType || user.userType);
        const roles = resolvedRole === 'manager'
          ? ['pilgrim', 'manager']
          : (resolvedRole === 'merchant' ? ['pilgrim', 'merchant'] : ['pilgrim']);
        setUserRoles(roles);
      } catch (error) {
        if (!user?.name && !user?.email && !user?.nickname) {
          setProfileError(error.message || 'Erro ao carregar dados do usuario.');
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setProfileStatus({ error: '', success: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }
    setProfileStatus({ error: '', success: 'Clique detectado. Salvando...' });
    const token = user?.jwt || localStorage.getItem('jwt');
    const userId = user?.id || getTokenUserId(token);

    if (!token || !userId) {
      setProfileStatus({ error: 'Token ou usuario nao identificado.', success: '' });
      return;
    }

    setProfileSaving(true);
    setProfileStatus({ error: '', success: 'Salvando...' });

    const payload = {
      name: editedData.name || null,
      nickname: editedData.nickname || null,
      email: editedData.email || null,
      birthdate: editedData.birthdate || null,
      sex: editedData.sex || null
    };

    try {
      const response = await fetch(`${API_URL}/dashboards/auth/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Falha ao salvar dados do perfil.');
      }

      const updated = await response.json();
      updateUser({
        name: updated.name,
        nickname: updated.nickname,
        email: updated.email,
        birthdate: updated.birthdate,
        sex: updated.sex
      });

      setProfileStatus({ error: '', success: 'Perfil atualizado com sucesso.' });
      setIsEditing(false);
    } catch (error) {
      setProfileStatus({ error: error.message || 'Erro ao salvar perfil.', success: '' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleRoleToggle = (role) => {
    if (role === 'pilgrim' || role === 'manager') return;

    setUserRoles(prev => {
      const exists = prev.includes(role);
      if (exists) {
        return prev.filter(item => item !== role);
      }
      return [...prev, role];
    });
  };

  const handlePasswordToggle = () => {
    setShowPasswordForm(prev => !prev);
    setPasswordStatus({ error: '', success: '' });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setPasswordStatus({ error: '', success: '' });

    if (!passwordData.currentPassword) {
      setPasswordStatus({ error: 'Informe a senha atual.', success: '' });
      return;
    }
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordStatus({ error: 'Informe e confirme a nova senha.', success: '' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ error: 'As novas senhas não conferem.', success: '' });
      return;
    }

    // TODO: Validar senha atual no backend e salvar nova senha (PARA IMPLEMENTAÇÃO FUTURA)
    // Campos envolvidos em Strapi: password (hash), resetPasswordToken e confirmationToken.
    setPasswordStatus({
      error: '',
      success: 'Dados validados. Implementação da alteração de senha no backend pendente.'
    });
  };

  const handlePrivacyToggle = (event) => {
    const nextChecked = event.target.checked;
    if (!nextChecked) {
      setPrivacyModalMode('revoke');
      setShowPrivacyModal(true);
      return;
    }

    setPrivacyAccepted(true);
    if (privacyStatus.suspended) {
      // TODO: Reativar conta no backend quando o usuário aceitar novamente (PARA IMPLEMENTAÇÃO FUTURA)
      setPrivacyStatus({ suspended: false, message: 'Conta reativada apos aceitar a politica.' });
      setEditedData(prev => ({ ...prev, blocked: false }));
    } else {
      setPrivacyStatus({ suspended: false, message: '' });
      setEditedData(prev => ({ ...prev, blocked: false }));
    }
  };

  const confirmPrivacyRevoke = () => {
    setShowPrivacyModal(false);
    setPrivacyAccepted(false);
    // TODO: Suspender conta no backend (PARA IMPLEMENTAÇÃO FUTURA)
    setPrivacyStatus({
      suspended: true,
      message: 'Conta suspensa por nao aceitar a politica de privacidade.'
    });
    setEditedData(prev => ({ ...prev, blocked: true }));
  };

  const cancelPrivacyRevoke = () => {
    setShowPrivacyModal(false);
    setPrivacyAccepted(true);
  };

  const keepPrivacySuspended = () => {
    setShowPrivacyModal(false);
    setPrivacyAccepted(false);
  };

  const confirmPrivacyReactivate = () => {
    setShowPrivacyModal(false);
    setPrivacyAccepted(true);
    // TODO: Reativar conta no backend quando o usuário aceitar novamente (PARA IMPLEMENTAÇÃO FUTURA)
    setPrivacyStatus({ suspended: false, message: 'Conta reativada apos aceitar a politica.' });
    setEditedData(prev => ({ ...prev, blocked: false }));
  };

  const renderPrivacyPolicy = () => (
    <>
      <h4>Política de Privacidade</h4>
      <p>
        A sua privacidade é uma prioridade para nós. Esta Política de Privacidade tem como
        objetivo esclarecer como os seus dados são coletados, utilizados, armazenados e
        protegidos em nosso aplicativo e site de trilhas ecológicas de longo curso.
      </p>
      <h5>1. Compromisso com a LGPD</h5>
      <p>
        O tratamento de dados pessoais é realizado em conformidade com a Lei nº 13.709/2018
        - Lei Geral de Proteção de Dados Pessoais (LGPD). Adotamos medidas técnicas e
        administrativas adequadas para garantir a segurança, integridade e confidencialidade
        das informações fornecidas pelos usuários.
      </p>
      <h5>2. Dados Coletados</h5>
      <p>Durante o uso da plataforma, poderão ser coletados dados como:</p>
      <ul>
        <li>Nome completo</li>
        <li>E-mail</li>
        <li>Informações de contato</li>
        <li>Dados de localização relacionados às trilhas</li>
        <li>Informações de desempenho (distâncias percorridas, tempo de caminhada, etapas concluídas e evolução na trilha)</li>
      </ul>
      <p>
        Os dados sensíveis eventualmente informados pelo usuário serão tratados com nível elevado
        de proteção e nunca serão divulgados publicamente.
      </p>
      <h5>3. Dados Tornados Públicos</h5>
      <p>
        Para fins de interação social, ranking e acompanhamento de desempenho na comunidade de
        trilheiros, poderão ser exibidas publicamente apenas as seguintes informações:
      </p>
      <ul>
        <li>Nickname (nome de usuário escolhido livremente pelo próprio usuário)</li>
        <li>Sexo</li>
        <li>Idade</li>
        <li>Informações de performance nas trilhas</li>
      </ul>
      <p>Nenhuma outra informação pessoal será divulgada publicamente.</p>
      <h5>4. Finalidade do Uso dos Dados</h5>
      <p>Os dados coletados são utilizados exclusivamente para:</p>
      <ul>
        <li>Permitir o funcionamento adequado da plataforma</li>
        <li>Registrar e acompanhar a evolução do usuário nas trilhas</li>
        <li>Gerar estatísticas e rankings</li>
        <li>Melhorar a experiência do usuário</li>
        <li>Cumprir obrigações legais</li>
      </ul>
      <h5>5. Armazenamento e Segurança</h5>
      <p>
        Os dados são armazenados em ambiente seguro, com controle de acesso restrito e
        mecanismos de proteção contra acessos não autorizados, perda, alteração ou divulgação
        indevida.
      </p>
      <h5>6. Direitos do Usuário</h5>
      <p>Nos termos da LGPD, o usuário poderá, a qualquer momento:</p>
      <ul>
        <li>Solicitar acesso aos seus dados</li>
        <li>Solicitar correção de informações incorretas</li>
        <li>Solicitar a exclusão de seus dados, quando aplicável</li>
        <li>Revogar consentimentos anteriormente concedidos</li>
      </ul>
      <p>
        As solicitações poderão ser realizadas por meio dos canais oficiais de atendimento
        disponibilizados na plataforma.
      </p>
      <h5>7. Atualizações desta Política</h5>
      <p>
        Esta Política de Privacidade poderá ser atualizada periodicamente para adequação legal
        ou melhoria de processos. Recomendamos a consulta regular desta página.
      </p>
    </>
  );

  const nameParts = editedData.name?.trim().split(' ').filter(Boolean) || [];
  const avatarInitials = `${nameParts[0]?.[0] || ''}${nameParts[1]?.[0] || ''}`
    .toUpperCase() || 'US';

  return (
    <>
      <AuthenticatedNavigation />
      <DashboardLayout 
        title="👤 Meu Perfil"
        subtitle="Gerencie suas informações pessoais"
      >
      <div className="profile-container">
        {/* Seção de Informações Pessoais */}
        <section className="profile-section">
          <div className="section-header">
            <h2>Informações Pessoais</h2>
            <button 
              onClick={handleEditToggle}
              className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isEditing ? '✕ Cancelar' : '✏️ Editar'}
            </button>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">{avatarInitials}</div>
            </div>

            <div className="profile-form">
              {profileError && (
                <p className="profile-message error">{profileError}</p>
              )}
              {profileStatus.error && (
                <p className="profile-message error">{profileStatus.error}</p>
              )}
              {profileStatus.success && (
                <p className="profile-message success">{profileStatus.success}</p>
              )}
              {profileLoading && (
                <p className="profile-message">Carregando dados do usuario...</p>
              )}
              {profileSaving && !profileStatus.success && (
                <p className="profile-message">Salvando...</p>
              )}
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="name">Nome completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editedData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nickname">Nickname</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={editedData.nickname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  />
                  <small className="form-hint">Este nome será visível publicamente.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-Mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="birthdate">Data de Nascimento</label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={editedData.birthdate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="sex">Sexo</label>
                  <select
                    id="sex"
                    name="sex"
                    value={editedData.sex}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  >
                    <option value="">Selecione</option>
                    <option value="female">Feminino</option>
                    <option value="male">Masculino</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Tipo de Usuario</label>
                  <div className="role-grid">
                    <label className={`role-option ${userRoles.includes('pilgrim') ? 'active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={userRoles.includes('pilgrim')}
                        onChange={() => handleRoleToggle('pilgrim')}
                        disabled
                      />
                      <span>Peregrino</span>
                    </label>
                    <label className={`role-option ${userRoles.includes('merchant') ? 'active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={userRoles.includes('merchant')}
                        onChange={() => handleRoleToggle('merchant')}
                        disabled={!isEditing || userRoles.includes('manager')}
                      />
                      <span>Comerciante</span>
                    </label>
                    <label className={`role-option ${userRoles.includes('manager') ? 'active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={userRoles.includes('manager')}
                        onChange={() => handleRoleToggle('manager')}
                        disabled
                      />
                      <span>Gestor</span>
                    </label>
                  </div>
                  <small className="form-hint">
                    Peregrino e Gestor, quando marcados, não podem ser desmarcados.
                    Apenas admin pode cadastrar Gestor. Comerciantes e Gestores são sempre Peregrinos.
                  </small>
                  <small className="form-hint muted">
                    Peregrinos podem solicitar perfil de Comerciante. Perfis de Gestor nao podem ser solicitados.
                  </small>
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button type="button" onClick={handleSave} className="btn btn-primary" disabled={profileSaving}>
                    {profileSaving ? 'Salvando...' : '💾 Salvar Alterações'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Seção de Segurança */}
        <section className="profile-section">
          <h2>Segurança</h2>
          <div className="profile-card">
            <div className="security-item stack">
              <div className="security-info">
                <h3>Alterar Senha</h3>
                <p>Altere sua senha de acesso com frequência para manter sua conta segura</p>
                {!showPasswordForm && (
                  <button className="btn btn-secondary" onClick={handlePasswordToggle}>
                    Alterar Senha
                  </button>
                )}
              </div>
              {showPasswordForm && (
                <form className="password-form" onSubmit={handlePasswordSubmit}>
                  <div className="password-grid">
                    <div className="form-group">
                      <label htmlFor="currentPassword">Senha atual</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="editing"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="newPassword">Nova senha</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="editing"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Repetir nova senha</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="editing"
                      />
                    </div>
                  </div>
                  {passwordStatus.error && (
                    <p className="password-message error">{passwordStatus.error}</p>
                  )}
                  {passwordStatus.success && (
                    <p className="password-message success">{passwordStatus.success}</p>
                  )}
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Salvar nova senha
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handlePasswordToggle}>
                      Fechar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Seção de Comerciantes (se aplicável) */}
        {isMerchant && (
          <section className="profile-section">
            <div className="section-header">
              <h2>Meus Comércios</h2>
              <button className="btn btn-primary">+ Novo Comércio</button>
            </div>

            <div className="merchants-grid">
              <div className="merchant-card">
                <div className="merchant-header">
                  <h3>Restaurante Centro</h3>
                  <span className="badge approved">Aprovado</span>
                </div>
                <div className="merchant-details">
                  <p><strong>Tipo:</strong> Restaurante</p>
                  <p><strong>Endereço:</strong> Rua Principal, 123</p>
                  <p><strong>Telefone:</strong> (31) 3333-4444</p>
                  <p><strong>Horário:</strong> 11h - 22h</p>
                </div>
                <div className="merchant-actions">
                  <button className="btn btn-secondary">Editar</button>
                  <button className="btn btn-secondary">Detalhes</button>
                </div>
              </div>

              <div className="merchant-card">
                <div className="merchant-header">
                  <h3>Café Vila</h3>
                  <span className="badge approved">Aprovado</span>
                </div>
                <div className="merchant-details">
                  <p><strong>Tipo:</strong> Café/Lanchonete</p>
                  <p><strong>Endereço:</strong> Avenida Brasil, 456</p>
                  <p><strong>Telefone:</strong> (31) 3333-5555</p>
                  <p><strong>Horário:</strong> 7h - 19h</p>
                </div>
                <div className="merchant-actions">
                  <button className="btn btn-secondary">Editar</button>
                  <button className="btn btn-secondary">Detalhes</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Seção de Preferências */}
        {/*
          PARA IMPLEMENTAÇÃO FUTURA: envio de Notificações e Newsletter.
        */}

        <section className="profile-section">
          <h2>Privacidade e LGPD</h2>
          <div className="profile-card privacy-card">
            <div className="privacy-header">
              <h3>Proteção de dados pessoais</h3>
              <p>
                Seus dados são protegidos conforme a LGPD e não serão divulgados.
                Ao concordar, você confirma estar ciente das diretrizes de uso do sistema.
              </p>
            </div>
            <label className="privacy-checkbox">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={handlePrivacyToggle}
              />
              <span>Estou ciente e concordo com a política de privacidade</span>
            </label>
            {privacyStatus.message && (
              <p className={`privacy-status ${privacyStatus.suspended ? 'suspended' : 'active'}`}>
                {privacyStatus.message}
              </p>
            )}
            <div className={`privacy-policy ${isPolicyExpanded ? 'expanded' : 'collapsed'}`}>
              {renderPrivacyPolicy()}
            </div>
            <button
              type="button"
              className="privacy-policy-toggle"
              onClick={() => setIsPolicyExpanded(prev => !prev)}
            >
              {isPolicyExpanded ? 'Ver menos' : 'Ver mais'}
            </button>
          </div>
        </section>
        {showPrivacyModal && (
          <div className="privacy-modal-backdrop" role="dialog" aria-modal="true">
            <div className="privacy-modal">
              {privacyModalMode === 'suspended' ? (
                <>
                  <h3>Conta suspensa</h3>
                  <p>
                    Sua conta está suspensa porque você não concordou com a política de privacidade.
                    Para reativar, aceite a política.
                  </p>
                  <div className="privacy-policy privacy-policy-modal">
                    {renderPrivacyPolicy()}
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-primary" onClick={confirmPrivacyReactivate}>
                      Estou ciente e de acordo
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={keepPrivacySuspended}>
                      Não aceitar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>Remover aceite da política?</h3>
                  <p>
                    Se você remover o aceite da política de privacidade, sua conta poderá ser suspensa.
                  </p>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={cancelPrivacyRevoke}>
                      Manter aceite
                    </button>
                    <button type="button" className="btn btn-danger" onClick={confirmPrivacyRevoke}>
                      Remover aceite
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      </DashboardLayout>
    </>
  );
}
