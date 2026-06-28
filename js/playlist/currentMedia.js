// ========================================
// playlist/currentMedia.js
// Current Media Manager
// ========================================

import {
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    db
} from "../firebase.js";

import {
    playlistState
} from "./state.js";

import {
    getCurrentRoom
} from "./room.js";

// ========================================
// GET PATH
// ========================================

function getCurrentMediaPath() {

    const roomId = getCurrentRoom();

    return `rooms/${roomId}/media/current`;

}

// ========================================
// SET CURRENT MEDIA
// ========================================

export async function setCurrentMedia(playlist) {

    const roomId = getCurrentRoom();

    if (!roomId) {

        console.error("❌ Room belum dipilih.");

        return false;

    }

    if (!playlist) {

        console.error("❌ Playlist tidak valid.");

        return false;

    }

    try {

        const currentMedia = {

            id: playlist.id,

            title: playlist.title,

            url: playlist.url,

            type: playlist.type,

            schedule: playlist.schedule || "",

            status: "playing",

            startedAt: Date.now()

        };

        await set(

            ref(db, getCurrentMediaPath()),

            currentMedia

        );

        playlistState.current = currentMedia;

        console.log("▶ Current Media diperbarui.");

        console.table(currentMedia);

        return true;

    } catch (err) {

        console.error("❌ Gagal menyimpan Current Media.", err);

        return false;

    }

}

// ========================================
// GET CURRENT MEDIA
// ========================================

export async function getCurrentMedia() {

    const roomId = getCurrentRoom();

    if (!roomId) return null;

    try {

        const snapshot = await get(

            ref(db, getCurrentMediaPath())

        );

        if (!snapshot.exists()) {

            return null;

        }

        return snapshot.val();

    } catch (err) {

        console.error("❌ Gagal membaca Current Media.", err);

        return null;

    }

}

// ========================================
// CLEAR CURRENT MEDIA
// ========================================

export async function clearCurrentMedia() {

    const roomId = getCurrentRoom();

    if (!roomId) return;

    try {

        await set(

            ref(db, getCurrentMediaPath()),

            null

        );

        playlistState.current = null;

        console.log("🗑 Current Media dibersihkan.");

    } catch (err) {

        console.error("❌ Gagal menghapus Current Media.", err);

    }

}