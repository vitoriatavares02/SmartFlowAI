import React, { useState } from 'react';
import { Bot, Calendar, CheckCircle2, Clock, Edit3, Plus, Sparkles, Tag, Trash2, XCircle } from 'lucide-react';
import NewRequestForm from './NewRequestForm';

export default function SolicitantePortal({
  currentUser,
  requests,
  onCreateRequest,
  onOpenEdit,
  onCancelRequest,
  onDeleteRequest,
  onSelectRequest
}) {
  const [isNewOpen, setIsNewOpen] = useState(false);

  // Filter requests strictly submitted by this user
  const userRequests = requests.filter(
    r => r.user_id === currentUser.id || (r.user_name && r.user_name === currentUser.name)
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Banner */}
      <div className="glass-panel" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="ai-badge pulse-glow">
              <Sparkles size={12} /> Portal do Solicitante
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>| Setor: {currentUser.department}</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            Olá, {currentUser.name}! 👋
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Envie suas dúvidas ou chamados em linguagem natural. Nossa IA fará a triagem e direcionamento imediato.
          </p>
        </div>

        <button onClick={() => setIsNewOpen(true)} className="btn btn-primary" style={{ padding: '0.8rem 1.4rem', fontSize: '0.95rem' }}>
          <Plus size={20} />
          Nova Solicitação
        </button>
      </div>

      {/* Request History */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--accent-cyan)" />
          Minhas Solicitações Recentes ({userRequests.length})
        </h3>

        {userRequests.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Bot size={44} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Nenhuma solicitação enviada ainda</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.4rem', marginBottom: '1.25rem' }}>
              Clique no botão acima para enviar seu primeiro chamado com triagem via IA.
            </p>
            <button onClick={() => setIsNewOpen(true)} className="btn btn-primary">
              <Plus size={18} />
              Criar Solicitação
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {userRequests.map((req) => (
              <div key={req.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>
                      #{req.id}
                    </span>
                    <span className={`badge status-${req.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {req.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                    {req.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '1rem' }}>
                    "{req.description}"
                  </p>
                </div>

                <div>
                  {/* AI Triaging Badges */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '0.9rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Classificação da IA:</span>
                      <span className={`badge badge-${req.priority.toLowerCase()}`}>
                        {req.priority}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#e5e7eb', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Sparkles size={13} color="var(--accent-cyan)" />
                        {req.category}
                      </span>
                      <span>•</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Setor: <strong>{req.department}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar for Requester: Edit, Cancel, Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {/* Edit button */}
                      {req.status !== 'Cancelado' && (
                        <button
                          onClick={() => onOpenEdit && onOpenEdit(req)}
                          title="Editar solicitação"
                          style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            color: '#a5b4fc',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.78rem',
                            fontWeight: 600
                          }}
                        >
                          <Edit3 size={13} />
                          Editar
                        </button>
                      )}

                      {/* Cancel button */}
                      {req.status !== 'Cancelado' && req.status !== 'Resolvido' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Deseja cancelar o chamado #${req.id} (${req.title})?`)) {
                              onCancelRequest && onCancelRequest(req.id);
                            }
                          }}
                          title="Cancelar solicitação"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#fca5a5',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.78rem',
                            fontWeight: 600
                          }}
                        >
                          <XCircle size={13} />
                          Cancelar
                        </button>
                      )}
                    </div>

                    {/* Delete button (if cancelled or pending) */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Excluir permanentemente o chamado #${req.id}?`)) {
                          onDeleteRequest && onDeleteRequest(req.id);
                        }
                      }}
                      title="Excluir do histórico"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-dim)',
                        padding: '0.35rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isNewOpen && (
        <NewRequestForm
          onClose={() => setIsNewOpen(false)}
          onSubmit={onCreateRequest}
        />
      )}
    </div>
  );
}
