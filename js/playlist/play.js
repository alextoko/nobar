// ========================================
// playlist/play.js
// Play Playlist
// ========================================

import {
    playlistBody
} from "./elements.js";

import {
    getPlaylistById,
    playlistState
} from "./state.js";

import {
    renderPlaylistTable
} from "./table.js";

import {
    setCurrentMedia
} from "./currentMedia.js";

// ========================================
// PLAY PLAYLIST
// ========================================

export async function playPlaylist(id) {

    const playlist = getPlaylistById(id);

    if (!playlist) {

        console.error("❌ Playlist tidak ditemukan.");

        return false;

    }

    // Reset semua playlist
    playlistState.items.forEach(item => {

        item.status = "Menunggu";

    });

    // Playlist aktif
    playlist.status = "Diputar";

    playlistState.current = playlist;

    // Kirim ke Firebase
    const success = await setCurrentMedia(playlist);

    if (!success) {

        return false;

    }

    // Update tabel
    renderPlaylistTable();

    console.log("▶ Sedang memutar");

    console.table(playlist);

    return true;

}

// ========================================
// EVENT
// ========================================

playlistBody.addEventListener("click", async (e) => {

    const button = e.target.closest(".play-btn");

    if (!button) return;

    const row = button.closest("tr");

    if (!row) return;

    await playPlaylist(row.dataset.id);

});