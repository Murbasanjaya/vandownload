require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Pendaftaran Router Terpisah
app.use('/api/tiktok', require('./routes/tiktok'));
app.use('/api/instagram', require('./routes/ig'));
app.use('/api/spotify', require('./routes/spotify'));
app.use('/api/proxy', require('./routes/proxy'));

// Halaman Utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// === TAMBAHAN ROUTE BARU ===
// Melayani halaman hasil download setelah parsing API sukses
app.get('/hasil.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hasil.html'));
});

app.listen(PORT, () => {
    console.log(`VanDownloader berjalan di http://localhost:${PORT}`);
});

// Halaman Utama (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Halaman Hasil (hasil.html)
app.get('/hasil.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hasil.html'));
});
