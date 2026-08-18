import React, { useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';

export default function NewRequestForm({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    await onSubmit({ title, description });
    setIsSubmitting(false);
    onClose();
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '1.75rem', position: 'relative' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              Nova Solicitação Inteligente
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Escreva o título e a descrição. Nossa IA irá categorizar e definir a prioridade automaticamente.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título da Solicitação</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Compra de notebook para desenvolvimento..."
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
              placeholder="Descreva a necessidade com detalhes. Ex: Meu notebook atual está muito lento e preciso de um equipamento com 32GB RAM..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* AI Banner */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px dashed rgba(99, 102, 241, 0.3)',
            borderRadius: '10px',
            padding: '0.8rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.8rem',
            color: '#a5b4fc'
          }}>
            <Bot size={18} style={{ flexShrink: 0 }} />
            <span>
              A IA analisará o texto para extrair: <strong>Categoria</strong>, <strong>Prioridade</strong> e <strong>Setor Responsável</strong>.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? (
                <>Processando IA...</>
              ) : (
                <>
                  <Send size={16} />
                  Enviar Solicitação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
