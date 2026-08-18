import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import DashboardMetrics from './components/DashboardMetrics';
import RequestFilters from './components/RequestFilters';
import RequestList from './components/RequestList';
import RequestModal from './components/RequestModal';
import EditRequestModal from './components/EditRequestModal';
import NewRequestForm from './components/NewRequestForm';
import LoginForm from './components/LoginForm';
import SolicitantePortal from './components/SolicitantePortal';
import UserManagementModal from './components/UserManagementModal';

const INITIAL_MOCK_DATA = [
  {
    id: 248,
    user_id: 2,
    user_name: 'João Silva',
    title: 'Compra de notebook para desenvolvimento',
    description: 'Preciso de um notebook de alta performance para trabalhar com desenvolvimento de software e inteligência artificial.',
    category: 'Equipamentos',
    priority: 'Alta',
    department: 'TI',
    status: 'Pendente',
    ai_keywords: ['notebook', 'desenvolvimento', 'hardware'],
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 247,
    user_id: 3,
    user_name: 'Maria Oliveira',
    title: 'Acesso ao ambiente de staging e banco de dados',
    description: 'Solicito liberação de credenciais de acesso ao servidor de testes e banco de dados de desenvolvimento.',
    category: 'Acesso ao sistema',
    priority: 'Média',
    department: 'TI',
    status: 'Em Andamento',
    ai_keywords: ['acesso', 'credenciais', 'staging', 'banco de dados'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 246,
    user_id: 2,
    user_name: 'João Silva',
    title: 'Solicitação de agendamento de férias',
    description: 'Gostaria de solicitar o agendamento de 15 dias de férias para o mês de setembro conforme combinado.',
    category: 'Recursos Humanos',
    priority: 'Baixa',
    department: 'RH',
    status: 'Resolvido',
    ai_keywords: ['férias', 'agendamento', 'rh'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smartflow_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [requests, setRequests] = useState(INITIAL_MOCK_DATA);
  const [metrics, setMetrics] = useState({
    total: 3,
    pendentes: 1,
    altaPrioridade: 1,
    resolvidas: 1,
    automationRate: '87%',
    avgResolutionTime: '4.2h'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedPriority, setSelectedPriority] = useState('Todas');

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  // Save session state
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('smartflow_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smartflow_user');
  };

  // Fetch Requests from API
  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'Todos') params.append('status', selectedStatus);
      if (selectedCategory !== 'Todas') params.append('category', selectedCategory);
      if (selectedPriority !== 'Todas') params.append('priority', selectedPriority);
      if (searchTerm) params.append('search', searchTerm);

      // Pass user authorization context
      if (currentUser) {
        params.append('userRole', currentUser.role);
        params.append('userDepartment', currentUser.department || 'TI');
        params.append('userId', currentUser.id);
      }

      const response = await fetch(`/api/requests?${params.toString()}`);
      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          setRequests(json.data);
          if (json.metrics) setMetrics(json.metrics);
        }
      }
    } catch (err) {
      // Local fallback filter with Role & Department enforcement
      let filtered = [...requests];

      if (currentUser?.role === 'Solicitante') {
        filtered = filtered.filter(r => r.user_id === currentUser.id);
      } else if (currentUser?.role === 'Administrador' && currentUser.department && currentUser.department !== 'Geral') {
        filtered = filtered.filter(r => (r.department || '').toLowerCase() === currentUser.department.toLowerCase());
      }

      if (selectedStatus !== 'Todos') filtered = filtered.filter(r => r.status === selectedStatus);
      if (selectedCategory !== 'Todas') filtered = filtered.filter(r => r.category === selectedCategory);
      if (selectedPriority !== 'Todas') filtered = filtered.filter(r => r.priority === selectedPriority);
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
      }
      setRequests(filtered);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRequests();
    }
  }, [currentUser, searchTerm, selectedStatus, selectedCategory, selectedPriority]);

  // Handle New Request Creation
  const handleCreateRequest = async ({ title, description }) => {
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          user_id: currentUser?.id,
          user_name: currentUser?.name
        })
      });

      if (response.ok) {
        const json = await response.json();
        console.log('🤖 [SmartFlow IA: Resposta da Classificação]:', json.data);
        await fetchRequests();
        return;
      }
    } catch (err) {
      // Local fallback classification if API offline
      const text = `${title} ${description}`.toLowerCase();
      let category = 'Geral';
      let priority = 'Média';
      let department = 'TI';
      let keywords = ['solicitação'];

      if (/cart[aã]o|onibus|[oô]nibus|ja[eé]|riocard|bilhete|transporte|vale[\s\-]transporte|\bvt\b|alimenta[cç][aã]o|refei[cç][aã]o|\bva\b|\bvr\b|sodexo|alelo|crach[aá]|f[eé]rias|pagamento|sal[aá]rio|benef[ií]cio|contrato|\brh\b|atestado|admiss[aã]o|demiss[aã]o|desligamento|rescis[aã]o|holerite|contracheque|ponto|plano de sa[uú]de|conv[eê]nio/i.test(text)) {
        category = 'Recursos Humanos';
        priority = /quebrou|urgente|bloqueado/i.test(text) ? 'Alta' : 'Média';
        department = 'RH';
        keywords = ['rh', 'benefícios', 'transporte'];
      } else if (/notebook|computador|laptop|macbook|desktop|\bpc\b|monitor|mouse|teclado|hardware|impressora|toner|headset|fone|webcam|equipamento/i.test(text)) {
        category = 'Equipamentos';
        priority = 'Alta';
        department = 'TI';
        keywords = ['hardware', 'equipamentos'];
      } else if (/acesso|senha|login|sistema|permiss[aã]o|ssh|vpn|credencial|servidor|banco de dados|software|docker|vscode/i.test(text)) {
        category = 'Acesso ao sistema';
        department = 'TI';
        keywords = ['acesso', 'segurança'];
      } else if (/faturamento|nota[\s\-]fiscal|\bnf\b|reembolso|or[cç]amento|financeiro|boleto/i.test(text)) {
        category = 'Financeiro';
        department = 'Financeiro';
        keywords = ['financeiro', 'fiscal'];
      } else if (/comprar|compra|fornecedor|cota[cç][aã]o|aquisi[cç][aã]o/i.test(text)) {
        category = 'Compras';
        department = 'Compras';
        keywords = ['compras', 'fornecedor'];
      }

      const newReq = {
        id: Math.floor(250 + Math.random() * 500),
        user_id: currentUser?.id,
        user_name: currentUser?.name,
        title,
        description,
        category,
        priority,
        department,
        status: 'Pendente',
        ai_keywords: keywords,
        created_at: new Date().toISOString()
      };

      console.log('🤖 [SmartFlow IA: Resposta Local Fallback]:', newReq);

      setRequests(prev => [newReq, ...prev]);
      setMetrics(prev => ({
        ...prev,
        total: prev.total + 1,
        pendentes: prev.pendentes + 1,
        altaPrioridade: priority === 'Alta' ? prev.altaPrioridade + 1 : prev.altaPrioridade
      }));
    }
  };

  // Handle Status Change
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchRequests();
    } catch (err) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Handle Edit Request (Title, Description, etc.)
  const handleEditRequest = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        console.log('🤖 [SmartFlow IA: Resposta da Reclassificação]:', data.data);
        await fetchRequests();
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest(prev => ({ ...prev, ...data.data }));
        }
      }
    } catch (err) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(prev => ({ ...prev, ...updatedData }));
      }
    }
  };

  // Handle Cancel Request
  const handleCancelRequest = async (id) => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelado' })
      });
      if (response.ok) {
        await fetchRequests();
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest(prev => ({ ...prev, status: 'Cancelado' }));
        }
      }
    } catch (err) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelado' } : r));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(prev => ({ ...prev, status: 'Cancelado' }));
      }
    }
  };

  // Handle Delete Request
  const handleDeleteRequest = async (id) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: 'DELETE'
      });
      await fetchRequests();
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(null);
      }
    } catch (err) {
      setRequests(prev => prev.filter(r => r.id !== id));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(null);
      }
    }
  };

  // If not logged in, render Login Form
  if (!currentUser) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  const isAdmin = currentUser.role === 'Administrador';

  return (
    <div className="app-container">
      <Header
        currentUser={currentUser}
        onOpenNewRequest={() => setIsNewRequestOpen(true)}
        onOpenUserManagement={() => setIsUserManagementOpen(true)}
        onLogout={handleLogout}
      />

      <main>
        {isAdmin ? (
          /* Admin View: Metrics + Filters + Requests List */
          <div className="animate-fade-in">
            <DashboardMetrics metrics={metrics} />

            <RequestFilters
              currentUser={currentUser}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
            />

            <RequestList
              requests={requests}
              onSelectRequest={(item) => setSelectedRequest(item)}
            />
          </div>
        ) : (
          /* Solicitante View: Dedicated Requester Portal */
          <SolicitantePortal
            currentUser={currentUser}
            requests={requests}
            onCreateRequest={handleCreateRequest}
            onOpenEdit={(req) => setEditingRequest(req)}
            onCancelRequest={handleCancelRequest}
            onDeleteRequest={handleDeleteRequest}
            onSelectRequest={(item) => setSelectedRequest(item)}
          />
        )}
      </main>

      {/* Detail Modal */}
      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatus}
          onOpenEdit={(req) => setEditingRequest(req)}
          onCancelRequest={handleCancelRequest}
          onDeleteRequest={handleDeleteRequest}
        />
      )}

      {/* Edit Request Modal */}
      {editingRequest && (
        <EditRequestModal
          request={editingRequest}
          currentUser={currentUser}
          onClose={() => setEditingRequest(null)}
          onSave={handleEditRequest}
          onCancelRequest={handleCancelRequest}
        />
      )}

      {/* New Request Form Modal */}
      {isNewRequestOpen && (
        <NewRequestForm
          onClose={() => setIsNewRequestOpen(false)}
          onSubmit={handleCreateRequest}
        />
      )}

      {/* Admin User Management Modal */}
      {isUserManagementOpen && (
        <UserManagementModal
          onClose={() => setIsUserManagementOpen(false)}
        />
      )}
    </div>
  );
}

