const pool = require('../config/db');

const getFavorites = async (req, res) => {
  try {
    const { page = 1, limit = 10, targetType } = req.query;
    const offset = (page - 1) * limit;
    const conditions = ['user_id = $1'];
    const values = [req.user.id];
    let i = 2;

    if (targetType) {
      conditions.push(`target_type = $${i}`);
      values.push(targetType);
      i++;
    }

    const where = 'WHERE ' + conditions.join(' AND ');
    const countResult = await pool.query(`SELECT COUNT(*) FROM favorites ${where}`, values);
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const result = await pool.query(
      `SELECT * FROM favorites ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
      values
    );

    res.json({ success: true, items: result.rows, page: +page, limit: +limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { targetType, targetId } = req.body;
    const allowed = ['event', 'announcement'];
    if (!allowed.includes(targetType)) {
      return res.status(400).json({ success: false, message: 'Invalid target type' });
    }
    const result = await pool.query(
      'INSERT INTO favorites (user_id, target_type, target_id) VALUES ($1,$2,$3) RETURNING *',
      [req.user.id, targetType, targetId]
    );
    res.status(201).json({ success: true, favorite: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Already in favorites' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { targetType, targetId } = req.body;
    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id=$1 AND target_type=$2 AND target_id=$3 RETURNING id',
      [req.user.id, targetType, targetId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };