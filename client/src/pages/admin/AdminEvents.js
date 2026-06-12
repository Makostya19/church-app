import { useState, useEffect } from 'react';
import client from '../../api/client';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/common/ConfirmModal';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', location: '', category: 'worship', capacity: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const fetchEvents = async () => {
    try {
      const res = await client.get('/admin/events');
      setEvents(res.data.items);
    } catch (err) {}
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editEvent) {
        await client.put(`/events/${editEvent.id}`, form);
        toast.success('Event updated!');
      } else {
        await client.post('/events', form);
        toast.success('Event created!');
      }
      setShowForm(false);
      setEditEvent(null);
      setForm({ title: '', description: '', event_date: '', location: '', category: 'worship', capacity: '' });
      fetchEvents();
    } catch (err) { toast.error('Failed to save event'); }
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setForm({
      title: event.title, description: event.description,
      event_date: event.event_date?.slice(0, 16),
      location: event.location, category: event.category, capacity: event.capacity || ''
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await client.delete(`/events/${confirmModal.id}`);
      toast.success('Event deleted!');
      setConfirmModal({ isOpen: false, id: null });
      fetchEvents();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await client.patch(`/events/${id}/status`, { status });
      toast.success('Status updated!');
      fetchEvents();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Admin Panel</p>
            <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Manage Events</h1>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditEvent(null); setForm({ title: '', description: '', event_date: '', location: '', category: 'worship', capacity: '' }); }}
            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.85rem 1.75rem', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ New Event'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 2rem' }}>
        {showForm && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.5rem' }}>
              {editEvent ? 'Edit Event' : 'Create New Event'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Location</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Event Date</label>
                  <input type="datetime-local" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                    <option value="worship">Worship</option>
                    <option value="community">Community</option>
                    <option value="youth">Youth</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Capacity</label>
                  <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={4} style={inputStyle} />
              </div>
              <button type="submit" style={{ padding: '0.85rem 2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                {editEvent ? 'Update Event' : 'Create Event'}
              </button>
            </form>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Title', 'Date', 'Location', 'Category', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <tr key={event.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '600', color: '#1a1a2e' }}>{event.title}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.9rem' }}>{new Date(event.event_date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.9rem' }}>{event.location}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>{event.category}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <select value={event.status} onChange={e => handleStatus(event.id, e.target.value)}
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '0.85rem', background: 'white', cursor: 'pointer' }}>
                      {['draft', 'published', 'cancelled', 'completed', 'archived'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(event)} style={{ padding: '0.4rem 0.9rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => setConfirmModal({ isOpen: true, id: event.id })} style={{ padding: '0.4rem 0.9rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <p>No events yet. Create your first event!</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default AdminEvents;