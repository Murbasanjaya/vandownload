const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/fetch', async (req, res) => {
    try {
        const { url } = req.body;
        const API_KEY = process.env.NAZE_API_KEY;
        
        const endpoint = `https://api.naze.biz.id/download/spotify?url=${encodeURIComponent(url)}&apikey=${API_KEY}`;
        const response = await axios.get(endpoint);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data Spotify.' });
    }
});

module.exports = router;
