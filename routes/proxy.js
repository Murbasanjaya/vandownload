const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/force-download', async (req, res) => {
    try {
        const { url, filename } = req.query;
        if (!url) return res.status(400).send('URL File tidak ditemukan');

        const response = await axios({ method: 'GET', url: url, responseType: 'stream' });
        res.setHeader('Content-Disposition', `attachment; filename="${filename || 'download'}"`);
        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send('Gagal memproses unduhan langsung.');
    }
});

module.exports = router;
