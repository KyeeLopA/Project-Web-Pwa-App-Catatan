// app.js - Versi Final dengan Fitur Arsip, Tanggal, Pengaturan Font, Wallpaper, Blur Kaca, dan MODE FOKUS

// --- BAGIAN 1: DEKLARASI VARIABEL UTAMA ---
const input = document.getElementById('note-input');
const btn = document.getElementById('add-btn');
const list = document.getElementById('note-list');
const archiveList = document.getElementById('archive-list'); 

// Variabel Pengaturan Modal
const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const fontSelect = document.getElementById('font-select');
const root = document.documentElement; // Untuk CSS Variables

// BARU: Blur Elements
const blurRange = document.getElementById('blur-range');
const blurValueSpan = document.getElementById('blur-value');

// BARU: Wallpaper Elements
const wallpaperFileInput = document.getElementById('wallpaper-file-input'); // Input File
const wallpaperDataUrlInput = document.getElementById('wallpaper-data-url'); // Input Hidden
const applyWallpaperBtn = document.getElementById('apply-wallpaper-btn');
const resetWallpaperBtn = document.getElementById('reset-wallpaper-btn');


// --- BAGIAN 2: LOGIKA CATATAN & EVENT LISTENERS DASAR ---

// Event Listeners Dasar
document.addEventListener('DOMContentLoaded', loadAllSettings); // Mengganti loadNotes
btn.addEventListener('click', addNote);
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addNote();
});


// BARU: LOGIKA MODE FOKUS
input.addEventListener('focus', () => {
    // Saat input mendapat fokus, aktifkan mode fokus pada body
    document.body.classList.add('note-focus-mode');
});

input.addEventListener('blur', () => {
    // Saat input kehilangan fokus, hapus mode fokus
    // Diberi penundaan untuk mencegah flicker ketika tombol 'Simpan' diklik
    setTimeout(() => {
        // Hapus mode fokus, kecuali jika modal pengaturan sedang terbuka
        if (modal.style.display !== 'flex') {
            document.body.classList.remove('note-focus-mode');
        }
    }, 150); 
});
// END LOGIKA MODE FOKUS


function addNote() {
    const text = input.value;
    if (text === '') return;

    // 1. Buat Objek Catatan Baru
    const newNote = {
        text: text,
        date: new Date().toLocaleString(),
        archived: false
    };

    createListElement(newNote); 
    saveLocal(newNote);         
    input.value = '';
}

function createListElement(note) {
    const li = document.createElement('li');
    
    let actionButton;
    
    if (note.archived) {
        actionButton = `<button class="unarchive-btn">Buka Arsip</button>`;
    } else {
        actionButton = `<button class="archive-btn">Arsipkan</button>`;
    }

    li.innerHTML = `
        <div style="flex-grow: 1; margin-right: 15px;">
            <span class="note-text" style="font-weight: bold;">${note.text}</span>
            <small class="note-date" style="display: block; color: #777; margin-top: 5px; font-size: 0.8em;">
                Disimpan pada: ${note.date}
            </small>
        </div>
        ${actionButton}
        <button class="delete-btn">Hapus</button>
    `;

    const targetList = note.archived ? archiveList : list;

    // Listener untuk tombol Arsipkan/Buka Arsip
    li.querySelector('.archive-btn, .unarchive-btn').addEventListener('click', function() {
        note.archived = !note.archived; 
        updateLocal(note); 
    });
    
    // Listener untuk Hapus
    li.querySelector('.delete-btn').addEventListener('click', function() {
        li.remove();
        removeFromLocal(note); 
    });

    targetList.appendChild(li);
}

function updateLocal(noteToUpdate) {
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    
    const index = notes.findIndex(note => 
        note.text === noteToUpdate.text && note.date === noteToUpdate.date
    );

    if (index !== -1) {
        notes[index] = noteToUpdate;
    }
    
    localStorage.setItem('catatanku_data', JSON.stringify(notes));
    loadNotes(); 
}

function saveLocal(note) {
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    notes.push(note);
    localStorage.setItem('catatanku_data', JSON.stringify(notes));
}

function removeFromLocal(noteToDelete) {
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    
    notes = notes.filter(note => 
        note.text !== noteToDelete.text || note.date !== noteToDelete.date
    );
    
    localStorage.setItem('catatanku_data', JSON.stringify(notes));
    loadNotes();
}

function loadNotes() {
    list.innerHTML = '';
    archiveList.innerHTML = '';
    
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    
    if (!Array.isArray(notes)) {
        notes = [];
        localStorage.removeItem('catatanku_data');
    }
    
    notes.forEach(note => createListElement(note));
}

// --- BAGIAN 3: LOGIKA PENGATURAN FONT ---

