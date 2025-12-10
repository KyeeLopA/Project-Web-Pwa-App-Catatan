// --- BAGIAN 1: LOGIKA CATATAN ---
const input = document.getElementById('note-input');
const btn = document.getElementById('add-btn');
const list = document.getElementById('note-list');

// Load data saat web dibuka
document.addEventListener('DOMContentLoaded', loadNotes);

// Event klik tombol simpan
btn.addEventListener('click', addNote);

// Event tekan Enter di keyboard
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addNote();
});

function addNote() {
    const text = input.value;
    if (text === '') return;

    createListElement(text);
    saveLocal(text);
    input.value = '';
}

function createListElement(text) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn">Hapus</button>
    `;
    
    // Fungsi hapus per item
    li.querySelector('.delete-btn').addEventListener('click', function() {
        li.remove();
        removeFromLocal(text);
    });

    list.appendChild(li);
}

// Simpan ke Memori HP (Local Storage)
function saveLocal(text) {
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    notes.push(text);
    localStorage.setItem('catatanku_data', JSON.stringify(notes));
}

// Hapus dari Memori HP
function removeFromLocal(text) {
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    const index = notes.indexOf(text);
    if (index > -1) {
        notes.splice(index, 1);
    }
    localStorage.setItem('catatanku_data', JSON.stringify(notes));
}

// Ambil data saat aplikasi dibuka kembali
function loadNotes() {
    let notes = localStorage.getItem('catatanku_data') ? JSON.parse(localStorage.getItem('catatanku_data')) : [];
    notes.forEach(note => createListElement(note));
}

// --- BAGIAN 2: DAFTARKAN SERVICE WORKER (PWA) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker OK'))
            .catch(err => console.log('Service Worker Gagal', err));
    });
}

// --- BAGIAN REGISTRASI PWA DI app.js ---

// Cek apakah browser mendukung Service Worker
if ('serviceWorker' in navigator) {
    // Daftarkan Service Worker saat halaman selesai dimuat
    window.addEventListener('load', () => {
        // PENTING: Path harus sesuai, yaitu './sw.js'
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('Pendaftaran Service Worker Berhasil. Scope:', reg.scope);
            })
            .catch(err => {
                console.error('Pendaftaran Service Worker Gagal:', err);
            });
    });
}