import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const Ministries = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    client.get('/ministries').then(res => setMinistries(res.data.items)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>⛪ Ministries</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Discover our church ministries and get involved</p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading...</div>
        ) : ministries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⛪</div>
            <p style={{ color: '#64748b' }}>No ministries yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {ministries.map(ministry => (
              <Link to={`/ministries/${ministry.id}`} key={ministry.id}>
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}>
                  {ministry.image_url ? (
                    <img src={`http://localhost:5000${ministry.image_url}`} alt={ministry.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '120px', background: 'linear-gradient(135deg, #2563eb, #1a1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>⛪</div>
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.5rem' }}>{ministry.name}</h3>
                    {ministry.description && <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>{ministry.description.slice(0, 100)}...</p>}
                    {ministry.leader_name && <p style={{ color: '#475569', fontSize: '0.9rem' }}>👤 Leader: {ministry.leader_name}</p>}
                    {ministry.contact_email && <p style={{ color: '#475569', fontSize: '0.9rem' }}>✉️ {ministry.contact_email}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ministries;