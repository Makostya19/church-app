import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      const res = await client.get(`/announcements?${params}`);
      setAnnouncements(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchAnnouncements(); }, [page, category]);

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Announcements</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Stay informed with the latest church news</p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchAnnouncements()}
            placeholder="Search announcements..."
            style={{ flex: 1, padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', minWidth: '200px', outline: 'none' }} />
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
            style={{ padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', background: 'white' }}>
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="worship">Worship</option>
            <option value="community">Community</option>
            <option value="youth">Youth</option>
            <option value="other">Other</option>
          </select>
          <button onClick={fetchAnnouncements} style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600' }}>
            Search
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {announcements.length === 0 ? (
              <p style={{ color: '#94a3b8', gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>No announcements found</p>
            ) : announcements.map(ann => (
              <Link to={`/announcements/${ann.id}`} key={ann.id}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}>
                  <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>📢</div>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>{ann.category}</span>
                  <h3 style={{ margin: '0.75rem 0 0.5rem', fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e' }}>{ann.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>📅 {new Date(ann.created_at).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontWeight: '600',
              background: p === page ? '#2563eb' : 'white',
              color: p === page ? 'white' : '#64748b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;