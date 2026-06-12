import { useState } from 'react';
import client from '../../api/client';
import { toast } from 'react-toastify';

const AdminAIImage = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt || prompt.length < 10) {
      toast.error('Prompt must be at least 10 characters');
      return;
    }
    setLoading(true);
    setImageUrl('');
    try {
      const res = await client.post('/ai/images', { prompt });
      setImageUrl(res.data.imageUrl);
      toast.success('Image generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated-image.jpg';
    link.click();
  };

  const suggestions = [
    'A beautiful church community gathering with warm sunset lighting',
    'People praying together in a peaceful church interior',
    'Church choir singing with colorful stained glass windows',
    'Community volunteering event with happy diverse group of people',
    'Easter celebration with flowers and candles in a church',
  ];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '3rem 2rem', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Admin Panel</p>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>🤖 AI Image Generation</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Generate cover images for events and announcements using AI</p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left - Input */}
          <div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>Enter Prompt</h3>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                rows={5} placeholder="Describe the image you want to generate... (min 10 characters)"
                style={{ width: '100%', padding: '0.85rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>{prompt.length}/500 characters</p>
              <button onClick={handleGenerate} disabled={loading} style={{
                width: '100%', marginTop: '1rem', padding: '0.9rem', background: loading ? '#94a3b8' : '#2563eb',
                color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem',
                fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}>
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '3px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Generating... (may take 30-60s)
                  </>
                ) : '🎨 Generate Image'}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>💡 Prompt Suggestions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setPrompt(s)} style={{
                    padding: '0.6rem 0.9rem', background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: '8px', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem',
                    color: '#475569', transition: 'all 0.2s'
                  }}
                    onMouseEnter={e => { e.target.style.background = '#eff6ff'; e.target.style.borderColor = '#2563eb'; e.target.style.color = '#2563eb'; }}
                    onMouseLeave={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e2e8f0'; e.target.style.color = '#475569'; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Preview */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>Preview</h3>
            {loading ? (
              <div style={{ height: '300px', background: '#f8fafc', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
                <p style={{ fontWeight: '600' }}>Generating your image...</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>This may take 30-60 seconds</p>
              </div>
            ) : imageUrl ? (
              <div>
                <img src={imageUrl} alt="Generated" style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }} />
                <button onClick={handleDownload} style={{
                  width: '100%', padding: '0.75rem', background: '#f0fdf4', color: '#16a34a',
                  border: '2px solid #16a34a', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem'
                }}>
                  ⬇️ Download Image
                </button>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>
                  Download and upload as event/announcement cover image
                </p>
              </div>
            ) : (
              <div style={{ height: '300px', background: '#f8fafc', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🖼️</div>
                <p style={{ fontWeight: '600' }}>Your image will appear here</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Enter a prompt and click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAIImage;