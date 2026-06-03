const pool = require('../config/db');

const getMinistries = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ministries ORDER BY name ASC');
    res.json({ success: true, items: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMinistry = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ministries WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, ministry: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createMinistry = async (req, res) => {
  try {
    const { name, description, leaderName, contactEmail } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await pool.query(
      'INSERT INTO ministries (name, description, leader_name, contact_email, image_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, description, leaderName, contactEmail, imageUrl]
    );
    res.status(201).json({ success: true, ministry: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ success: false, message: 'Ministry name already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateMinistry = async (req, res) => {
  try {
    const { name, description, leaderName, contactEmail } = req.body;
    const result = await pool.query(
      'UPDATE ministries SET name=$1, description=$2, leader_name=$3, contact_email=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
      [name, description, leaderName, contactEmail, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, ministry: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteMinistry = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM ministries WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getMinistries, getMinistry, createMinistry, updateMinistry, deleteMinistry };