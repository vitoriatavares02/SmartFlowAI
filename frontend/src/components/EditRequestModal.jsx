import React, { useState } from 'react';
import { Bot, CheckCircle2, Edit3, Save, Sparkles, X, XCircle } from 'lucide-react';

export default function EditRequestModal({ request, currentUser, onClose, onSave, onCancelRequest }) {
  const [title, setTitle] = useState(request.title || '');
  const [description, setDescription] = useState(request.description || '');
  const [category, setCategory] = useState(request.category || 'Geral');
  const [priority, setPriority] = useState(request.priority || 'Média');
  const [department, setDepartment] = useState(request.department || 'TI');
  const [status, setStatus] = useState(request.status || 'Pendente');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = currentUser?.role === 'Administrador';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    await onSave(request.id, {
      title,
      description,
      category,
      priority,
      department,
      status
    });
    setIsSubmitting(false);
    onClose();
  };

  const handleCancelClick = async () => {
    if (window.confirm('Tem certeza que deseja cancelar esta solicitação? Ela será marcada como "Cancelado".')) {
      setIsSubmitting(true);
      await onCancelRequest(request.id);
      setIsSubmitting(false);
      onClose();
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '620px', padding: '1.75rem', position: 'relative' }}>
        {/* Close Button */}
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

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
            <Edit3 size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              Editar Solicitação #{request.id}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Corrija as informações ou cancele a solicitação caso tenha sido aberta por engano.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título da Solicitação</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição Detalhada</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {isAdmin ? (
            /* Admin can edit category, priority, department and status directly */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Categoria</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Acesso ao sistema">Acesso ao sistema</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Compras">Compras</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Prioridade</label>
                <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Setor</label>
                <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="TI">TI</option>
                  <option value="RH">RH</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Compras">Compras</option>
                  <option value="Vendas">Vendas</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Pendente">Pendente</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Resolvido">Resolvido</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          ) : (
            /* Solicitante info box */
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px dashed rgba(99, 102, 241, 0.3)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.78rem',
              color: '#a5b4fc'
            }}>
              <Bot size={16} style={{ flexShrink: 0 }} />
              <span>
                Ao salvar, a IA atualizará automaticamente as tags e a triagem com base no novo texto fornecido.
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.75rem' }}>
            {/* Cancel Request Button */}
            {request.status !== 'Cancelado' && (
              <button
                type="button"
                onClick={handleCancelClick}
                disabled={isSubmitting}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '0.6rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <XCircle size={16} />
                Cancelar Solicitação
              </button>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Fechar
              </button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                <Save size={16} />
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
