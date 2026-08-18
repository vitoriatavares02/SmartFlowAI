const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
require('dotenv').config();

let dbPromise = null;
let useInMemory = false;

// Determine DB file path (support Vercel serverless /tmp directory)
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true' || Boolean(process.env.VERCEL_ENV);
const dbPath = isVercel 
  ? path.join('/tmp', 'smartflow.db') 
  : path.resolve(__dirname, '../../', process.env.DB_PATH || 'smartflow.db');

// Mock fallback storage for in-memory mode if sqlite fails
const inMemoryUsers = [
  { id: 1, name: 'Admin SmartFlow (TI)', email: 'admin@smartflow.com', password: 'admin123', role: 'Administrador', department: 'TI', created_at: new Date().toISOString() },
  { id: 2, name: 'João Silva', email: 'user@smartflow.com', password: 'user123', role: 'Solicitante', department: 'Vendas', created_at: new Date().toISOString() },
  { id: 3, name: 'Maria Oliveira', email: 'maria@smartflow.com', password: 'user123', role: 'Solicitante', department: 'Financeiro', created_at: new Date().toISOString() },
  { id: 4, name: 'Admin RH (Recursos Humanos)', email: 'admin.rh@smartflow.com', password: 'admin123', role: 'Administrador', department: 'RH', created_at: new Date().toISOString() }
];

const inMemoryDatabase = [
  { id: 248, user_id: 2, user_name: 'João Silva', title: 'Compra de notebook para desenvolvimento', description: 'Preciso de um notebook de alta performance para trabalhar com desenvolvimento de software e modelos de inteligência artificial.', category: 'Equipamentos', priority: 'Alta', department: 'TI', status: 'Pendente', ai_keywords: ['notebook', 'desenvolvimento', 'hardware'], created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), updated_at: new Date().toISOString() },
  { id: 247, user_id: 3, user_name: 'Maria Oliveira', title: 'Acesso ao ambiente de staging e produção', description: 'Solicito liberação de credenciais de acesso ao servidor de testes e banco de dados de staging.', category: 'Acesso ao sistema', priority: 'Média', department: 'TI', status: 'Em Andamento', ai_keywords: ['acesso', 'credenciais', 'staging', 'banco de dados'], created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), updated_at: new Date().toISOString() },
  { id: 246, user_id: 2, user_name: 'João Silva', title: 'Solicitação de agendamento de férias', description: 'Gostaria de solicitar o agendamento de 15 dias de férias para o próximo mês de setembro.', category: 'Recursos Humanos', priority: 'Baixa', department: 'RH', status: 'Resolvido', ai_keywords: ['férias', 'agendamento', 'rh'], created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), updated_at: new Date().toISOString() },
  { id: 245, user_id: 3, user_name: 'Maria Oliveira', title: 'Ajuste e conferência de folha de pagamento', description: 'Gostaria de solicitar a revisão do cálculo do vale transporte deste mês.', category: 'Recursos Humanos', priority: 'Média', department: 'RH', status: 'Pendente', ai_keywords: ['folha de pagamento', 'benefícios', 'rh'], created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), updated_at: new Date().toISOString() }
];

async function initDatabase() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Create Tables
    await db.exec(`
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
    `);

    // Seed/Sync initial users
    for (const u of inMemoryUsers) {
      await db.run(
        `INSERT OR IGNORE INTO users (id, name, email, password, role, department, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, u.password, u.role, u.department, u.created_at]
      );
    }
    for (const r of inMemoryDatabase) {
      await db.run(
        `INSERT OR IGNORE INTO requests (id, user_id, title, description, category, priority, department, status, ai_keywords, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r.id, r.user_id, r.title, r.description, r.category, r.priority, r.department, r.status, JSON.stringify(r.ai_keywords), r.created_at, r.updated_at]
      );
    }

    console.log(`✅ SQLite conectado e pronto! (${dbPath})`);
    return db;
  } catch (err) {
    console.warn('⚠️ Não foi possível inicializar o SQLite. Utilizando armazenamento em memória.', err);
    useInMemory = true;
    return null;
  }
}

dbPromise = initDatabase();

// Unified pool interface compatible with MySQL controllers
const pool = {
  async query(sql, params = []) {
    const db = await dbPromise;
    if (!db || useInMemory) {
      throw new Error('Banco de dados operando em memória temporária.');
    }

    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('SELECT')) {
      const rows = await db.all(sql, params);
      return [rows];
    } else {
      const result = await db.run(sql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }];
    }
  }
};

module.exports = {
  pool,
  dbPromise,
  isInMemory: () => useInMemory,
  getInMemoryDb: () => inMemoryDatabase,
  getInMemoryUsers: () => inMemoryUsers
};
