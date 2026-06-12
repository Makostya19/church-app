import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [stats, setStats] = useState({ events: 0, announcements: 0 });

  useEffect(() => {
    client.get('/events?limit=3').then(res => {
      setEvents(res.data.items);
      setStats(s => ({...s, events: res.data.total}));
    }).catch(() => {});
    client.get('/announcements?limit=3').then(res => {
      setAnnouncements(res.data.items);
      setStats(s => ({...s, announcements: res.data.total}));
    }).catch(() => {});
    client.get('/ministries').then(res => setMinistries(res.data.items.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', color: 'white', padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⛪</div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', lineHeight: 1.2 }}>
            Welcome to Our Church Community
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2.5rem' }}>
            Stay connected, stay inspired. Find events, announcements, and community updates all in one place.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/events" style={{ background: '#2563eb', color: 'white', padding: '0.9rem 2.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '1rem', textDecoration: 'none' }}>View Events</Link>
            <Link to="/register" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)', padding: '0.9rem 2.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '1rem', textDecoration: 'none' }}>Join Community</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: '#2563eb', padding: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
          {[
            { label: 'Total Events', value: stats.events },
            { label: 'Announcements', value: stats.announcements },
            { label: 'Ministries', value: ministries.length },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stat.value}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a2e' }}>Upcoming Events</h2>
          <Link to="/events" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>View All →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', gridColumn: '1/-1' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <p style={{ color: '#94a3b8' }}>No events yet</p>
            </div>
          ) : events.map(event => (
            <Link to={`/events/${event.id}`} key={event.id} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}>
                {event.image_url ? (
                  <img src={`http://localhost:5000${event.image_url}`} alt={event.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '120px', background: 'linear-gradient(135deg, #2563eb, #1a1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📅</div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>{event.category}</span>
                  <h3 style={{ margin: '0.75rem 0 0.5rem', fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e' }}>{event.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0' }}>📅 {new Date(event.event_date).toLocaleDateString()}</p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>📍 {event.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ministries */}
      <div style={{ background: '#f1f5f9', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a2e' }}>Our Ministries</h2>
            <Link to="/ministries" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {ministries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', gridColumn: '1/-1' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛪</div>
                <p style={{ color: '#94a3b8' }}>No ministries yet</p>
              </div>
            ) : ministries.map(ministry => (
              <Link to={`/ministries/${ministry.id}`} key={ministry.id} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>⛪</div>
                  <h3 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '0.5rem' }}>{ministry.name}</h3>
                  {ministry.description && <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>{ministry.description.slice(0, 80)}...</p>}
                  {ministry.leader_name && <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '0.5rem' }}>👤 {ministry.leader_name}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a2e' }}>Latest Announcements</h2>
          <Link to="/announcements" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>View All →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {announcements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', gridColumn: '1/-1' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📢</div>
              <p style={{ color: '#94a3b8' }}>No announcements yet</p>
            </div>
          ) : announcements.map(ann => (
            <Link to={`/announcements/${ann.id}`} key={ann.id} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>{ann.category}</span>
                <h3 style={{ margin: '0.75rem 0 0.5rem', fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e' }}>{ann.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>📅 {new Date(ann.created_at).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to join our community?</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1.1rem' }}>Register today and stay connected with your church family</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{ background: '#2563eb', color: 'white', padding: '0.9rem 2.5rem', borderRadius: '10px', fontWeight: '600', textDecoration: 'none' }}>Get Started</Link>
          <Link to="/prayer-requests" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)', padding: '0.9rem 2.5rem', borderRadius: '10px', fontWeight: '600', textDecoration: 'none' }}>🙏 Prayer Requests</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;