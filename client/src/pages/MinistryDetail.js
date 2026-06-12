import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';

const MinistryDetail = () => {
  const { id } = useParams();
  const [ministry, setMinistry] = useState(null);

  useEffect(() => {
    client.get(`/ministries/${id}`).then(res => setMinistry(res.data.ministry)).catch(() => {});
  }, [id]);

  if (!ministry) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>
      <div style={{ fontSize: '3rem' }}>⏳</div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div>
      <div style={{ height: '200px', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }} />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: '#2563eb' }}>Home</Link> → <Link to="/ministries" style={{ color: '#2563eb' }}>Ministries</Link> → {ministry.name}
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1.5rem' }}>{ministry.name}</h1>
          {ministry.description && (
            <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.5rem' }}>{ministry.description}</p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
            {ministry.leader_name && (
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Leader</p>
                <p style={{ color: '#1a1a2e', fontWeight: '600' }}>👤 {ministry.leader_name}</p>
              </div>
            )}
            {ministry.contact_email && (
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Contact</p>
                <p style={{ color: '#1a1a2e', fontWeight: '600' }}>✉️ {ministry.contact_email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinistryDetail;