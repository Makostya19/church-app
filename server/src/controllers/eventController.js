const pool = require('../config/db');

const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, sortBy = 'created_at', order = 'DESC' } = req.query;
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

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const allowedSort = ['created_at', 'event_date', 'title'];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countResult = await pool.query(`SELECT COUNT(*) FROM events ${where}`, values);
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const result = await pool.query(
      `SELECT * FROM events ${where} ORDER BY ${sortColumn} ${sortOrder} LIMIT $${i} OFFSET $${i + 1}`,
      values
    );

    res.json({ success: true, items: result.rows, page: +page, limit: +limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getEvent = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, location, category, capacity } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await pool.query(
      'INSERT INTO events (title, description, event_date, location, category, capacity, image_url, created_by_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [title, description, event_date, location, category, capacity || null, imageUrl, req.user.id]
    );
    res.status(201).json({ success: true, event: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { title, description, event_date, location, category, capacity } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const fields = ['title=$1', 'description=$2', 'event_date=$3', 'location=$4', 'category=$5', 'capacity=$6', 'updated_at=NOW()'];
    const values = [title, description, event_date, location, category, capacity || null];
    if (imageUrl) { fields.push(`image_url=$${values.length + 1}`); values.push(imageUrl); }
    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE events SET ${fields.join(',')} WHERE id=$${values.length} RETURNING *`, values
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['draft', 'published', 'cancelled', 'completed', 'archived'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    const result = await pool.query(
      'UPDATE events SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM events WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, updateEventStatus, deleteEvent };