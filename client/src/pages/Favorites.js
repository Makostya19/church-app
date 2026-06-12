import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { toast } from 'react-toastify';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const params = filter ? `?targetType=${filter}` : '';
      const res = await client.get(`/favorites${params}`);
      setFavorites(res.data.items);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchFavorites(); }, [filter]);

  const removeFavorite = async (e, targetType, targetId) => {
    e.preventDefault();
    try {
      await client.delete('/favorites', { data: { targetType, targetId } });
      toast.success('Removed from favorites');
      fetchFavorites();
    } catch (err) { toast.error('Failed to remove'); }
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>My Favorites</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Your saved events and announcements</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { value: '', label: 'All' },
            { value: 'event', label: '📅 Events' },
            { value: 'announcement', label: '📢 Announcements' }
          ].map(btn => (
            <button key={btn.value} onClick={() => setFilter(btn.value)} style={{
              padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none',
              fontWeight: '600', fontSize: '0.9rem',
              background: filter === btn.value ? '#2563eb' : 'white',
              color: filter === btn.value ? 'white' : '#64748b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer'
            }}>{btn.label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading...</div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤍</div>
            <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>No favorites yet</h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Start saving events and announcements you love</p>
            <Link to="/events" style={{ background: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '10px', fontWeight: '600' }}>Browse Events</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {favorites.map(fav => (
              <Link to={`/${fav.target_type === 'event' ? 'events' : 'announcements'}/${fav.target_id}`} key={fav.id}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: fav.target_type === 'event' ? '#eff6ff' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      {fav.target_type === 'event' ? '📅' : '📢'}
                    </div>
                    <div>
                      <span style={{ background: fav.target_type === 'event' ? '#eff6ff' : '#f0fdf4', color: fav.target_type === 'event' ? '#2563eb' : '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                        {fav.target_type}
                      </span>
                      <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>Saved on {new Date(fav.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={e => removeFavorite(e, fav.target_type, fav.target_id)} style={{
                    background: '#fee2e2', color: '#dc2626', border: 'none',
                    padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem'
                  }}>Remove</button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;