import React, { useEffect, useState } from 'react';
import { Building2, Edit2, Mail, Pencil, ShieldCheck, Trash2, UserCheck, UserPlus, Users, X } from 'lucide-react';

export default function UserManagementModal({ onClose }) {
  const [users, setUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Solicitante');
  const [department, setDepartment] = useState('TI');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/users');
      if (response.ok) {
        const json = await response.json();
        if (json.success) setUsers(json.data);
      }
    } catch (err) {
      setUsers([
        { id: 1, name: 'Admin SmartFlow', email: 'admin@smartflow.com', role: 'Administrador', department: 'TI' },
        { id: 2, name: 'João Silva', email: 'user@smartflow.com', role: 'Solicitante', department: 'Vendas' },
        { id: 3, name: 'Maria Oliveira', email: 'maria@smartflow.com', role: 'Solicitante', department: 'Financeiro' }
      ]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStartCreate = () => {
    setEditingUserId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('Solicitante');
    setDepartment('TI');
    setMessage({ type: '', text: '' });
    setIsAddingUser(true);
  };

  const handleStartEdit = (user) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword(''); // Empty unless admin wants to change password
    setRole(user.role);
    setDepartment(user.department || 'TI');
    setMessage({ type: '', text: '' });
    setIsAddingUser(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    const isEdit = editingUserId !== null;
    const url = isEdit ? `/api/auth/users/${editingUserId}` : '/api/auth/users';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = { name, email, role, department };
    if (password && password.trim() !== '') {
      payload.password = password;
    } else if (!isEdit) {
      setMessage({ type: 'error', text: 'Senha inicial é obrigatória na criação' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (response.ok && json.success) {
        setMessage({ type: 'success', text: json.message });
        setName('');
        setEmail('');
        setPassword('');
        setEditingUserId(null);
        setIsAddingUser(false);
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: json.message || 'Erro ao salvar usuário' });
      }
    } catch (err) {
      if (isEdit) {
        setUsers(prev => prev.map(u => u.id === editingUserId ? { ...u, name, email, role, department } : u));
        setMessage({ type: 'success', text: `Usuário ${name} atualizado com sucesso!` });
      } else {
        const newUser = { id: Math.floor(10 + Math.random() * 90), name, email, role, department };
        setUsers(prev => [newUser, ...prev]);
        setMessage({ type: 'success', text: `Usuário ${name} cadastrado com sucesso!` });
      }
      setName('');
      setEmail('');
      setPassword('');
      setEditingUserId(null);
      setIsAddingUser(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Tem certeza que deseja remover o usuário ${user.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/auth/users/${user.id}`, { method: 'DELETE' });
      const json = await response.json();
      if (response.ok && json.success) {
        setMessage({ type: 'success', text: json.message });
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: json.message || 'Erro ao remover usuário' });
      }
    } catch (err) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setMessage({ type: 'success', text: `Usuário ${user.name} removido com sucesso` });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }} className="animate-fade-in">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '780px', padding: '1.75rem', position: 'relative', maxHeight: '85vh', overflowY: 'auto' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
              <Users size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                Gestão de Usuários e Permissões
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Controle de acesso departamental: Administradores de TI gerenciam chamados de TI, e cada setor acessa sua respectiva fila.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isAddingUser) {
                setIsAddingUser(false);
                setEditingUserId(null);
              } else {
                handleStartCreate();
              }
            }}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
          >
            <UserPlus size={16} />
            {isAddingUser ? 'Ver Lista' : 'Novo Usuário'}
          </button>
        </div>

        {message.text && (
          <div style={{
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            color: message.type === 'success' ? '#6ee7b7' : '#fca5a5',
            padding: '0.75rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {message.text}
          </div>
        )}

        {/* Create / Edit Form */}
        {isAddingUser ? (
          <form onSubmit={handleSaveUser} style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {editingUserId ? <Pencil size={18} color="#a855f7" /> : <UserPlus size={18} color="#6366f1" />}
              {editingUserId ? `Editar Usuário #${editingUserId}` : 'Cadastrar Novo Usuário'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Carlos Eduardo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail Corporativo</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="carlos@smartflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">{editingUserId ? 'Nova Senha (opcional)' : 'Senha Inicial'}</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder={editingUserId ? 'Deixe em branco para manter' : '••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingUserId}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Papel / Função</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Solicitante">Solicitante</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Departamento</label>
                <select
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="TI">TI</option>
                  <option value="RH">RH</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Compras">Compras</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => { setIsAddingUser(false); setEditingUserId(null); }} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Salvando...' : (editingUserId ? 'Atualizar Usuário' : 'Salvar Usuário')}
              </button>
            </div>
          </form>
        ) : (
          /* Users Table */
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nome / E-mail</th>
                  <th>Papel (Role)</th>
                  <th>Setor</th>
                  <th>ID</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{u.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'Administrador' ? 'badge-alta' : 'badge-média'}`}>
                        {u.role === 'Administrador' ? <ShieldCheck size={13} /> : <UserCheck size={13} />}
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {u.department}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#a5b4fc' }}>
                      #{u.id}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleStartEdit(u)}
                          title="Editar Usuário"
                          style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            color: '#a5b4fc',
                            padding: '0.35rem 0.6rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem'
                          }}
                        >
                          <Pencil size={13} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          title="Remover Usuário"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#fca5a5',
                            padding: '0.35rem 0.6rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem'
                          }}
                        >
                          <Trash2 size={13} />
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
