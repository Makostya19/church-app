import { useState, useEffect } from 'react';
import client from '../../api/client';
import { toast } from 'react-toastify';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('event');

  const fetchReviews = async () => {
    try {
      const res = await client.get(`/reviews?targetType=${filter}&targetId=0&adminView=true`);
      setReviews(res.data.items || []);
    } catch (err) {}
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const moderateReview = async (id, status) => {
    try {
      await client.patch(`/reviews/${id}/moderate`, { status });
      toast.success('Review moderated!');
      fetchReviews();
    } catch (err) { toast.error('Failed'); }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await client.delete(`/reviews/${id}`);
      toast.success('Deleted!');
      fetchReviews();
    } catch (err) { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Admin Panel</p>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>⭐ Manage Reviews</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '2rem' }}>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>To view reviews for a specific event or announcement, go to the event/announcement detail page. Reviews are shown there with moderation options.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/events" style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', borderRadius: '10px', fontWeight: '600', textDecoration: 'none' }}>View Events →</a>
            <a href="/announcements" style={{ padding: '0.75rem 1.5rem', background: '#16a34a', color: 'white', borderRadius: '10px', fontWeight: '600', textDecoration: 'none' }}>View Announcements →</a>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>How to moderate reviews:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { step: '1', text: 'Go to an Event or Announcement detail page' },
              { step: '2', text: 'Scroll down to the Reviews section' },
              { step: '3', text: 'As admin you can delete any review' },
              { step: '4', text: 'Members can only delete their own reviews' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ width: '32px', height: '32px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>{item.step}</div>
                <p style={{ color: '#475569' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;