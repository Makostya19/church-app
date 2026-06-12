import { useState, useEffect } from 'react';
import client from '../../api/client';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/common/ConfirmModal';

const AdminMinistries = () => {
  const [ministries, setMinistries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', leaderName: '', contactEmail: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const fetchMinistries = async () => {
    try {
      const res = await client.get('/ministries');
      setMinistries(res.data.items);
    } catch (err) {}
  };

  useEffect(() => { fetchMinistries(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await client.put(`/ministries/${editItem.id}`, form);
        toast.success('Ministry updated!');
      } else {
        await client.post('/ministries', form);
        toast.success('Ministry created!');
      }
      setShowForm(false);
      setEditItem(null);
      setForm({ name: '', description: '', leaderName: '', contactEmail: '' });
      fetchMinistries();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, description: item.description || '', leaderName: item.leader_name || '', contactEmail: item.contact_email || '' });
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await client.delete(`/ministries/${confirmModal.id}`);
      toast.success('Deleted!');
      setConfirmModal({ isOpen: false, id: null });
      fetchMinistries();
    } catch (err) { toast.error('Failed'); }
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Admin Panel</p>
            <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>⛪ Manage Ministries</h1>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditItem(null); setForm({ name: '', description: '', leaderName: '', contactEmail: '' }); }}
            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.85rem 1.75rem', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ New Ministry'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 2rem' }}>
        {showForm && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.5rem' }}>
              {editItem ? 'Edit Ministry' : 'Create Ministry'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Leader Name</label>
                  <input value={form.leaderName} onChange={e => setForm({...form, leaderName: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Contact Email</label>
                  <input type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} style={inputStyle} />
              </div>
              <button type="submit" style={{ padding: '0.85rem 2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                {editItem ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Name', 'Leader', 'Contact', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ministries.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600', color: '#1a1a2e' }}>{m.name}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>{m.leader_name || '-'}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>{m.contact_email || '-'}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(m)} style={{ padding: '0.4rem 0.9rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => setConfirmModal({ isOpen: true, id: m.id })} style={{ padding: '0.4rem 0.9rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ministries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛪</div>
              <p>No ministries yet</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Ministry"
        message="Are you sure you want to delete this ministry?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default AdminMinistries;