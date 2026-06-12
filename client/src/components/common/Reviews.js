import { useState, useEffect } from 'react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Stars = ({ rating, interactive = false, onSelect }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star}
          onClick={() => interactive && onSelect(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          style={{ fontSize: '1.5rem', cursor: interactive ? 'pointer' : 'default', color: star <= (hover || rating) ? '#f59e0b' : '#e2e8f0' }}>
          ★
        </span>
      ))}
    </div>
  );
};

const Reviews = ({ targetType, targetId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await client.get(`/reviews?targetType=${targetType}&targetId=${targetId}`);
      setReviews(res.data.items);
      setAverage(res.data.average);
    } catch (err) {}
  };

  useEffect(() => { fetchReviews(); }, [targetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a rating'); return; }
    setLoading(true);
    try {
      await client.post('/reviews', { targetType, targetId: parseInt(targetId), rating, comment });
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.5rem' }}>
            Reviews & Ratings
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stars rating={Math.round(average)} />
            <span style={{ fontWeight: '700', color: '#1a1a2e' }}>{average}</span>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>({reviews.length} reviews)</span>
          </div>
        </div>
        {user && !showForm && (
          <button onClick={() => setShowForm(true)} style={{
            padding: '0.6rem 1.2rem', background: '#2563eb', color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
          }}>
            Write Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h4 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>Your Review</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rating</label>
            <Stars rating={rating} interactive onSelect={setRating} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Comment (optional)</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              rows={3} maxLength={1000} placeholder="Share your experience..."
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={loading} style={{ padding: '0.6rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1.5rem', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : reviews.map(review => (
          <div key={review.id} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>
                    {review.user_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '0.95rem' }}>{review.user_name}</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Stars rating={review.rating} />
                {review.comment && <p style={{ color: '#475569', marginTop: '0.5rem', lineHeight: '1.6' }}>{review.comment}</p>}
              </div>
              {user?.id === review.user_id && (
                <button onClick={() => handleDelete(review.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;