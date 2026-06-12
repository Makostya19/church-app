const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '2rem',
        maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.5rem' }}>{title}</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '0.75rem', background: '#f1f5f9', color: '#64748b',
            border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem'
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '0.75rem', background: '#dc2626', color: 'white',
            border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem'
          }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;