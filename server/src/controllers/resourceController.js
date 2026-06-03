const pool = require('../config/db');

const getResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, type } = req.query;
    const offset = (page - 1) * limit;
    const conditions = ["status = 'published'"];
    const values = [];
    let i = 1;

    if (search) {
      conditions.push(`(title ILIKE $${i} OR description ILIKE $${i})`);
      values.push(`%${search}%`);
      i++;
    }
    if (category) {
      conditions.push(`category = $${i}`);
      values.push(category);
      i++;
    }
    if (type) {
      conditions.push(`type = $${i}`);
      values.push(type);
      i++;
    }

    const where = 'WHERE ' + conditions.join(' AND ');
    const countResult = await pool.query(`SELECT COUNT(*) FROM resources ${where}`, values);
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const result = await pool.query(
      `SELECT * FROM resources ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
      values
    );

    res.json({ success: true, items: result.rows, page: +page, limit: +limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getResource = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resources WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, resource: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createResource = async (req, res) => {
  try {
    const { title, description, type, category, url } = req.body;
    const result = await pool.query(
      'INSERT INTO resources (title, description, type, category, url, created_by_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, description, type, category, url, req.user.id]
    );
    res.status(201).json({ success: true, resource: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateResource = async (req, res) => {
  try {
    const { title, description, type, category, url } = req.body;
    const result = await pool.query(
      'UPDATE resources SET title=$1, description=$2, type=$3, category=$4, url=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
      [title, description, type, category, url, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, resource: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateResourceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['draft', 'published', 'archived'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    const result = await pool.query(
      'UPDATE resources SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json({ success: true, resource: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteResource = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM resources WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getResources, getResource, createResource, updateResource, updateResourceStatus, deleteResource };