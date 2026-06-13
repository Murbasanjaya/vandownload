const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware wajib
app.use(cors());
app.use(express.json());

// BARIS WAJIB: Daftarkan folder public sebagai folder aset statis (CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Mengimpor Rute API yang kamu buat kemarin
const tiktokRoute = require('./routes/tiktok');
const igRoute = require('./routes/ig');
const spotifyRoute = require('./routes/spotify');
const proxyRoute = require('./routes/proxy');

// Hubungkan endpoint API dengan frontend (main.js)
app.use('/api/tiktok', tiktokRoute);
app.use('/api/instagram', igRoute);
app.use('/api/spotify', spotifyRoute);
app.use('/api/proxy', proxyRoute);

// Rute Navigasi Halaman Utama (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rute Navigasi Halaman Hasil (hasil.html)
app.get('/hasil.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hasil.html'));
});

// Jalankan Server Lokal (untuk keperluan testing di Termux)
app.listen(PORT, () => {
    console.log(`Server VanDownloader berjalan di http://localhost:${PORT}`);
});

module.exports = app;
