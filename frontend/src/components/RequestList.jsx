import React from 'react';
import { ArrowUpRight, Bot, Building2, Calendar, Sparkles } from 'lucide-react';

export default function RequestList({ requests, onSelectRequest }) {
  if (!requests || requests.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <Bot size={40} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nenhuma solicitação encontrada</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
          Tente alterar os filtros ou criar uma nova solicitação com triagem de IA.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Solicitação</th>
            <th>Categoria IA</th>
            <th>Setor</th>
            <th>Prioridade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((item) => (
            <tr key={item.id} onClick={() => onSelectRequest(item)}>
              <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#a5b4fc' }}>
                #{item.id}
              </td>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={12} />
                  {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </div>
              </td>
              <td>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-main)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                  <Sparkles size={13} color="var(--accent-cyan)" />
                  {item.category}
                </div>
              </td>
              <td>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Building2 size={13} />
                  {item.department}
                </div>
              </td>
              <td>
                <span className={`badge badge-${item.priority.toLowerCase()}`}>
                  {item.priority === 'Alta' && '🔴 '}
                  {item.priority === 'Média' && '🟡 '}
                  {item.priority === 'Baixa' && '🟢 '}
                  {item.priority}
                </span>
              </td>
              <td>
                <span className={`badge status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRequest(item);
                  }}
                >
                  Ver Detalhes
                  <ArrowUpRight size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
