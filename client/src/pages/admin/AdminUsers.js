import { useState, useEffect } from 'react';
import client from '../../api/client';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      const res = await client.get(`/admin/users?${params}`);
      setUsers(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (err) {}
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const updateRole = async (id, role) => {
    try {
      await client.patch(`/admin/users/${id}/role`, { role });
      toast.success('Role updated!');
      fetchUsers();
    } catch (err) { toast.error('Failed to update role'); }
  };

  const toggleStatus = async (id, isActive) => {
    try {
      await client.patch(`/admin/users/${id}/status`, { isActive: !isActive });
      toast.success(isActive ? 'User deactivated!' : 'User activated!');
      fetchUsers();
    } catch (err) { toast.error('Failed to update status'); }
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Admin Panel</p>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Manage Users</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchUsers()}
            placeholder="Search by name or email..."
            style={{ flex: 1, padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }} />
          <button onClick={fetchUsers} style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Search</button>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: user.is_active === false ? '#94a3b8' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '600', color: '#1a1a2e' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.9rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ background: user.role === 'admin' ? '#fee2e2' : '#eff6ff', color: user.role === 'admin' ? '#dc2626' : '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ background: user.is_active === false ? '#fee2e2' : '#f0fdf4', color: user.is_active === false ? '#dc2626' : '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {user.is_active === false ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.9rem' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button onClick={() => updateRole(user.id, user.role === 'admin' ? 'member' : 'admin')}
                        style={{ padding: '0.4rem 0.75rem', background: '#f0fdf4', color: '#16a34a', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}>
                        Make {user.role === 'admin' ? 'Member' : 'Admin'}
                      </button>
                      <button onClick={() => toggleStatus(user.id, user.is_active !== false)}
                        style={{ padding: '0.4rem 0.75rem', background: user.is_active === false ? '#f0fdf4' : '#fee2e2', color: user.is_active === false ? '#16a34a' : '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}>
                        {user.is_active === false ? 'Activate' : 'Deactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <p>No users found</p>
            </div>
          )}
        </div>

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

export default AdminUsers;