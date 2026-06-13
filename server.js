const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const API_KEY = 'nz-cb8f296edc';
const BASE_URL = 'https://api.naze.biz.id';

app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Helper to detect platform
function detectPlatform(url) {
  if (url.includes('tiktok.com') || url.includes('vt.tiktok')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('spotify.com') || url.includes('open.spotify')) return 'spotify';
  return null;
}

// TikTok download
app.post('/api/download/tiktok', async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(`${BASE_URL}/download/tiktok`, {
      params: { url, apikey: API_KEY },
      timeout: 15000
    });
    const data = response.data;
    if (!data.success) return res.status(400).json({ error: 'Failed to fetch TikTok' });
    
    const result = data.result;
    res.json({
      success: true,
      platform: 'tiktok',
      title: result.desc || 'TikTok Video',
      author: result.author?.nickname || result.author?.unique_id || 'Unknown',
      thumbnail: result.download?.video?.cover || result.download?.video?.origin_cover,
      downloads: [
        { label: 'Video HD', url: result.download?.video?.nowm_hd, type: 'video' },
        { label: 'Video SD', url: result.download?.video?.nowm, type: 'video' },
        { label: 'Audio MP3', url: result.download?.music, type: 'audio' }
      ].filter(d => d.url),
      stats: {
        likes: result.statistics?.like,
        shares: result.statistics?.share,
        comments: result.statistics?.command
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Instagram download
app.post('/api/download/instagram', async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(`${BASE_URL}/download/instagram`, {
      params: { url, apikey: API_KEY },
      timeout: 15000
    });
    const data = response.data;
    if (!data.success) return res.status(400).json({ error: 'Failed to fetch Instagram' });

    const result = data.result;
    const downloads = (result.urls || []).map((item, i) => ({
      label: item.type === 'video' ? `Video ${i + 1}` : `Photo ${i + 1}`,
      url: item.url,
      type: item.type
    }));

    res.json({
      success: true,
      platform: 'instagram',
      title: result.caption || 'Instagram Post',
      author: result.username || 'Unknown',
      thumbnail: downloads.find(d => d.type === 'image')?.url || null,
      downloads,
      stats: {
        likes: result.likes,
        comments: result.comment_count
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Spotify download
app.post('/api/download/spotify', async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(`${BASE_URL}/download/spotify`, {
      params: { url, apikey: API_KEY },
      timeout: 20000
    });
    const data = response.data;
    if (!data.success) return res.status(400).json({ error: 'Failed to fetch Spotify' });

    const result = data.result;
    const meta = result.metadata || {};
    res.json({
      success: true,
      platform: 'spotify',
      title: meta.name || 'Spotify Track',
      author: (meta.artists || []).map(a => a.name).join(', ') || 'Unknown',
      album: meta.album?.name,
      thumbnail: meta.album?.images?.[0]?.url,
      downloads: [
        { label: 'Download MP3', url: result.url, type: 'audio' }
      ].filter(d => d.url),
      duration: meta.duration_ms ? Math.round(meta.duration_ms / 1000) : null,
      explicit: meta.explicit
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Auto-detect endpoint - routes to platform-specific handlers
app.post('/api/download', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  
  const platform = detectPlatform(url);
  if (!platform) return res.status(400).json({ error: 'Unsupported platform. Use TikTok, Instagram, or Spotify.' });

  // Manually handle based on platform instead of internal axios call
  try {
    let result;
    if (platform === 'tiktok') {
      const response = await axios.get(`${BASE_URL}/download/tiktok`, {
        params: { url, apikey: API_KEY },
        timeout: 15000
      });
      const data = response.data;
      if (!data.success) throw new Error('Failed to fetch TikTok');
      const r = data.result;
      result = {
        success: true,
        platform: 'tiktok',
        title: r.desc || 'TikTok Video',
        author: r.author?.nickname || r.author?.unique_id || 'Unknown',
        thumbnail: r.download?.video?.cover || r.download?.video?.origin_cover,
        downloads: [
          { label: 'Video HD', url: r.download?.video?.nowm_hd, type: 'video' },
          { label: 'Video SD', url: r.download?.video?.nowm, type: 'video' },
          { label: 'Audio MP3', url: r.download?.music, type: 'audio' }
        ].filter(d => d.url),
        stats: { likes: r.statistics?.like, shares: r.statistics?.share, comments: r.statistics?.command }
      };
    } else if (platform === 'instagram') {
      const response = await axios.get(`${BASE_URL}/download/instagram`, {
        params: { url, apikey: API_KEY },
        timeout: 15000
      });
      const data = response.data;
      if (!data.success) throw new Error('Failed to fetch Instagram');
      const r = data.result;
      const downloads = (r.urls || []).map((item, i) => ({
        label: item.type === 'video' ? `Video ${i + 1}` : `Photo ${i + 1}`,
        url: item.url,
        type: item.type
      }));
      result = {
        success: true,
        platform: 'instagram',
        title: r.caption || 'Instagram Post',
        author: r.username || 'Unknown',
        thumbnail: downloads.find(d => d.type === 'image')?.url || null,
        downloads,
        stats: { likes: r.likes, comments: r.comment_count }
      };
    } else if (platform === 'spotify') {
      const response = await axios.get(`${BASE_URL}/download/spotify`, {
        params: { url, apikey: API_KEY },
        timeout: 20000
      });
      const data = response.data;
      if (!data.success) throw new Error('Failed to fetch Spotify');
      const r = data.result;
      const meta = r.metadata || {};
      result = {
        success: true,
        platform: 'spotify',
        title: meta.name || 'Spotify Track',
        author: (meta.artists || []).map(a => a.name).join(', ') || 'Unknown',
        album: meta.album?.name,
        thumbnail: meta.album?.images?.[0]?.url,
        downloads: [{ label: 'Download MP3', url: r.url, type: 'audio' }].filter(d => d.url),
        duration: meta.duration_ms ? Math.round(meta.duration_ms / 1000) : null,
        explicit: meta.explicit
      };
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Proxy download — streams file to client so browser saves directly
app.post('/api/proxy-download', async (req, res) => {
  const { url, filename } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Vanndl/1.0)',
        'Referer': 'https://www.tiktok.com/'
      }
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'download'}"`);
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }

    response.data.pipe(res);
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

// Export for Vercel serverless
module.exports = app;

// Local development fallback
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Vanndl server running on http://localhost:${PORT}`);
  });
}
