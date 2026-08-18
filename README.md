# 🚀 SmartFlow — AI-Powered Process Automation & Triaging Platform

> **Plataforma corporativa inteligente de automação de processos, triagem com IA e controle departamental de chamados.**

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=nodedotjs)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue?logo=react)](https://reactjs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey?logo=sqlite)](https://www.sqlite.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 🎯 Visão Geral & Problema Resolvido

### **O Problema**
Empresas recebem centenas de demandas diárias de múltiplos departamentos (Equipamentos de TI, Acessos a Sistemas, Transporte/Benefícios de RH, Reembolsos Financeiros e Compras). O processo tradicional de triagem manual gera gargalos, atrasos no atendimento e encaminhamentos incorretos entre setores.

### **A Solução SmartFlow**
O **SmartFlow** automatiza 100% da triagem e do roteamento inicial. Quando o usuário envia uma solicitação em linguagem natural:
1. 🧠 **Classificação por IA**: Identifica a categoria, prioridade de atendimento e setor responsável (TI, RH, Financeiro, Compras).
2. 🔒 **Isolamento e Controle Departamental**:
   - **Administradores de TI**: Acessam e gerenciam exclusivamente os chamados de **TI**.
   - **Administradores de RH**: Acessam e gerenciam exclusivamente os chamados de **RH** (sem acesso aos chamados de TI).
   - **Solicitantes**: Possuem um portal dedicado onde acompanham **estritamente suas próprias solicitações**.
3. ✏️ **Edição & Cancelamento Inteligente**: Permite corrigir ou cancelar solicitações a qualquer momento, com reclassificação automática por IA ao editar o texto.

---

## ✨ Principais Funcionalidades

- 🧠 **Motor de IA para Classificação Semântica**: Analisa textos livres e direciona automaticamente para TI, RH, Financeiro ou Compras.
- 🏢 **Isolamento Departamental por Perfil**: Controle rigoroso de visibilidade no backend e frontend por setor (`TI`, `RH`, `Financeiro`, etc.).
- 👤 **Portal Exclusivo do Solicitante**: Interface moderna para envio de chamados, visualização do histórico pessoal, edição e cancelamento rápido.
- 📊 **Dashboard com Métricas em Tempo Real**: Indicadores de total de solicitações, pendências, chamados críticos e taxa de automação calculados de acordo com o escopo do usuário logado.
- 🔍 **Filtros e Busca Avançada**: Filtragem por status (*Pendente*, *Em Andamento*, *Resolvido*, *Cancelado*), categoria e busca textual instantânea.
- ⚡ **Logs Estruturados da IA**: Visualização detalhada no terminal e no console do navegador de cada classificação executada pela IA.
- 💾 **Persistência SQLite & Fallback em Memória**: Banco de dados leve e pronto para execução local ou deploy serverless (Vercel `/tmp`).

---

## 🧱 Arquitetura do Sistema

```text
               ┌─────────────────────────────────────────┐
               │           React SPA (Vite)              │
               │  - Portal Solicitante  - Dashboard Admin│
               └────────────────────┬────────────────────┘
                                    │ HTTP / JSON
                                    ▼
               ┌─────────────────────────────────────────┐
               │         Node.js + Express API           │
               │  - Auth Controller  - Request Controller│
               └──────────┬───────────────────┬──────────┘
                          │                   │
                SQL Query │                   │ Prompt / Semantic Rules
                          ▼                   ▼
                 ┌─────────────────┐   ┌─────────────────┐
                 │     SQLite      │   │    AI Engine    │
                 │ (smartflow.db)  │   │  (aiService.js) │
                 └─────────────────┘   └─────────────────┘
```

---

## 📁 Estrutura de Diretórios (Monorepo)

```text
SmartFlow/
├── backend/                  # Servidor API REST Node.js + Express
│   ├── src/
│   │   ├── controllers/      # authController.js e requestController.js
│   │   ├── database/         # connection.js (SQLite & Seed Inicial)
│   │   ├── routes/           # Rotas /api/auth e /api/requests
│   │   ├── services/         # aiService.js (Motor de Triagem Inteligente)
│   │   └── app.js            # Servidor Express principal
│   ├── smartflow.db          # Banco de dados SQLite persistente
│   └── package.json
├── frontend/                 # Aplicação React SPA (Vite)
│   ├── src/
│   │   ├── components/       # Dashboard, Modais, Cards, Filtros, Portal
│   │   ├── App.jsx           # Componente raiz com controle de sessão
│   │   └── index.css         # Design System moderno (Dark Glassmorphism)
│   └── package.json
├── doc/                      # Documentação técnica e schemas
│   ├── architecture.md       # Diagrama de fluxo e decisões arquiteturais
│   └── database-schema.sql   # DDL SQL das tabelas
├── api/                      # Handler serverless para deploy Vercel
├── vercel.json               # Configuração unificada de build e rewrites
├── .gitignore                # Regras de exclusão de artefatos e dependências
└── README.md                 # Documentação principal
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** (incluso com o Node.js)

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/smartflow.git
cd smartflow
```

### 2. Iniciar o Backend
```bash
cd backend
npm install
npm run dev
```
*O servidor da API estará rodando em: `http://localhost:5000`*

### 3. Iniciar o Frontend
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
*Abra a aplicação em: `http://localhost:5173`*

---

## 👥 Contas de Demonstração Rápidas

A tela de login possui botões de preenchimento rápido para testar os diferentes papéis e permissões:

| Perfil | E-mail | Senha | Setor | Escopo de Visibilidade |
|---|---|---|---|---|
| 🛡️ **Admin TI** | `admin@smartflow.com` | `admin123` | **TI** | Visualiza e gerencia **apenas chamados de TI** |
| 🛡️ **Admin RH** | `admin.rh@smartflow.com` | `admin123` | **RH** | Visualiza e gerencia **apenas chamados de RH** (sem acesso a TI) |
| 👤 **Solicitante João** | `user@smartflow.com` | `user123` | **Vendas** | Visualiza **apenas suas próprias solicitações** |
| 👤 **Solicitante Maria** | `maria@smartflow.com` | `user123` | **Financeiro** | Visualiza **apenas suas próprias solicitações** |

---

## 🔌 Principais Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/auth/login` | Autenticação de usuários com payload de perfil e setor |
| `GET` | `/api/auth/users` | Lista usuários cadastrados (*Exclusivo Admin*) |
| `POST` | `/api/auth/users` | Cadastra novo usuário com perfil e setor |
| `GET` | `/api/requests` | Lista solicitações filtradas por permissões do usuário e critérios |
| `GET` | `/api/requests/:id` | Retorna o detalhe completo de um chamado |
| `POST` | `/api/requests` | Cria nova solicitação e executa classificação por IA |
| `PUT` | `/api/requests/:id` | Edita dados, cancela ou atualiza status do chamado |
| `DELETE` | `/api/requests/:id` | Remove permanentemente uma solicitação |
---
*Licença MIT — Fique à vontade para usar e contribuir!*
