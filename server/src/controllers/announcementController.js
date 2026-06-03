const pool = require('../config/db');

const getAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, sortBy = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    const conditions = ["status = 'published'"];
    const values = [];
    let i = 1;

    if (search) {
      conditions.push(`(title ILIKE $${i} OR content ILIKE $${i})`);
      values.push(`%${search}%`);
      i++;
    }
    if (category) {
      conditions.push(`category = $${i}`);
      values.push(category);
      i++;
    }

    const where = 'WHERE ' + conditions.join(' AND ');
    const allowedSort = ['created_at', 'title'];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countResult = await pool.query(`SELECT COUNT(*) FROM announcements ${where}`, values);
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const result = await pool.query(
      `SELECT * FROM announcements ${where} ORDER BY ${sortColumn} ${sortOrder} LIMIT $${i} OFFSET $${i + 1}`,
      values
    );

    res.json({ success: true, items: result.rows, page: +page, limit: +limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAnnouncement = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.json({ success: true, announcement: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await pool.query(
      'INSERT INTO announcements (title, content, category, image_url, created_by_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [title, content, category, imageUrl, req.user.id]
    );
    res.status(201).json({ success: true, announcement: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const fields = ['title=$1', 'content=$2', 'category=$3', 'updated_at=NOW()'];
    const values = [title, content, category];
    if (imageUrl) { fields.push(`image_url=$${values.length + 1}`); values.push(imageUrl); }
    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE announcements SET ${fields.join(',')} WHERE id=$${values.length} RETURNING *`, values
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.json({ success: true, announcement: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateAnnouncementStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['draft', 'published', 'archived'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    const result = await pool.query(
      'UPDATE announcements SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.json({ success: true, announcement: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM announcements WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, updateAnnouncementStatus, deleteAnnouncement };