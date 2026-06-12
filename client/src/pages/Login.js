import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import client from '../api/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach(e => { fieldErrors[e.field] = e.message; });
        setErrors(fieldErrors);
      } else {
        toast.error(msg);
      }
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await client.post('/auth/sns/google', { providerToken: credentialResponse.credential });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (err) { toast.error('Google login failed'); }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '0.85rem 1rem',
    border: `2px solid ${errors[field] ? '#dc2626' : '#e2e8f0'}`,
    borderRadius: '10px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>⛪</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: '#64748b' }}>Sign in to your church community account</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors({...errors, email: ''}); }}
                placeholder="your@email.com" style={inputStyle('email')}
                onFocus={e => e.target.style.borderColor = errors.email ? '#dc2626' : '#2563eb'}
                onBlur={e => e.target.style.borderColor = errors.email ? '#dc2626' : '#e2e8f0'} />
              {errors.email && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.email}</p>}
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors({...errors, password: ''}); }}
                placeholder="••••••••" style={inputStyle('password')}
                onFocus={e => e.target.style.borderColor = errors.password ? '#dc2626' : '#2563eb'}
                onBlur={e => e.target.style.borderColor = errors.password ? '#dc2626' : '#e2e8f0'} />
              {errors.password && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>⚠️ {errors.password}</p>}
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.9rem', background: loading ? '#94a3b8' : '#2563eb', color: 'white',
              border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '1rem'
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google login failed')} />
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: '600' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;