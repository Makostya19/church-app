import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Reviews from '../components/common/Reviews';

const ShareButtons = ({ title }) => {
  const url = window.location.href;
  const share = (platform) => {
    const links = {
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
      return;
    }
    window.open(links[platform], '_blank');
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
      <p style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>Share this event</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { platform: 'telegram', label: 'Telegram', bg: '#2AABEE', icon: '✈️' },
          { platform: 'whatsapp', label: 'WhatsApp', bg: '#25D366', icon: '💬' },
          { platform: 'facebook', label: 'Facebook', bg: '#1877F2', icon: 'f' },
          { platform: 'copy', label: 'Copy Link', bg: '#64748b', icon: '🔗' },
        ].map(btn => (
          <button key={btn.platform} onClick={() => share(btn.platform)} style={{
            padding: '0.6rem 1.2rem', background: btn.bg, color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <span>{btn.icon}</span> {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    client.get(`/events/${id}`).then(res => setEvent(res.data.event)).catch(() => {});
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) { toast.info('Please login to add favorites'); return; }
    try {
      if (isFavorite) {
        await client.delete('/favorites', { data: { targetType: 'event', targetId: id } });
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await client.post('/favorites', { targetType: 'event', targetId: id });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (err) { toast.error('Something went wrong'); }
  };

  if (!event) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>
      <div style={{ fontSize: '3rem' }}>⏳</div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div>
      {event.image_url ? (
        <div style={{ height: '350px', overflow: 'hidden', position: 'relative' }}>
          <img src={`http://localhost:5000${event.image_url}`} alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
        </div>
      ) : (
        <div style={{ height: '200px', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }} />
      )}

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: '#2563eb' }}>Home</Link> → <Link to="/events" style={{ color: '#2563eb' }}>Events</Link> → {event.title}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>{event.category}</span>
                <span style={{ background: event.status === 'published' ? '#f0fdf4' : '#fef9c3', color: event.status === 'published' ? '#16a34a' : '#ca8a04', padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>{event.status}</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a2e', lineHeight: 1.3 }}>{event.title}</h1>
            </div>
            <button onClick={toggleFavorite} style={{
              background: isFavorite ? '#fee2e2' : '#f1f5f9',
              color: isFavorite ? '#dc2626' : '#64748b',
              border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px',
              fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              {isFavorite ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', margin: '2rem 0', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Date & Time</p>
              <p style={{ color: '#1a1a2e', fontWeight: '600' }}>📅 {new Date(event.event_date).toLocaleString()}</p>
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Location</p>
              <p style={{ color: '#1a1a2e', fontWeight: '600' }}>📍 {event.location}</p>
            </div>
            {event.capacity && (
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Capacity</p>
                <p style={{ color: '#1a1a2e', fontWeight: '600' }}>👥 {event.capacity} people</p>
              </div>
            )}
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>About this event</h3>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1rem' }}>{event.description}</p>

          <ShareButtons title={event.title} />
          <Reviews targetType="event" targetId={id} />
        </div>
      </div>
    </div>
  );
};

export default EventDetail;