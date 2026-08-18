const { pool, isInMemory, getInMemoryDb } = require('../database/connection');
const { classifyRequest } = require('../services/aiService');

// Get all requests with filter support & calculated dashboard metrics
async function getRequests(req, res) {
  try {
    const { status, category, priority, search, userRole, userDepartment, userId } = req.query;
    
    // Auth context from query or headers
    const role = userRole || req.headers['x-user-role'];
    const dept = userDepartment || req.headers['x-user-department'];
    const uid = userId ? parseInt(userId) : (req.headers['x-user-id'] ? parseInt(req.headers['x-user-id']) : null);

    if (isInMemory()) {
      let items = [...getInMemoryDb()];

      // 1. Role & Department Permission Boundaries
      if (role === 'Solicitante' && uid) {
        // Solicitantes only see their own tickets
        items = items.filter(r => r.user_id === uid);
      } else if (role === 'Administrador') {
        // Department-based Admin restrictions:
        // TI Admins only see TI tickets. Other department admins only see their respective department tickets.
        if (dept && dept !== 'Geral') {
          items = items.filter(r => (r.department || '').toLowerCase() === dept.toLowerCase());
        }
      }

      // 2. User-applied Filters
      if (status && status !== 'Todos') {
        items = items.filter(r => r.status.toLowerCase() === status.toLowerCase());
      }
      if (category && category !== 'Todas') {
        items = items.filter(r => r.category.toLowerCase() === category.toLowerCase());
      }
      if (priority && priority !== 'Todas') {
        items = items.filter(r => r.priority.toLowerCase() === priority.toLowerCase());
      }
      if (search) {
        const query = search.toLowerCase();
        items = items.filter(r => 
          r.title.toLowerCase().includes(query) || 
          r.description.toLowerCase().includes(query)
        );
      }

      // 3. Calculate Metrics based on authorized items scope
      let scopeDb = [...getInMemoryDb()];
      if (role === 'Solicitante' && uid) {
        scopeDb = scopeDb.filter(r => r.user_id === uid);
      } else if (role === 'Administrador' && dept && dept !== 'Geral') {
        scopeDb = scopeDb.filter(r => (r.department || '').toLowerCase() === dept.toLowerCase());
      }

      const total = scopeDb.length;
      const pendentes = scopeDb.filter(r => r.status === 'Pendente').length;
      const altaPrioridade = scopeDb.filter(r => r.priority === 'Alta' || r.priority === 'Crítica').length;
      const resolvidas = scopeDb.filter(r => r.status === 'Resolvido').length;

      return res.json({
        success: true,
        data: items,
        metrics: {
          total,
          pendentes,
          altaPrioridade,
          resolvidas,
          automationRate: '87%',
          avgResolutionTime: '4.2h'
        }
      });
    }

    // SQLite / MySQL Logic with Role & Department enforcement
    let query = `
      SELECT requests.*, users.name as user_name, users.department as user_department
      FROM requests
      LEFT JOIN users ON requests.user_id = users.id
      WHERE 1=1
    `;
    const params = [];

    // 1. Role & Department Permission Boundaries
    if (role === 'Solicitante' && uid) {
      query += ' AND requests.user_id = ?';
      params.push(uid);
    } else if (role === 'Administrador') {
      if (dept && dept !== 'Geral') {
        query += ' AND requests.department = ?';
        params.push(dept);
      }
    }

    // 2. Query Filters
    if (status && status !== 'Todos') {
      query += ' AND requests.status = ?';
      params.push(status);
    }
    if (category && category !== 'Todas') {
      query += ' AND requests.category = ?';
      params.push(category);
    }
    if (priority && priority !== 'Todas') {
      query += ' AND requests.priority = ?';
      params.push(priority);
    }
    if (search) {
      query += ' AND (requests.title LIKE ? OR requests.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY requests.created_at DESC';

    const [rows] = await pool.query(query, params);

    // Parse JSON ai_keywords if string
    const parsedRows = rows.map(r => ({
      ...r,
      ai_keywords: typeof r.ai_keywords === 'string' ? JSON.parse(r.ai_keywords) : r.ai_keywords
    }));

    // Metrics query bounded by user permissions
    let metricsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Pendente' THEN 1 ELSE 0 END) as pendentes,
        SUM(CASE WHEN priority IN ('Alta', 'Crítica') THEN 1 ELSE 0 END) as altaPrioridade,
        SUM(CASE WHEN status = 'Resolvido' THEN 1 ELSE 0 END) as resolvidas
      FROM requests
      WHERE 1=1
    `;
    const metricsParams = [];

    if (role === 'Solicitante' && uid) {
      metricsQuery += ' AND user_id = ?';
      metricsParams.push(uid);
    } else if (role === 'Administrador' && dept && dept !== 'Geral') {
      metricsQuery += ' AND department = ?';
      metricsParams.push(dept);
    }

    const [[metricsResult]] = await pool.query(metricsQuery, metricsParams);

    res.json({
      success: true,
      data: parsedRows,
      metrics: {
        total: metricsResult?.total || 0,
        pendentes: metricsResult?.pendentes || 0,
        altaPrioridade: metricsResult?.altaPrioridade || 0,
        resolvidas: metricsResult?.resolvidas || 0,
        automationRate: '87%',
        avgResolutionTime: '4.2h'
      }
    });
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar solicitações' });
  }
}

// Get single request detail
async function getRequestById(req, res) {
  try {
    const { id } = req.params;

    if (isInMemory()) {
      const item = getInMemoryDb().find(r => r.id === parseInt(id));
      if (!item) {
        return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
      }
      return res.json({ success: true, data: item });
    }

    const [rows] = await pool.query(`
      SELECT requests.*, users.name as user_name, users.department as user_department
      FROM requests
      LEFT JOIN users ON requests.user_id = users.id
      WHERE requests.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
    }

    const item = {
      ...rows[0],
      ai_keywords: typeof rows[0].ai_keywords === 'string' ? JSON.parse(rows[0].ai_keywords) : rows[0].ai_keywords
    };

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Erro ao buscar detalhe:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}

// Create new request with AI classification
async function createRequest(req, res) {
  try {
    const { title, description, user_id, user_name } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Título e descrição são obrigatórios' });
    }

    // Run AI Classification
    const aiResult = await classifyRequest(title, description);

    const newRequest = {
      user_id: user_id ? parseInt(user_id) : null,
      user_name: user_name || 'Solicitante',
      title,
      description,
      category: aiResult.category,
      priority: aiResult.priority,
      department: aiResult.department,
      status: 'Pendente',
      ai_keywords: aiResult.ai_keywords,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isInMemory()) {
      const newId = Math.floor(200 + Math.random() * 800);
      newRequest.id = newId;
      getInMemoryDb().unshift(newRequest);
      return res.status(201).json({
        success: true,
        message: 'Solicitação criada e classificada com sucesso pela IA!',
        data: newRequest
      });
    }

    const [result] = await pool.query(
      `INSERT INTO requests (user_id, title, description, category, priority, department, status, ai_keywords)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newRequest.user_id,
        newRequest.title,
        newRequest.description,
        newRequest.category,
        newRequest.priority,
        newRequest.department,
        newRequest.status,
        JSON.stringify(newRequest.ai_keywords)
      ]
    );

    newRequest.id = result.insertId;

    res.status(201).json({
      success: true,
      message: 'Solicitação criada e classificada com sucesso pela IA!',
      data: newRequest
    });
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    res.status(500).json({ success: false, message: 'Erro ao processar solicitação' });
  }
}

// Update request status or fields (Edit & Cancel support)
async function updateRequest(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status, priority, department, category } = req.body;

    if (isInMemory()) {
      const itemIndex = getInMemoryDb().findIndex(r => r.id === parseInt(id));
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
      }

      const item = getInMemoryDb()[itemIndex];
      const newTitle = title || item.title;
      const newDescription = description || item.description;

      // Re-classify if text changed and no manual overrides
      let aiResult = null;
      if (title || description) {
        aiResult = await classifyRequest(newTitle, newDescription);
      }

      if (title) item.title = title;
      if (description) item.description = description;
      if (status) item.status = status;
      if (priority) item.priority = priority;
      else if (aiResult) item.priority = aiResult.priority;
      if (category) item.category = category;
      else if (aiResult) item.category = aiResult.category;
      if (department) item.department = department;
      else if (aiResult) item.department = aiResult.department;
      if (aiResult) item.ai_keywords = aiResult.ai_keywords;
      item.updated_at = new Date().toISOString();

      return res.json({
        success: true,
        message: status === 'Cancelado' ? 'Solicitação cancelada com sucesso' : 'Solicitação atualizada com sucesso',
        data: item
      });
    }

    const [rows] = await pool.query('SELECT * FROM requests WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
    }

    const current = rows[0];
    const newTitle = title || current.title;
    const newDescription = description || current.description;

    let aiResult = null;
    if (title || description) {
      aiResult = await classifyRequest(newTitle, newDescription);
    }

    const finalCategory = category || (aiResult ? aiResult.category : current.category);
    const finalPriority = priority || (aiResult ? aiResult.priority : current.priority);
    const finalDept = department || (aiResult ? aiResult.department : current.department);
    const finalStatus = status || current.status;
    const finalKeywords = aiResult ? JSON.stringify(aiResult.ai_keywords) : current.ai_keywords;

    await pool.query(
      `UPDATE requests SET 
        title = ?,
        description = ?,
        category = ?,
        priority = ?, 
        department = ?, 
        status = ?, 
        ai_keywords = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newTitle, newDescription, finalCategory, finalPriority, finalDept, finalStatus, finalKeywords, id]
    );

    const [updatedRows] = await pool.query(`
      SELECT requests.*, users.name as user_name, users.department as user_department
      FROM requests
      LEFT JOIN users ON requests.user_id = users.id
      WHERE requests.id = ?
    `, [id]);

    const updatedItem = {
      ...updatedRows[0],
      ai_keywords: typeof updatedRows[0].ai_keywords === 'string' ? JSON.parse(updatedRows[0].ai_keywords) : updatedRows[0].ai_keywords
    };

    res.json({
      success: true,
      message: status === 'Cancelado' ? 'Solicitação cancelada com sucesso' : 'Solicitação atualizada com sucesso',
      data: updatedItem
    });
  } catch (error) {
    console.error('Erro ao atualizar solicitação:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar' });
  }
}

// Delete request
async function deleteRequest(req, res) {
  try {
    const { id } = req.params;

    if (isInMemory()) {
      const itemIndex = getInMemoryDb().findIndex(r => r.id === parseInt(id));
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
      }
      getInMemoryDb().splice(itemIndex, 1);
      return res.json({ success: true, message: 'Solicitação removida com sucesso' });
    }

    await pool.query('DELETE FROM requests WHERE id = ?', [id]);
    res.json({ success: true, message: 'Solicitação removida com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir solicitação:', error);
    res.status(500).json({ success: false, message: 'Erro ao excluir' });
  }
}

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest
};
