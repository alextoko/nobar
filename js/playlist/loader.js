// ========================================
// playlist/loader.js
// Playlist Loader
// ========================================

import {
    loadPlaylistFromFirebase
} from "./firebase.js";

import {
    setPlaylist
} from "./state.js";

import {
    renderPlaylistTable
} from "./table.js";

// ========================================
// LOAD PLAYLIST
// ========================================

export async function loadPlaylist() {

    try {

        const playlists = await loadPlaylistFromFirebase();

        setPlaylist(playlists);

        renderPlaylistTable();

        console.log(
            `✅ ${playlists.length} playlist berhasil dimuat.`
        );

    } catch (err) {

        console.error(
            "❌ Gagal memuat playlist.",
            err
        );

    }

}