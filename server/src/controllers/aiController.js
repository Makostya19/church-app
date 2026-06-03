const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.length < 10) {
      return res.status(400).json({ success: false, message: 'Prompt must be at least 10 characters' });
    }

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('HF error:', error);
      return res.status(500).json({ success: false, message: 'Image generation failed. Try again in a moment.' });
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64}`;

    res.json({ success: true, imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { generateImage };