# Vanndl — Download Anything

Lightning-fast media downloader for TikTok, Instagram, and Spotify.

## Features

- **TikTok** — Download videos & audio
- **Instagram** — Download posts, reels, carousels
- **Spotify** — Download tracks as MP3
- **Liquid Glass UI** — Modern glassmorphism design
- **Dark/Light Mode** — Toggle theme instantly
- **Responsive** — Works on all devices
- **Direct Downloads** — No tab redirects, files save to Downloads folder

## Local Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or connect GitHub repo and auto-deploy
```

The `vercel.json` is configured to serve the static frontend and proxy API requests through the Node.js backend.

## Tech Stack

**Frontend:**
- HTML5
- CSS3 (Liquid Glass, Dark/Light Mode)
- Vanilla JavaScript

**Backend:**
- Node.js + Express
- Axios for HTTP requests
- CORS enabled

**APIs Used:**
- TikTok via naze.biz.id
- Instagram via naze.biz.id
- Spotify via naze.biz.id

## License

For personal use only. Respect content creators.
