import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: '#1a1a2e', color: '#94a3b8', padding: '3rem 2rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⛪</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>Church App</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>Connecting our community together through faith, love, and service.</p>
          </div>

          <div>
            <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '1rem', fontSize: '0.95rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { to: '/events', label: 'Events' },
                { to: '/announcements', label: 'Announcements' },
                { to: '/ministries', label: 'Ministries' },
                { to: '/resources', label: 'Resources' },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '1rem', fontSize: '0.95rem' }}>Community</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { to: '/prayer-requests', label: '🙏 Prayer Requests' },
                { to: '/favorites', label: '❤️ Favorites' },
                { to: '/profile', label: '👤 Profile' },
                { to: '/register', label: '✨ Join Us' },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '1rem', fontSize: '0.95rem' }}>API Docs</h4>
            <a href="http://localhost:5000/api/docs" target="_blank" rel="noopener noreferrer"
              style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📖 Swagger Documentation
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #2d3748', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem' }}>© 2026 Church App. All rights reserved.</p>
          <p style={{ fontSize: '0.85rem' }}>Built with React + Node.js + PostgreSQL</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;