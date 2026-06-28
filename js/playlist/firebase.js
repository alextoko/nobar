// ========================================
// playlist/firebase.js
// Playlist Firebase Service
// ========================================

import {
    ref,
    set,
    get,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    db
} from "../firebase.js";

import {
    getCurrentRoom
} from "./room.js";

// ========================================
// GET PLAYLIST PATH
// ========================================

function getPlaylistPath() {

    const roomId = getCurrentRoom();

    if (!roomId) {

        throw new Error("Room belum dipilih.");

    }

    return `rooms/${roomId}/playlist`;

}

// ========================================
// SAVE PLAYLIST
// ========================================

export async function savePlaylistToFirebase(playlist) {

    try {

        await set(

            ref(
                db,
                `${getPlaylistPath()}/${playlist.id}`
            ),

            playlist

        );

        console.log("✅ Playlist disimpan :", playlist.title);

    } catch (err) {

        console.error("❌ Gagal menyimpan playlist", err);

    }

}

// ========================================
// LOAD PLAYLIST
// ========================================

export async function loadPlaylistFromFirebase() {

    try {

        const snapshot = await get(

            ref(
                db,
                getPlaylistPath()
            )

        );

        if (!snapshot.exists()) {

            return [];

        }

        return Object.values(snapshot.val());

    } catch (err) {

        console.error("❌ Gagal membaca playlist", err);

        return [];

    }

}

// ========================================
// UPDATE PLAYLIST
// ========================================

export async function updatePlaylistToFirebase(playlist) {

    try {

        await set(

            ref(
                db,
                `${getPlaylistPath()}/${playlist.id}`
            ),

            playlist

        );

        console.log("✅ Playlist diperbarui :", playlist.title);

    } catch (err) {

        console.error("❌ Gagal update playlist", err);

    }

}

// ========================================
// DELETE PLAYLIST
// ========================================

export async function deletePlaylistFromFirebase(id) {

    try {

        await remove(

            ref(
                db,
                `${getPlaylistPath()}/${id}`
            )

        );

        console.log("🗑 Playlist dihapus");

    } catch (err) {

        console.error("❌ Gagal menghapus playlist", err);

    }

}