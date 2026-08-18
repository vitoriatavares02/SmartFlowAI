-- SmartFlow Database Schema (SQLite Version)
-- Compatible with local file-based database & Vercel Serverless

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Solicitante',
  department TEXT NOT NULL DEFAULT 'Geral',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Geral',
  priority TEXT NOT NULL DEFAULT 'Média',
  department TEXT NOT NULL DEFAULT 'TI',
  status TEXT NOT NULL DEFAULT 'Pendente',
  ai_keywords TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed Users
INSERT OR IGNORE INTO users (id, name, email, password, role, department) VALUES
(1, 'Administrador SmartFlow', 'admin@smartflow.com', 'admin123', 'Administrador', 'TI'),
(2, 'João Silva (Solicitante)', 'user@smartflow.com', 'user123', 'Solicitante', 'Vendas'),
(3, 'Maria Oliveira (Solicitante)', 'maria@smartflow.com', 'user123', 'Solicitante', 'Financeiro');

-- Sample Seed Requests
INSERT OR IGNORE INTO requests (id, user_id, title, description, category, priority, department, status, ai_keywords) VALUES
(248, 2, 'Compra de notebook de alta performance', 'Preciso de um notebook de alto desempenho para trabalhar com desenvolvimento de software e IA.', 'Equipamentos', 'Alta', 'TI', 'Pendente', '["notebook", "desenvolvimento", "hardware"]'),
(247, 3, 'Solicitação de acesso ao servidor de staging', 'Solicito liberação de acesso SSH para a máquina de testes de desenvolvimento.', 'Acesso ao sistema', 'Média', 'TI', 'Em Andamento', '["acesso", "servidor", "ssh", "staging"]'),
(246, 2, 'Aprovação de férias do trimestre', 'Gostaria de agendar minhas férias para o próximo mês conforme alinhado com a liderança.', 'Recursos Humanos', 'Baixa', 'RH', 'Resolvido', '["férias", "agendamento", "rh"]');
