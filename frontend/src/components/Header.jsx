import React from 'react';
import { Cpu, LogOut, Plus, ShieldCheck, User, Users } from 'lucide-react';

export default function Header({ currentUser, onOpenNewRequest, onOpenUserManagement, onLogout }) {
  const isAdmin = currentUser?.role === 'Administrador';

  return (
    <header className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <Cpu size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SmartFlow
              </h1>
              <span className="ai-badge pulse-glow">
                <ShieldCheck size={12} /> AI Powered
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Automação Inteligente de Processos Corporativos
            </p>
          </div>
        </div>

        {/* Action Buttons & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Admin User Management Button */}
          {isAdmin && (
            <button onClick={onOpenUserManagement} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
              <Users size={16} color="#a855f7" />
              Gestão de Usuários
            </button>
          )}

          {/* New Request Button */}
          <button onClick={onOpenNewRequest} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <Plus size={18} />
            Nova Solicitação
          </button>

          {/* User Profile Badge & Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isAdmin ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #06b6d4, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.85rem'
            }}>
              <User size={16} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{currentUser?.name}</span>
              <span style={{ fontSize: '0.7rem', color: isAdmin ? '#c084fc' : '#67e8f9', fontWeight: 600 }}>
                {currentUser?.role} • {currentUser?.department}
              </span>
            </div>

            <button
              onClick={onLogout}
              title="Sair do sistema"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                marginLeft: '0.4rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
