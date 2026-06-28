// ========================================
// playlist/add.js
// Add Playlist
// ========================================

import {
    savePlaylistToFirebase
} from "./firebase.js";

import {
    m3uUrl,
    m3uTitle,
    mediaType,
    m3uSchedule,
    savePlaylistBtn
} from "./elements.js";

import {
    addPlaylist
} from "./state.js";

import {
    renderPlaylistTable
} from "./table.js";

// ========================================
// SAVE PLAYLIST
// ========================================

export async function savePlaylist() {

    const url = m3uUrl.value.trim();
    const title = m3uTitle.value.trim();
    const type = mediaType.value;
    const schedule = m3uSchedule.value;

    // ===========================
    // VALIDASI
    // ===========================

    if (!url) {

        alert("URL media belum diisi.");

        m3uUrl.focus();

        return;

    }

    if (!title) {

        alert("Judul belum diisi.");

        m3uTitle.focus();

        return;

    }

    // ===========================
    // DATA PLAYLIST
    // ===========================

    const playlist = {

        id: crypto.randomUUID(),

        url,

        title,

        type,

        schedule,

        status: "Menunggu"

    };

    try {

        // ===========================
        // SIMPAN KE FIREBASE
        // ===========================

        await savePlaylistToFirebase(playlist);

        // ===========================
        // SIMPAN KE STATE
        // ===========================

        addPlaylist(playlist);

        // ===========================
        // UPDATE TABEL
        // ===========================

        renderPlaylistTable();

        // ===========================
        // RESET FORM
        // ===========================

        clearForm();

        console.log("✅ Playlist berhasil ditambahkan.");

    } catch (err) {

        console.error("❌ Gagal menambahkan playlist.", err);

        alert("Gagal menyimpan playlist ke Firebase.");

    }

}

// ========================================
// CLEAR FORM
// ========================================

function clearForm() {

    m3uUrl.value = "";

    m3uTitle.value = "";

    mediaType.value = "m3u";

    m3uSchedule.value = "";

    m3uUrl.focus();

}

// ========================================
// EVENT
// ========================================

savePlaylistBtn.addEventListener("click", savePlaylist);