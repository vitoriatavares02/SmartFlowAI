import React, { useState } from 'react';
import { Cpu, KeyRound, Mail, ShieldCheck, UserCheck, Users } from 'lucide-react';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Falha no login. Verifique suas credenciais.');
      }
    } catch (err) {
      // Local fallback login for dev offline mode
      if (email.toLowerCase() === 'admin@smartflow.com' && password === 'admin123') {
        onLoginSuccess({
          id: 1,
          name: 'Admin SmartFlow (TI)',
          email: 'admin@smartflow.com',
          role: 'Administrador',
          department: 'TI'
        });
      } else if (email.toLowerCase() === 'admin.rh@smartflow.com' && password === 'admin123') {
        onLoginSuccess({
          id: 4,
          name: 'Admin RH (Recursos Humanos)',
          email: 'admin.rh@smartflow.com',
          role: 'Administrador',
          department: 'RH'
        });
      } else if (email.toLowerCase() === 'user@smartflow.com' && password === 'user123') {
        onLoginSuccess({
          id: 2,
          name: 'João Silva',
          email: 'user@smartflow.com',
          role: 'Solicitante',
          department: 'Vendas'
        });
      } else if (email.toLowerCase() === 'maria@smartflow.com' && password === 'user123') {
        onLoginSuccess({
          id: 3,
          name: 'Maria Oliveira',
          email: 'maria@smartflow.com',
          role: 'Solicitante',
          department: 'Financeiro'
        });
      } else {
        setError('Credenciais inválidas. Tente usar as contas de demonstração.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '2.25rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
          }}>
            <Cpu size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SmartFlow
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Plataforma de Automação com Controle Departamental
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '1.2rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">E-mail de Acesso</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Senha</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}>
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* Demo Quick Fill Buttons */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', marginBottom: '0.75rem' }}>
            ⚡ Acesso Rápido para Demonstração e Testes de Permissão:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.5rem', justifyContent: 'center', borderColor: 'rgba(99, 102, 241, 0.4)' }}
              onClick={() => handleQuickLogin('admin@smartflow.com', 'admin123')}
            >
              <ShieldCheck size={14} color="#6366f1" />
              Admin (TI)
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.5rem', justifyContent: 'center', borderColor: 'rgba(168, 85, 247, 0.4)' }}
              onClick={() => handleQuickLogin('admin.rh@smartflow.com', 'admin123')}
            >
              <ShieldCheck size={14} color="#a855f7" />
              Admin (RH)
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.5rem', justifyContent: 'center' }}
              onClick={() => handleQuickLogin('user@smartflow.com', 'user123')}
            >
              <UserCheck size={14} color="#06b6d4" />
              Solicitante (João)
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.5rem', justifyContent: 'center' }}
              onClick={() => handleQuickLogin('maria@smartflow.com', 'user123')}
            >
              <UserCheck size={14} color="#10b981" />
              Solicitante (Maria)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
