import React, { useState } from 'react';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import './PerfilPage.css';

export function PerfilPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    email: user?.email || '',
    username: user?.username || '',
    firstName: 'Adriana',
    lastName: 'Carvalho',
    phone: '(31) 99999-9999',
    birthDate: '1985-05-15',
    state: 'MG',
    city: 'Ouro Preto'
  });

  const isMerchant = user?.userType === 3;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implementar chamada ao backend para salvar dados
    setIsEditing(false);
  };

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
              <div className="avatar-placeholder">AC</div>
            </div>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Primeiro Nome</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={editedData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Sobrenome</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={editedData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
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
                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editedData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="birthDate">Data de Nascimento</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={editedData.birthDate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">Estado</label>
                  <select
                    id="state"
                    name="state"
                    value={editedData.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  >
                    <option value="MG">Minas Gerais</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="BA">Bahia</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="city">Cidade</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={editedData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button onClick={handleSave} className="btn btn-primary">
                    💾 Salvar Alterações
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
            <div className="security-item">
              <div className="security-info">
                <h3>Alterar Senha</h3>
                <p>Altere sua senha de acesso com frequência para manter sua conta segura</p>
              </div>
              <button className="btn btn-secondary">Alterar Senha</button>
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
        <section className="profile-section">
          <h2>Preferências</h2>
          <div className="profile-card">
            <div className="preference-item">
              <div className="preference-info">
                <h3>Notificações</h3>
                <p>Receba atualizações sobre sua jornada</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Newsletter</h3>
                <p>Receba dicas e informações sobre o Caminho de Cora</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>
      </div>
      </DashboardLayout>
    </>
  );
}
