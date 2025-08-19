

const express = require('express');
const FormData = require('form-data');
const axios = require('axios');

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const prompt = 'An Ishihara color blindness test plate: a circular field filled with hundreds of small, randomly scattered, random placement, not in grids or patterns, colored dots. The dots form the number "12" in the center using a different color from the background dots. Medical test style, white background, realistic Ishihara plate. '
    const output_format= 'webp';
    
    const form = new FormData();
    form.append('prompt', prompt);
    form.append('output_format', output_format);

    const response = await axios.post(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      form,
      {
        responseType: 'arraybuffer',
        validateStatus: () => true,
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

    //decode error text
    let errText = '';
    try {
      errText = Buffer.from(response.data).toString();
    } catch {}
    return res.status(response.status).json({
      //status: response.status,
      details: errText
    });


  } catch (err) {
    console.error('Image generation error:', err);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
});

module.exports = router;