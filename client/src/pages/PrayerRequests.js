import { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PrayerRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', isPrivate: false });
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await client.get('/prayer-requests');
      setRequests(res.data.items);
    } catch (err) {}
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editItem) {
        await client.put(`/prayer-requests/${editItem.id}`, form);
        toast.success('Prayer request updated!');
      } else {
        await client.post('/prayer-requests', form);
        toast.success('Prayer request submitted!');
      }
      setShowForm(false);
      setEditItem(null);
      setForm({ title: '', description: '', isPrivate: false });
      fetchRequests();
    } catch (err) {
      toast.error('Failed to save');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prayer request?')) return;
    try {
      await client.delete(`/prayer-requests/${id}`);
      toast.success('Deleted!');
      fetchRequests();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title, description: item.description, isPrivate: item.is_private });
    setShowForm(true);
  };

  const statusColors = {
    submitted: { bg: '#eff6ff', color: '#2563eb' },
    in_review: { bg: '#fef9c3', color: '#ca8a04' },
    approved: { bg: '#f0fdf4', color: '#16a34a' },
    archived: { bg: '#f1f5f9', color: '#64748b' },
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>🙏 Prayer Requests</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Share your prayer needs with our community</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button onClick={() => { setShowForm(!showForm); setEditItem(null); setForm({ title: '', description: '', isPrivate: false }); }}
            style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ New Prayer Request'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '1.5rem' }}>{editItem ? 'Edit Request' : 'New Prayer Request'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={inputStyle} placeholder="Brief title of your prayer request" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={4} style={inputStyle} placeholder="Share more details..." />
              </div>
              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="isPrivate" checked={form.isPrivate} onChange={e => setForm({...form, isPrivate: e.target.checked})} />
                <label htmlFor="isPrivate" style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Keep this private (only visible to admins)</label>
              </div>
              <button type="submit" disabled={loading} style={{ padding: '0.75rem 2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                {loading ? 'Saving...' : editItem ? 'Update' : 'Submit'}
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
              <p style={{ color: '#64748b' }}>No prayer requests yet. Share your first one!</p>
            </div>
          ) : requests.map(req => (
            <div key={req.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ background: statusColors[req.status]?.bg || '#f1f5f9', color: statusColors[req.status]?.color || '#64748b', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {req.status}
                    </span>
                    {req.is_private && <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>🔒 Private</span>}
                  </div>
                  <h3 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '0.5rem' }}>{req.title}</h3>
                  <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.95rem' }}>{req.description}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {req.user_name && `By ${req.user_name} • `}{new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
                {(user?.id === req.created_by_id || user?.role === 'admin') && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {user?.id === req.created_by_id && (
                      <button onClick={() => handleEdit(req)} style={{ padding: '0.4rem 0.9rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(req.id)} style={{ padding: '0.4rem 0.9rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrayerRequests;