// ========================================
// playlist/edit.js
// Edit Playlist
// ========================================

import {

    m3uUrl,
    m3uTitle,
    mediaType,
    m3uSchedule,
    savePlaylistBtn

} from "./elements.js";

import {

    playlistState,
    getPlaylistById

} from "./state.js";

// ========================================
// START EDIT
// ========================================

export function editPlaylist(id) {

    const playlist = getPlaylistById(id);

    if (!playlist) {

        console.error("❌ Playlist tidak ditemukan.");

        return;

    }

    // ===========================
    // MODE EDIT
    // ===========================

    playlistState.isEditing = true;

    playlistState.editingId = id;

    // ===========================
    // ISI FORM
    // ===========================

    m3uUrl.value = playlist.url;

    m3uTitle.value = playlist.title;

    mediaType.value = playlist.type;

    m3uSchedule.value = playlist.schedule || "";

    // ===========================
    // UPDATE BUTTON
    // ===========================

    savePlaylistBtn.textContent = "Update Playlist";

    savePlaylistBtn.dataset.mode = "edit";

    // ===========================
    // FOCUS
    // ===========================

    m3uUrl.focus();

    console.log("✏️ Edit Playlist");

    console.table(playlist);

}

// ========================================
// CANCEL EDIT
// ========================================

export function cancelEdit() {

    playlistState.isEditing = false;

    playlistState.editingId = null;

    savePlaylistBtn.textContent = "Simpan";

    savePlaylistBtn.dataset.mode = "add";

}

// ========================================
// CHECK EDIT MODE
// ========================================

export function isEditing() {

    return playlistState.isEditing;

}