const fontMap = {
    'default': 'sans-serif, Arial', 
    'serif': 'Georgia, "Times New Roman", Times, serif', 
    'monospace': '"Lucida Console", "Courier New", monospace' 
};

function applyFont(fontKey) {
    const font = fontMap[fontKey] || fontMap['default'];
    root.style.setProperty('--main-font', font);
    localStorage.setItem('catatanku_font', fontKey);
}

function loadFontSetting() {
    const savedFont = localStorage.getItem('catatanku_font') || 'default';
    fontSelect.value = savedFont;
    applyFont(savedFont);
}


// --- BAGIAN 4: KONTROL MODAL DAN EVENT LISTENERS PENGATURAN ---

// Kontrol Modal
settingsBtn.addEventListener('click', () => {
    modal.style.display = 'flex'; // Menggunakan flex untuk menengahkan
    // Saat modal dibuka, pastikan input file kosong dan tombol disabled jika tidak ada gambar baru
    wallpaperFileInput.value = null;
    wallpaperDataUrlInput.value = '';
    
    const savedUrl = localStorage.getItem('catatanku_wallpaper');
    applyWallpaperBtn.disabled = !savedUrl; // Disable jika tidak ada gambar yang tersimpan
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

fontSelect.addEventListener('change', (e) => {
    applyFont(e.target.value);
});


// --- BAGIAN 5: LOGIKA BLUR KACA DAN WALLPAPER ---

// ---------------------- BLUR KACA LOGIC ----------------------

// Listener untuk slider blur
blurRange.addEventListener('input', function(e) {
    const value = e.target.value;
    blurValueSpan.textContent = value + 'px'; 
    applyBlur(value);
});

// Fungsi untuk menerapkan dan menyimpan nilai blur
function applyBlur(value) {
    root.style.setProperty('--card-blur', `blur(${value}px)`);
    localStorage.setItem('catatanku_blur_level', value);
}

function loadBlurSetting() {
    const savedBlur = localStorage.getItem('catatanku_blur_level') || '0';
    blurRange.value = savedBlur;
    blurValueSpan.textContent = savedBlur + 'px';
    applyBlur(savedBlur);
}

// ---------------------- WALLPAPER LOGIC ----------------------

// Listener ketika pengguna memilih file (dari penyimpanan lokal)
wallpaperFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onloadend = function() {
            wallpaperDataUrlInput.value = reader.result;
            // Aktifkan tombol Terapkan setelah file berhasil dibaca
            applyWallpaperBtn.disabled = false; 
        };
        
        // Baca file sebagai Data URL (Base64)
        reader.readAsDataURL(file);
    } else {
        wallpaperDataUrlInput.value = '';
        applyWallpaperBtn.disabled = true;
        // Hanya munculkan alert jika pengguna memilih file yang tidak valid
        if(file) alert('Mohon pilih file gambar yang valid.');
    }
});

// Listener ketika tombol Terapkan diklik
applyWallpaperBtn.addEventListener('click', () => {
    const dataUrl = wallpaperDataUrlInput.value.trim();
    if (dataUrl) {
        applyWallpaper(dataUrl);
        modal.style.display = 'none'; 
    } else {
        // Jika dataUrl kosong tapi tombol diklik (seharusnya tidak terjadi jika logika disabled benar)
        alert('Mohon pilih gambar atau masukkan URL yang valid!');
    }
});

// Listener untuk Hapus Wallpaper
resetWallpaperBtn.addEventListener('click', () => {
    applyWallpaper(''); 
    wallpaperFileInput.value = null; 
    wallpaperDataUrlInput.value = '';
    applyWallpaperBtn.disabled = true;
    modal.style.display = 'none';
});

// Fungsi untuk menerapkan dan menyimpan Data URL wallpaper
function applyWallpaper(url) {
    if (url) {
        root.style.setProperty('--wallpaper-url', `url('${url}')`);
        localStorage.setItem('catatanku_wallpaper', url);
        document.body.classList.add('has-wallpaper');
    } else {
        root.style.setProperty('--wallpaper-url', 'none');
        localStorage.removeItem('catatanku_wallpaper');
        document.body.classList.remove('has-wallpaper');
    }
}

function loadWallpaperSetting() {
    const savedUrl = localStorage.getItem('catatanku_wallpaper');
    if (savedUrl) {
        applyWallpaper(savedUrl);
    }
}

// ---------------------- MUAT SEMUA PENGATURAN ----------------------

function loadAllSettings() {
    loadNotes();
    loadFontSetting();
    loadBlurSetting();
    loadWallpaperSetting();
}


// --- BAGIAN 6: PENDAFTARAN SERVICE WORKER (PWA) ---

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('Pendaftaran Service Worker Berhasil. Scope:', reg.scope);
            })
            .catch(err => {
                console.error('Pendaftaran Service Worker Gagal:', err);
            });
    });
}