const axios = require('axios');

const API_KEY = 'nz-cb8f296edc';
const BASE_URL = 'https://api.naze.biz.id';

function detectPlatform(url) {
  if (url.includes('tiktok.com') || url.includes('vt.tiktok')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('spotify.com') || url.includes('open.spotify')) return 'spotify';
  return null;
}

async function handleTikTok(url) {
  const response = await axios.get(`${BASE_URL}/download/tiktok`, {
    params: { url, apikey: API_KEY }, timeout: 15000
  });
  const data = response.data;
  if (!data.success) throw new Error('Failed to fetch TikTok');
  const result = data.result;
  return {
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
  };
}

async function handleInstagram(url) {
  const response = await axios.get(`${BASE_URL}/download/instagram`, {
    params: { url, apikey: API_KEY }, timeout: 15000
  });
  const data = response.data;
  if (!data.success) throw new Error('Failed to fetch Instagram');
  const result = data.result;
  const downloads = (result.urls || []).map((item, i) => ({
    label: item.type === 'video' ? `Video ${i + 1}` : `Photo ${i + 1}`,
    url: item.url,
    type: item.type
  }));
  return {
    success: true,
    platform: 'instagram',
    title: result.caption || 'Instagram Post',
    author: result.username || 'Unknown',
    thumbnail: downloads.find(d => d.type === 'image')?.url || null,
    downloads,
    stats: { likes: result.likes, comments: result.comment_count }
  };
}

async function handleSpotify(url) {
  const response = await axios.get(`${BASE_URL}/download/spotify`, {
    params: { url, apikey: API_KEY }, timeout: 20000
  });
  const data = response.data;
  if (!data.success) throw new Error('Failed to fetch Spotify');
  const result = data.result;
  const meta = result.metadata || {};
  return {
    success: true,
    platform: 'spotify',
    title: meta.name || 'Spotify Track',
    author: (meta.artists || []).map(a => a.name).join(', ') || 'Unknown',
    album: meta.album?.name,
    thumbnail: meta.album?.images?.[0]?.url,
    downloads: [{ label: 'Download MP3', url: result.url, type: 'audio' }].filter(d => d.url),
    duration: meta.duration_ms ? Math.round(meta.duration_ms / 1000) : null,
    explicit: meta.explicit
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const platform = detectPlatform(url);
  if (!platform) return res.status(400).json({ error: 'Unsupported platform. Use TikTok, Instagram, or Spotify.' });

  try {
    let result;
    if (platform === 'tiktok') result = await handleTikTok(url);
    else if (platform === 'instagram') result = await handleInstagram(url);
    else if (platform === 'spotify') result = await handleSpotify(url);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
};
