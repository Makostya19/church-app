import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9, sortBy, order });
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      const res = await client.get(`/events?${params}`);
      setEvents(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, [page, category, sortBy, order]);

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Church Events</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Join us for worship, community, and fellowship</p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchEvents()}
              placeholder="Search events..."
              style={{ flex: 1, padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', minWidth: '200px' }} />
            <button onClick={fetchEvents} style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Search
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
              style={{ padding: '0.6rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', background: 'white' }}>
              <option value="">All Categories</option>
              <option value="worship">Worship</option>
              <option value="community">Community</option>
              <option value="youth">Youth</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
              style={{ padding: '0.6rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', background: 'white' }}>
              <option value="created_at">Newest First</option>
              <option value="event_date">Event Date</option>
              <option value="title">Title A-Z</option>
            </select>
            <select value={order} onChange={e => { setOrder(e.target.value); setPage(1); }}
              style={{ padding: '0.6rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', background: 'white' }}>
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', gridColumn: '1/-1' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                <p style={{ color: '#94a3b8' }}>No events found</p>
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
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontWeight: '600',
              background: p === page ? '#2563eb' : 'white', color: p === page ? 'white' : '#64748b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer'
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;