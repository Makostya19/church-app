const pool = require('../config/db');

const getPrayerRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let i = 1;

    if (req.user.role !== 'admin') {
      conditions.push(`created_by_id = $${i}`);
      values.push(req.user.id);
      i++;
    }
    if (status) {
      conditions.push(`status = $${i}`);
      values.push(status);
      i++;
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const countResult = await pool.query(`SELECT COUNT(*) FROM prayer_requests ${where}`, values);
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const result = await pool.query(
      `SELECT pr.*, u.name as user_name FROM prayer_requests pr 
       JOIN users u ON pr.created_by_id = u.id
       ${where} ORDER BY pr.created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
      values
    );

    res.json({ success: true, items: result.rows, page: +page, limit: +limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createPrayerRequest = async (req, res) => {
  try {
    const { title, description, isPrivate } = req.body;
    const result = await pool.query(
      'INSERT INTO prayer_requests (title, description, is_private, created_by_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, description, isPrivate || false, req.user.id]
    );
    res.status(201).json({ success: true, prayerRequest: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updatePrayerRequest = async (req, res) => {
  try {
    const { title, description, isPrivate } = req.body;
    const result = await pool.query(
      'UPDATE prayer_requests SET title=$1, description=$2, is_private=$3, updated_at=NOW() WHERE id=$4 AND created_by_id=$5 RETURNING *',
      [title, description, isPrivate || false, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, prayerRequest: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deletePrayerRequest = async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? 'id=$1' : 'id=$1 AND created_by_id=$2';
    const values = req.user.role === 'admin' ? [req.params.id] : [req.params.id, req.user.id];
    const result = await pool.query(`DELETE FROM prayer_requests WHERE ${where} RETURNING id`, values);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['submitted', 'in_review', 'approved', 'archived'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    const result = await pool.query(
      'UPDATE prayer_requests SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json({ success: true, prayerRequest: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getPrayerRequests, createPrayerRequest, updatePrayerRequest, deletePrayerRequest, updateStatus };