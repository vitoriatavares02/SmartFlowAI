import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Inbox, Zap } from 'lucide-react';

export default function DashboardMetrics({ metrics }) {
  const cards = [
    {
      title: 'Total de Solicitações',
      value: metrics?.total || 0,
      icon: Inbox,
      color: '#6366f1',
      subtext: 'Registradas este mês'
    },
    {
      title: 'Pendentes de Análise',
      value: metrics?.pendentes || 0,
      icon: Clock,
      color: '#f59e0b',
      subtext: 'Aguardando ação'
    },
    {
      title: 'Alta Prioridade / Críticas',
      value: metrics?.altaPrioridade || 0,
      icon: AlertTriangle,
      color: '#ef4444',
      subtext: 'Triagem urgente'
    },
    {
      title: 'Taxa de Automação IA',
      value: metrics?.automationRate || '87%',
      icon: Zap,
      color: '#06b6d4',
      subtext: 'Classificadas via IA'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {card.title}
              </span>
              <div style={{
                background: `${card.color}20`,
                border: `1px solid ${card.color}40`,
                padding: '0.4rem',
                borderRadius: '8px',
                display: 'flex'
              }}>
                <Icon size={18} color={card.color} />
              </div>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
              {card.value}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 'auto' }}>
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
