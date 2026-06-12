import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, events: 0, announcements: 0, reviews: 0, averageRating: 0, pendingPrayers: 0 });

  useEffect(() => {
    client.get('/admin/dashboard').then(res => {
      setStats({
        users: res.data.userCount,
        events: res.data.eventCount,
        announcements: res.data.announcementCount,
        reviews: res.data.reviewCount,
        averageRating: res.data.averageRating,
        pendingPrayers: res.data.pendingPrayerCount,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, color: '#2563eb', bg: '#eff6ff', icon: '👥', link: '/admin/users' },
    { label: 'Published Events', value: stats.events, color: '#16a34a', bg: '#f0fdf4', icon: '📅', link: '/admin/events' },
    { label: 'Announcements', value: stats.announcements, color: '#9333ea', bg: '#faf5ff', icon: '📢', link: '/admin/announcements' },
    { label: 'Total Reviews', value: stats.reviews, color: '#f59e0b', bg: '#fffbeb', icon: '⭐', link: '/admin/reviews' },
    { label: 'Avg Rating', value: stats.averageRating, color: '#ef4444', bg: '#fef2f2', icon: '🌟', link: '/admin/reviews' },
    { label: 'Pending Prayers', value: stats.pendingPrayers, color: '#06b6d4', bg: '#ecfeff', icon: '🙏', link: '/admin/prayer-requests' },
  ];

  const actions = [
    { label: 'Manage Events', link: '/admin/events', icon: '📅', color: '#2563eb' },
    { label: 'Manage Announcements', link: '/admin/announcements', icon: '📢', color: '#16a34a' },
    { label: 'Manage Users', link: '/admin/users', icon: '👥', color: '#9333ea' },
    { label: 'AI Image Generator', link: '/admin/ai', icon: '🤖', color: '#7c3aed' },
    { label: 'Ministries', link: '/admin/ministries', icon: '⛪', color: '#0891b2' },
    { label: 'Resources', link: '/admin/resources', icon: '📚', color: '#059669' },
    { label: 'Prayer Requests', link: '/admin/prayer-requests', icon: '🙏', color: '#dc2626' },
    { label: 'Reviews', link: '/admin/reviews', icon: '⭐', color: '#d97706' },
  ];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Welcome back</p>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Admin Dashboard</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 2rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {cards.map(card => (
            <Link to={card.link} key={card.label}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{card.icon}</div>
                  <span style={{ color: card.color, fontSize: '0.85rem', fontWeight: '600' }}>→</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a2e' }}>{card.value}</div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>{card.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {actions.map(action => (
              <Link to={action.link} key={action.label}>
                <div style={{ padding: '1.25rem', borderRadius: '12px', border: '2px solid #e2e8f0', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{action.icon}</div>
                  <p style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '0.9rem' }}>{action.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;