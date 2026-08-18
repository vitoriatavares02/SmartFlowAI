import React from 'react';
import { Bot, Building2, Calendar, CheckCircle2, Clock, Sparkles, Tag, X } from 'lucide-react';

export default function RequestModal({
  request,
  onClose,
  onUpdateStatus,
  onOpenEdit,
  onCancelRequest,
  onDeleteRequest
}) {
  if (!request) return null;

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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', padding: '1.75rem', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
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

        {/* Modal Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#a5b4fc', fontWeight: 600 }}>
              Solicitação #{request.id}
            </span>
            <span className={`badge status-${request.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {request.status}
            </span>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
            {request.title}
          </h2>
          {request.user_name && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Solicitante: <strong style={{ color: '#e5e7eb' }}>{request.user_name}</strong> {request.user_department ? `(${request.user_department})` : ''}
            </p>
          )}
        </div>

        {/* User Raw Input Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem',
          fontSize: '0.92rem',
          color: 'var(--text-main)',
          lineHeight: '1.5'
        }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Descrição enviada pelo solicitante:
          </p>
          "{request.description}"
        </div>

        {/* AI Insight Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#a5b4fc', fontWeight: 700, fontSize: '0.9rem' }}>
            <Bot size={18} />
            Análise & Triagem Automatizada por IA:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Categoria:</span>
              <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                <Sparkles size={14} color="var(--accent-cyan)" />
                {request.category}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Prioridade:</span>
              <span className={`badge badge-${request.priority.toLowerCase()}`} style={{ marginTop: '0.2rem' }}>
                {request.priority}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Setor Destino:</span>
              <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                <Building2 size={14} color="#a855f7" />
                {request.department}
              </strong>
            </div>
          </div>

          {/* Keywords */}
          {request.ai_keywords && request.ai_keywords.length > 0 && (
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Palavras-chave Extraídas:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {request.ai_keywords.map((kw, i) => (
                  <span key={i} style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    color: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Tag size={10} />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '1rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Edit Button */}
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
              onClick={() => {
                onClose();
                onOpenEdit && onOpenEdit(request);
              }}
            >
              Editar
            </button>

            {/* Cancel Button */}
            {request.status !== 'Cancelado' && request.status !== 'Resolvido' && (
              <button
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
                onClick={() => {
                  if (window.confirm(`Deseja cancelar o chamado #${request.id}?`)) {
                    onCancelRequest && onCancelRequest(request.id);
                    onClose();
                  }
                }}
              >
                Cancelar
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {request.status !== 'Resolvido' && request.status !== 'Cancelado' && (
              <button
                className="btn btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                onClick={() => onUpdateStatus(request.id, 'Resolvido')}
              >
                <CheckCircle2 size={15} />
                Marcar como Resolvido
              </button>
            )}

            {request.status === 'Pendente' && (
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                onClick={() => onUpdateStatus(request.id, 'Em Andamento')}
              >
                <Clock size={15} />
                Iniciar Atendimento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
