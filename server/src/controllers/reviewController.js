const pool = require('../config/db');

const getReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    const result = await pool.query(
      `SELECT r.*, u.name as user_name FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.target_type = $1 AND r.target_id = $2 AND r.status = 'active'
       ORDER BY r.created_at DESC`,
      [targetType, targetId]
    );
    const avgResult = await pool.query(
      'SELECT AVG(rating)::numeric(3,1) as average FROM reviews WHERE target_type=$1 AND target_id=$2 AND status=$3',
      [targetType, targetId, 'active']
    );
    res.json({ success: true, items: result.rows, average: avgResult.rows[0].average || 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createReview = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    const result = await pool.query(
      'INSERT INTO reviews (user_id, target_type, target_id, rating, comment) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.user.id, targetType, targetId, rating, comment]
    );
    res.status(201).json({ success: true, review: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'You already reviewed this' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM reviews WHERE id=$1 AND user_id=$2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const moderateReview = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE reviews SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json({ success: true, review: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getReviews, createReview, deleteReview, moderateReview };