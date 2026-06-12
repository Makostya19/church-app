import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Reviews from '../components/common/Reviews';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [announcement, setAnnouncement] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    client.get(`/announcements/${id}`).then(res => setAnnouncement(res.data.announcement)).catch(() => {});
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) { toast.info('Please login to add favorites'); return; }
    try {
      if (isFavorite) {
        await client.delete('/favorites', { data: { targetType: 'announcement', targetId: id } });
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await client.post('/favorites', { targetType: 'announcement', targetId: id });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (err) { toast.error('Something went wrong'); }
  };

  const share = (platform) => {
    const url = window.location.href;
    const title = announcement?.title || '';
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

  if (!announcement) return (
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
          <Link to="/" style={{ color: '#2563eb' }}>Home</Link> → <Link to="/announcements" style={{ color: '#2563eb' }}>Announcements</Link> → {announcement.title}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>{announcement.category}</span>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a2e', lineHeight: 1.3, marginTop: '1rem' }}>{announcement.title}</h1>
            </div>
            <button onClick={toggleFavorite} style={{
              background: isFavorite ? '#fee2e2' : '#f1f5f9',
              color: isFavorite ? '#dc2626' : '#64748b',
              border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px',
              fontWeight: '600', fontSize: '1rem'
            }}>
              {isFavorite ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>

          <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderRadius: '12px', margin: '1.5rem 0' }}>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>📅 Published: {new Date(announcement.created_at).toLocaleDateString()}</p>
          </div>

          {announcement.image_url && (
            <img src={`http://localhost:5000${announcement.image_url}`} alt={announcement.title}
              style={{ width: '100%', borderRadius: '12px', marginBottom: '1.5rem' }} />
          )}

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>Content</h3>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1rem' }}>{announcement.content}</p>

          {/* Share */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
            <p style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>Share this announcement</p>
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

          <Reviews targetType="announcement" targetId={id} />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;