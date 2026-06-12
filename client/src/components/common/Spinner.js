const Spinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizes = { small: '20px', medium: '40px', large: '60px' };
  const borders = { small: '3px', medium: '4px', large: '5px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '1rem' }}>
      <div style={{
        width: sizes[size], height: sizes[size],
        border: `${borders[size]} solid #e2e8f0`,
        borderTop: `${borders[size]} solid #2563eb`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {text && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{text}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Spinner;