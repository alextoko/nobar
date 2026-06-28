// ========================================
// playlist/delete.js
// Delete Playlist
// ========================================

import {
    deletePlaylistFromFirebase
} from "./firebase.js";

import {
    playlistBody
} from "./elements.js";

import {
    deletePlaylist,
    getPlaylistById
} from "./state.js";

import {
    renderPlaylistTable
} from "./table.js";

// ========================================
// DELETE PLAYLIST
// ========================================

export async function removePlaylist(id) {

    const playlist = getPlaylistById(id);

    if (!playlist) {

        console.error("❌ Playlist tidak ditemukan.");

        return;

    }

    const confirmDelete = confirm(

        `Yakin ingin menghapus playlist "${playlist.title}"?`

    );

    if (!confirmDelete) return;

    try {

        // ===========================
        // DELETE FIREBASE
        // ===========================

        await deletePlaylistFromFirebase(id);

        // ===========================
        // DELETE STATE
        // ===========================

        deletePlaylist(id);

        // ===========================
        // UPDATE TABLE
        // ===========================

        renderPlaylistTable();

        console.log("🗑 Playlist berhasil dihapus.");

    } catch (err) {

        console.error("❌ Gagal menghapus playlist.", err);

        alert("Gagal menghapus playlist.");

    }

}

// ========================================
// EVENT
// ========================================

playlistBody.addEventListener("click", async (e) => {

    const button = e.target.closest(".delete-btn");

    if (!button) return;

    const row = button.closest("tr");

    if (!row) return;

    await removePlaylist(row.dataset.id);

});