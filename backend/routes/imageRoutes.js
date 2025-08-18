

const express = require('express');
const FormData = require('form-data');
const axios = require('axios');

const router = express.Router();



router.post('/generate', async (req, res) => {
  try {
    const { prompt, output_format = 'webp', model = 'ultra' } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt is required (string).' });
    }
    if (!process.env.STABILITY_API_KEY) {
      return res.status(500).json({ error: 'Server misconfigured: STABILITY_API_KEY is missing.' });
    }

    const form = new FormData();
    form.append('prompt', prompt);
    form.append('output_format', output_format);

    const response = await axios.post(
      `https://api.stability.ai/v2beta/stable-image/generate/${model}`,
      form,
      {
        responseType: 'arraybuffer',
        validateStatus: () => true, // we handle non-200s below
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: 'image/*'
        }
      }
    );

    if (response.status === 200) {
      const base64 = Buffer.from(response.data).toString('base64');
      return res.json({ imageBase64: base64, format: output_format });
    }

    // Try to decode error text
    let errText = '';
    try {
      errText = Buffer.from(response.data).toString();
    } catch {}
    return res.status(response.status).json({
      error: `Stability API error`,
      status: response.status,
      details: errText
    });
  } catch (err) {
    console.error('Image generation error:', err);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
});

module.exports = router;