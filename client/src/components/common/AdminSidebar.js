import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
    { to: '/admin/events', label: 'Events', icon: '📅' },
    { to: '/admin/announcements', label: 'Announcements', icon: '📢' },
    { to: '/admin/ministries', label: 'Ministries', icon: '⛪' },
    { to: '/admin/resources', label: 'Resources', icon: '📚' },
    { to: '/admin/prayer-requests', label: 'Prayer Requests', icon: '🙏' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/reviews', label: 'Reviews', icon: '⭐' },
    { to: '/admin/ai', label: 'AI Generator', icon: '🤖' },
  ];

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname.startsWith(link.to);
  };

  return (
    <div style={{
      width: '240px', minHeight: '100vh', background: '#1a1a2e',
      padding: '1.5rem 0', flexShrink: 0
    }}>
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</p>
      </div>
      <nav>
        {links.map(link => (
          <Link key={link.to} to={link.to} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.75rem 1.5rem', textDecoration: 'none',
            background: isActive(link) ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
            borderLeft: isActive(link) ? '3px solid #2563eb' : '3px solid transparent',
            color: isActive(link) ? 'white' : '#94a3b8',
            fontWeight: isActive(link) ? '600' : '400',
            fontSize: '0.9rem', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { if (!isActive(link)) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; } }}
            onMouseLeave={e => { if (!isActive(link)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}>
            <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: '1.5rem', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
          <span>←</span> Back to Site
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;