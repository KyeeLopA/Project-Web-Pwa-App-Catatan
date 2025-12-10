// app.js - Versi Final dengan Fitur Arsip, Tanggal, dan Pengaturan Font

// --- BAGIAN 1: DEKLARASI VARIABEL UTAMA ---
const input = document.getElementById('note-input');
const btn = document.getElementById('add-btn');
const list = document.getElementById('note-list');
const archiveList = document.getElementById('archive-list'); // BARU: Daftar Arsip

// Variabel Pengaturan Modal
const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const fontSelect = document.getElementById('font-select');
const root = document.documentElement; // Untuk CSS Variables

// --- BAGIAN 2: LOGIKA CATATAN (DIPERBARUI UNTUK MENGGUNAKAN OBJEK {text, date, archived}) ---

// Event Listeners Dasar
document.addEventListener('DOMContentLoaded', loadNotes);
btn.addEventListener('click', addNote);
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addNote();
});

// DIPERBARUI: Fungsi ini sekarang membuat objek {text, date, archived}
function addNote() {
    const text = input.value;
    if (text === '') return;

    // 1. Buat Objek Catatan Baru
    const newNote = {
        text: text,
        date: new Date().toLocaleString(),
        archived: false // BARU: Default catatan baru TIDAK diarsipkan
    };

    createListElement(newNote); 
    saveLocal(newNote);         
    input.value = '';
}

// DIPERBARUI: Fungsi ini menerima objek {text, date, archived}
function createListElement(note) {
    const li = document.createElement('li');
    
    // Tentukan tombol aksi berdasarkan status arsip
    let actionButton;
    
    if (note.archived) {
        actionButton = `<button class="unarchive-btn">Buka Arsip</button>`;
    } else {
        actionButton = `<button class="archive-btn">Arsipkan</button>`;
    }

    // Tampilan: Tambahkan <div> terpisah untuk teks dan tanggal
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

    // Tentukan list tujuan: utama atau arsip
    const targetList = note.archived ? archiveList : list;

    // Listener untuk tombol Arsipkan/Buka Arsip
    li.querySelector('.archive-btn, .unarchive-btn').addEventListener('click', function() {
        // Balik status archived
        note.archived = !note.archived; 
        updateLocal(note); // Panggil fungsi baru untuk update status
    });
    
    // Listener untuk Hapus
    li.querySelector('.delete-btn').addEventListener('click', function() {
        li.remove();
        removeFromLocal(note); // Kirim objek catatan ke fungsi hapus
    });

    targetList.appendChild(li);
}

// BARU: Fungsi untuk menyimpan perubahan pada satu item (Mengubah status Arsip)
function updateLocal(noteToUpdate) {
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    
    // Cari index catatan yang akan diubah (berdasarkan teks dan tanggal unik)
    const index = notes.findIndex(note => 
        note.text === noteToUpdate.text && note.date === noteToUpdate.date
    );

    if (index !== -1) {
        // Ganti objek lama dengan objek baru (yang sudah diubah status archived-nya)
        notes[index] = noteToUpdate;
    }
    
    localStorage.setItem('catatanku_data', JSON.stringify(notes));
    loadNotes(); // Muat ulang list agar tampilan terpisah
}


// DIPERBARUI: Fungsi ini menyimpan objek {text, date, archived}
function saveLocal(note) {
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    notes.push(note);
    localStorage.setItem('catatanku_data', JSON.stringify(notes));
}

// DIPERBARUI: Fungsi ini menghapus berdasarkan objek (teks dan tanggal)
function removeFromLocal(noteToDelete) {
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    
    // Gunakan filter untuk mencari dan menghapus objek berdasarkan teks dan tanggal
    notes = notes.filter(note => 
        note.text !== noteToDelete.text || note.date !== noteToDelete.date
    );
    
    localStorage.setItem('catatanku_data', JSON.stringify(notes));
    // Muat ulang setelah dihapus
    loadNotes();
}

// DIPERBARUI: Fungsi ini memuat objek dan memfilter berdasarkan status arsip
function loadNotes() {
    // Kosongkan list yang ada sebelum dimuat ulang
    list.innerHTML = '';
    archiveList.innerHTML = '';
    
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    
    if (!Array.isArray(notes)) {
        notes = [];
        localStorage.removeItem('catatanku_data');
    }
    
    // Ulangi semua catatan dan panggil createListElement untuk menampilkannya
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

document.addEventListener('DOMContentLoaded', loadFontSetting);


// Kontrol Modal
settingsBtn.addEventListener('click', () => {
    modal.style.display = 'block';
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


// --- BAGIAN 4: PENDAFTARAN SERVICE WORKER (PWA) ---

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