const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pool = require('../config/db');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, passwordHash]
    );
    const user = result.rows[0];
    const token = generateToken(user);
    res.status(201).json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const user = result.rows[0];

    if (user.is_active === false) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { providerToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: providerToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: providerId, email, name, picture } = payload;

    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user;

    if (result.rows.length > 0) {
      user = result.rows[0];
      if (user.is_active === false) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated' });
      }
      if (!user.provider_id) {
        await pool.query('UPDATE users SET provider=$1, provider_id=$2, avatar_url=$3 WHERE id=$4',
          ['google', providerId, picture, user.id]);
      }
    } else {
      const newUser = await pool.query(
        'INSERT INTO users (name, email, provider, provider_id, avatar_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [name, email, 'google', providerId, picture]
      );
      user = newUser.rows[0];
    }

    const token = generateToken(user);
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Google login failed' });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { register, login, googleLogin, getMe, logout };