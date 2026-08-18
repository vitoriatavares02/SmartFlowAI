import React from 'react';
import { Building2, Filter, Lock, Search, ShieldAlert, Sparkles } from 'lucide-react';

export default function RequestFilters({
  currentUser,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority
}) {
  const dept = currentUser?.department || 'TI';
  const isTIAdmin = currentUser?.role === 'Administrador' && dept === 'TI';

  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Department Permission Scope Banner */}
      <div style={{
        background: isTIAdmin 
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.12))'
          : 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(236, 72, 153, 0.12))',
        border: `1px solid ${isTIAdmin ? 'rgba(99, 102, 241, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`,
        borderRadius: '12px',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: isTIAdmin ? 'rgba(99, 102, 241, 0.25)' : 'rgba(168, 85, 247, 0.25)',
            color: isTIAdmin ? '#a5b4fc' : '#d8b4fe',
            padding: '0.4rem',
            borderRadius: '8px',
            display: 'flex'
          }}>
            <Building2 size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Painel de Gestão: Setor {dept}
              <span className="badge badge-alta" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                <Lock size={10} /> Visibilidade Restrita
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
              {isTIAdmin 
                ? '🔒 Exclusivo: Apenas administradores de TI podem visualizar e gerenciar os chamados de TI.'
                : `🔒 Exclusivo: Visualização restrita aos chamados direcionados ao setor de ${dept}.`}
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'rgba(0,0,0,0.3)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          Perfil: <strong style={{ color: '#fff' }}>{currentUser?.role} ({dept})</strong>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search Input */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Buscar solicitações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Select Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Filter size={16} />
            Filtros:
          </div>

          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: 'auto', minWidth: '130px' }}
          >
            <option value="Todos">Status: Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Resolvido">Resolvido</option>
            <option value="Cancelado">Cancelado</option>
          </select>

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="Todas">Categoria: Todas</option>
            <option value="Equipamentos">Equipamentos</option>
            <option value="Acesso ao sistema">Acesso ao sistema</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Compras">Compras</option>
          </select>

          <select
            className="form-select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="Todas">Prioridade: Todas</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
        </div>
      </div>
    </div>
  );
}
