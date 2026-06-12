import { useState, useEffect } from 'react';
import client from '../../api/client';
import { toast } from 'react-toastify';

const AdminPrayerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('');

  const fetchRequests = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await client.get(`/prayer-requests${params}`);
      setRequests(res.data.items);
    } catch (err) {}
  };

  useEffect(() => { fetchRequests(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await client.patch(`/prayer-requests/${id}/status`, { status });
      toast.success('Status updated!');
      fetchRequests();
    } catch (err) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prayer request?')) return;
    try {
      await client.delete(`/prayer-requests/${id}`);
      toast.success('Deleted!');
      fetchRequests();
    } catch (err) { toast.error('Failed'); }
  };

  const statusColors = {
    submitted: { bg: '#eff6ff', color: '#2563eb' },
    in_review: { bg: '#fef9c3', color: '#ca8a04' },
    approved: { bg: '#f0fdf4', color: '#16a34a' },
    archived: { bg: '#f1f5f9', color: '#64748b' },
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Admin Panel</p>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>🙏 Prayer Requests</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['', 'submitted', 'in_review', 'approved', 'archived'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '0.9rem',
              background: filter === s ? '#2563eb' : 'white', color: filter === s ? 'white' : '#64748b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer'
            }}>{s === '' ? 'All' : s}</button>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['User', 'Title', 'Private', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => (
                <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.9rem' }}>{req.user_name}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600', color: '#1a1a2e' }}>{req.title}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    {req.is_private ? <span style={{ color: '#ca8a04' }}>🔒 Yes</span> : <span style={{ color: '#16a34a' }}>🌐 No</span>}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <select value={req.status} onChange={e => updateStatus(req.id, e.target.value)}
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '0.85rem', background: 'white', cursor: 'pointer' }}>
                      {['submitted', 'in_review', 'approved', 'archived'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.9rem' }}>{new Date(req.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <button onClick={() => handleDelete(req.id)} style={{ padding: '0.4rem 0.9rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
              <p>No prayer requests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPrayerRequests;