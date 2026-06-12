import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Reviews from '../components/common/Reviews';

const ResourceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [resource, setResource] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    client.get(`/resources/${id}`).then(res => setResource(res.data.resource)).catch(() => {});
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) { toast.info('Please login to add favorites'); return; }
    try {
      if (isFavorite) {
        await client.delete('/favorites', { data: { targetType: 'resource', targetId: id } });
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await client.post('/favorites', { targetType: 'resource', targetId: id });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (err) { toast.error('Something went wrong'); }
  };

  const typeIcons = { video: '🎥', audio: '🎵', document: '📄', link: '🔗', other: '📦' };

  if (!resource) return (
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
          <Link to="/" style={{ color: '#2563eb' }}>Home</Link> → <Link to="/resources" style={{ color: '#2563eb' }}>Resources</Link> → {resource.title}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{typeIcons[resource.type] || '📦'}</span>
                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', alignSelf: 'center' }}>{resource.type}</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a2e', lineHeight: 1.3 }}>{resource.title}</h1>
            </div>
            <button onClick={toggleFavorite} style={{
              background: isFavorite ? '#fee2e2' : '#f1f5f9',
              color: isFavorite ? '#dc2626' : '#64748b',
              border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '1rem'
            }}>
              {isFavorite ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>

          {resource.description && (
            <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1rem', margin: '1.5rem 0' }}>{resource.description}</p>
          )}

          {resource.url && (
            <a href={resource.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem',
              borderRadius: '10px', fontWeight: '600', textDecoration: 'none', marginBottom: '1.5rem'
            }}>
              🔗 Open Resource
            </a>
          )}

          <Reviews targetType="resource" targetId={id} />
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;