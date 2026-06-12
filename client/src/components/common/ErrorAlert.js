const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={{
      background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '10px',
      padding: '1rem 1.25rem', marginBottom: '1rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
        <p style={{ color: '#dc2626', fontWeight: '500', fontSize: '0.95rem' }}>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1.2rem', padding: '0' }}>✕</button>
      )}
    </div>
  );
};

export default ErrorAlert;