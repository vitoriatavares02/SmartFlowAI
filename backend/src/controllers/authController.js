const { pool, isInMemory, getInMemoryUsers } = require('../database/connection');

// Login user
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios' });
    }

    if (isInMemory()) {
      const user = getInMemoryUsers().find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }

      // Hide password
      const { password: _, ...userPayload } = user;
      return res.json({
        success: true,
        message: 'Login realizado com sucesso!',
        user: userPayload
      });
    }

    // MySQL Authentication
    const [rows] = await pool.query('SELECT id, name, email, password, role, department FROM users WHERE email = ?', [email]);
    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const { password: _, ...userPayload } = rows[0];
    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: userPayload
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ success: false, message: 'Erro interno no login' });
  }
}

// Get all users (Admin only)
async function getUsers(req, res) {
  try {
    if (isInMemory()) {
      const safeUsers = getInMemoryUsers().map(({ password, ...u }) => u);
      return res.json({ success: true, data: safeUsers });
    }

    const [rows] = await pool.query('SELECT id, name, email, role, department, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar usuários' });
  }
}

// Create new user (Admin only)
async function createUser(req, res) {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nome, e-mail e senha são obrigatórios' });
    }

    const assignedRole = role || 'Solicitante';
    const assignedDept = department || 'Geral';

    if (isInMemory()) {
      const existing = getInMemoryUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'Este e-mail já está cadastrado' });
      }

      const newUser = {
        id: Math.floor(10 + Math.random() * 90),
        name,
        email,
        password,
        role: assignedRole,
        department: assignedDept,
        created_at: new Date().toISOString()
      };

      getInMemoryUsers().unshift(newUser);

      const { password: _, ...userPayload } = newUser;
      return res.status(201).json({
        success: true,
        message: `Usuário ${name} (${assignedRole}) criado com sucesso!`,
        user: userPayload
      });
    }

    // MySQL Insert
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Este e-mail já está cadastrado' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, assignedRole, assignedDept]
    );

    res.status(201).json({
      success: true,
      message: `Usuário ${name} (${assignedRole}) criado com sucesso!`,
      user: { id: result.insertId, name, email, role: assignedRole, department: assignedDept }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar usuário' });
  }
}

// Get single user by ID
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (isInMemory()) {
      const user = getInMemoryUsers().find(u => u.id === parseInt(id));
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
      }
      const { password: _, ...userPayload } = user;
      return res.json({ success: true, data: userPayload });
    }

    const [rows] = await pool.query('SELECT id, name, email, role, department, created_at FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar usuário' });
  }
}

// Update existing user (Admin only)
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password, role, department } = req.body;

    if (isInMemory()) {
      const userIndex = getInMemoryUsers().findIndex(u => u.id === parseInt(id));
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
      }

      if (email) {
        const existing = getInMemoryUsers().find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== parseInt(id));
        if (existing) {
          return res.status(400).json({ success: false, message: 'Este e-mail já está em uso por outro usuário' });
        }
        getInMemoryUsers()[userIndex].email = email;
      }

      if (name) getInMemoryUsers()[userIndex].name = name;
      if (password) getInMemoryUsers()[userIndex].password = password;
      if (role) getInMemoryUsers()[userIndex].role = role;
      if (department) getInMemoryUsers()[userIndex].department = department;

      const { password: _, ...userPayload } = getInMemoryUsers()[userIndex];
      return res.json({
        success: true,
        message: `Usuário ${userPayload.name} atualizado com sucesso!`,
        user: userPayload
      });
    }

    // Database Update
    const [existingUser] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    if (email) {
      const [emailCheck] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
      if (emailCheck.length > 0) {
        return res.status(400).json({ success: false, message: 'Este e-mail já está em uso por outro usuário' });
      }
    }

    if (password && password.trim() !== '') {
      await pool.query(
        `UPDATE users SET 
          name = COALESCE(?, name), 
          email = COALESCE(?, email), 
          password = ?, 
          role = COALESCE(?, role), 
          department = COALESCE(?, department) 
         WHERE id = ?`,
        [name || null, email || null, password, role || null, department || null, id]
      );
    } else {
      await pool.query(
        `UPDATE users SET 
          name = COALESCE(?, name), 
          email = COALESCE(?, email), 
          role = COALESCE(?, role), 
          department = COALESCE(?, department) 
         WHERE id = ?`,
        [name || null, email || null, role || null, department || null, id]
      );
    }

    const [updatedRows] = await pool.query('SELECT id, name, email, role, department FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso!',
      user: updatedRows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
  }
}

// Delete user (Admin only)
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (isInMemory()) {
      const userIndex = getInMemoryUsers().findIndex(u => u.id === parseInt(id));
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
      }
      getInMemoryUsers().splice(userIndex, 1);
      return res.json({ success: true, message: 'Usuário removido com sucesso' });
    }

    const [rows] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'Usuário removido com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao excluir usuário' });
  }
}

module.exports = {
  login,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
