import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const linkStyle = { color: '#555', fontWeight: '500', fontSize: '0.95rem', textDecoration: 'none' };

  const navLinks = [
    { to: '/events', label: 'Events' },
    { to: '/announcements', label: 'Announcements' },
    { to: '/ministries', label: 'Ministries' },
    { to: '/resources', label: 'Resources' },
  ];

  const memberLinks = [
    { to: '/prayer-requests', label: '🙏 Prayer' },
    { to: '/favorites', label: 'Favorites' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <>
      <nav style={{
        background: 'white', borderBottom: '1px solid #e8e8e8',
        padding: '0 2rem', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', height: '70px', position: 'sticky', top: 0,
        zIndex: 1000, boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.8rem' }}>⛪</span>
          <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1a1a2e' }}>Church App</span>
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }} className="desktop-menu">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={linkStyle}
              onMouseEnter={e => e.target.style.color = '#2563eb'}
              onMouseLeave={e => e.target.style.color = '#555'}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              {memberLinks.map(link => (
                <Link key={link.to} to={link.to} style={linkStyle}
                  onMouseEnter={e => e.target.style.color = '#2563eb'}
                  onMouseLeave={e => e.target.style.color = '#555'}>
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" style={{ color: '#2563eb', fontWeight: '600', background: '#eff6ff', padding: '0.4rem 1rem', borderRadius: '6px', textDecoration: 'none' }}>Admin</Link>
              )}
              <button onClick={handleLogout} style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>Login</Link>
              <Link to="/register" style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '8px', fontWeight: '500', textDecoration: 'none' }}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} className="burger-btn">
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: 'white', borderBottom: '1px solid #e8e8e8', padding: '1rem 2rem', position: 'sticky', top: '70px', zIndex: 999, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} className="mobile-menu">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                style={{ color: '#1a1a2e', fontWeight: '500', textDecoration: 'none', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {memberLinks.map(link => (
                  <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                    style={{ color: '#1a1a2e', fontWeight: '500', textDecoration: 'none', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', width: '100%' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  style={{ color: '#1a1a2e', fontWeight: '500', textDecoration: 'none', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  style={{ background: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .burger-btn { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;