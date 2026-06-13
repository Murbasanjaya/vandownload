document.addEventListener('DOMContentLoaded', () => {
    const targetInput = document.getElementById('targetUrl');
    
    // ==========================================
    // LOGIKA HALAMAN UTAMA (INDEX.HTML)
    // ==========================================
    if (targetInput) {
        const radios = document.querySelectorAll('input[name="tabs"]');
        const serverGroup = document.getElementById('serverGroup');
        const btnSubmit = document.getElementById('btnSubmit');
        const btnPaste = document.getElementById('btnPaste');
        const loaderArea = document.getElementById('loaderArea');

        const uiverseLoader = `
            <div class="loader-wrapper">
                <div class="loader">
                    <span class="loader-text">loading</span>
                    <span class="load"></span>
                </div>
            </div>`;

        function buildServers(platform) {
            let config = '';
            if (platform === 'tiktok') {
                config = `
                    <input type="radio" id="srv1" name="server" value="1" checked><label for="srv1">Server Utama</label>
                    <input type="radio" id="srv2" name="server" value="2"><label for="srv2">Server V2</label>
                    <input type="radio" id="srv3" name="server" value="3"><label for="srv3">Server V3</label>`;
            } else if (platform === 'instagram') {
                config = `
                    <input type="radio" id="srv1" name="server" value="1" checked><label for="srv1">IG Server 1</label>
                    <input type="radio" id="srv2" name="server" value="2"><label for="srv2">IG Server 2</label>`;
            } else {
                config = `<input type="radio" id="srv1" name="server" value="1" checked><label for="srv1">Spotify Server</label>`;
            }
            serverGroup.innerHTML = config;
        }

        radios.forEach(r => r.addEventListener('change', (e) => buildServers(e.target.value)));
        buildServers('tiktok'); // Default load

        btnPaste.addEventListener('click', async () => {
            try { targetInput.value = await navigator.clipboard.readText(); } catch { alert('Gagal paste.'); }
        });

        btnSubmit.addEventListener('click', async () => {
            const platform = document.querySelector('input[name="tabs"]:checked').value;
            const serverVal = document.querySelector('input[name="server"]:checked')?.value || '1';
            const url = targetInput.value.trim();

            if (!url) return alert('Silakan masukkan tautan media terlebih dahulu!');

            loaderArea.innerHTML = uiverseLoader;
            loaderArea.classList.remove('hidden');

            try {
                const res = await fetch(`/api/${platform}/fetch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url, server: serverVal })
                });
                const resData = await res.json();

                if (resData.success && resData.result) {
                    // Simpan hasil ke lokal dan arahkan langsung ke hasil.html
                    localStorage.setItem('vanData', JSON.stringify(resData.result));
                    localStorage.setItem('vanPlatform', platform);
                    window.location.href = '/hasil.html';
                } else {
                    alert('Gagal memproses link media tersebut.');
                    loaderArea.classList.add('hidden');
                }
            } catch {
                alert('Gangguan koneksi server.');
                loaderArea.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // LOGIKA HALAMAN HASIL (HASIL.HTML)
    // ==========================================
    const mediaOutput = document.getElementById('mediaOutput');
    if (mediaOutput) {
        const rawData = localStorage.getItem('vanData');
        const platform = localStorage.getItem('vanPlatform');

        if (!rawData || !platform) {
            mediaOutput.innerHTML = `<p style="text-align:center;color:var(--pale-sky)">Tidak ada data untuk ditampilkan.</p>`;
            return;
        }

        const data = JSON.parse(rawData);
        let contentHtml = '';

        if (platform === 'tiktok') {
            contentHtml = `
                <div class="media-header">
                    <img src="${data.download?.video?.cover || '/images/default.jpg'}" alt="Cover">
                    <div class="media-info">
                        <h3>${data.author?.nickname || '@TiktokUser'}</h3>
                        <p>${data.desc || 'No description available'}</p>
                    </div>
                </div>
                <div class="stats-grid">
                    <span class="stat-item">❤️ ${numberShort(data.statistics?.like)}</span>
                    <span class="stat-item">💬 ${numberShort(data.statistics?.command)}</span>
                    <span class="stat-item">⬇️ ${numberShort(data.statistics?.download)}</span>
                </div>
                <button class="btn" onclick="directDownload('${data.download?.video?.nowm}', 'tiktok_video.mp4')">Download Video (No WM)</button>
                <button class="btn btn-secondary" onclick="directDownload('${data.download?.music}', 'tiktok_audio.mp3')">Download Audio MP3</button>
            `;
        } else if (platform === 'instagram') {
            contentHtml = `
                <div class="media-header">
                    <div class="media-info">
                        <h3>@${data.username || 'InstagramUser'}</h3>
                        <p>❤️ ${numberShort(data.likes)} Likes | 💬 ${numberShort(data.comment_count)} Comments</p>
                    </div>
                </div>
                <div class="ig-grid">`;
            if (data.urls && data.urls.length > 0) {
                data.urls.forEach((item, index) => {
                    contentHtml += `
                        <div style="text-align:center;">
                            <img src="${item.url}" style="width:100%; border-radius:8px;">
                            <button class="btn" style="margin-top:5px; padding:6px; font-size:0.8rem;" onclick="directDownload('${item.url}', 'instagram_${index}.jpg')">Download</button>
                        </div>`;
                });
            }
            contentHtml += `</div>`;
        } else if (platform === 'spotify') {
            contentHtml = `
                <div class="media-header">
                    <img src="${data.metadata?.album?.images[0]?.url || '/images/spotify.jpg'}" alt="Cover">
                    <div class="media-info">
                        <h3>${data.metadata?.name || 'Unknown Track'}</h3>
                        <p>Artist: ${data.metadata?.artists[0]?.name || 'Unknown Artist'}</p>
                    </div>
                </div>
                <button class="btn" onclick="directDownload('${data.url}', '${data.metadata?.name || 'track'}.mp3')">Download MP3</button>
            `;
        }

        mediaOutput.innerHTML = contentHtml;
    }
});

// Fungsi pembantu konversi angka ribuan/jutaan
function numberShort(num) {
    if (!num) return '0';
    return num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num;
}

// Fungsi eksekusi download langsung (Direct Download tanpa tab baru)
window.directDownload = function(url, filename) {
    if (!url) return alert("Link file tidak valid!");
    // Menggunakan proxy node js route yang sudah dibuat kemarin agar langsung keproses download otomatis di browser hp/pc
    window.location.href = `/api/proxy/force-download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
};
