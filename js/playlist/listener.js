// ========================================
// playlist/listener.js
// Current Media Listener
// ========================================

import {
    ref,
    onValue
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
// UNSUBSCRIBE
// ========================================

let unsubscribe = null;

// ========================================
// GET PATH
// ========================================

function getCurrentMediaPath() {

    const roomId = getCurrentRoom();

    return `rooms/${roomId}/media/current`;

}

// ========================================
// START LISTENER
// ========================================

export function listenCurrentMedia(callback) {

    const roomId = getCurrentRoom();

    if (!roomId) {

        console.error("❌ Room belum dipilih.");

        return;

    }

    // Hentikan listener sebelumnya
    if (unsubscribe) {

        unsubscribe();

    }

    const mediaRef = ref(

        db,

        getCurrentMediaPath()

    );

    unsubscribe = onValue(mediaRef, (snapshot) => {

        if (!snapshot.exists()) {

            playlistState.current = null;

            console.log("📺 Tidak ada media yang sedang diputar.");

            if (callback) {

                callback(null);

            }

            return;

        }

        const currentMedia = snapshot.val();

        playlistState.current = currentMedia;

        console.log("▶ Current Media Berubah");

        console.table(currentMedia);

        if (callback) {

            callback(currentMedia);

        }

    });

}

// ========================================
// STOP LISTENER
// ========================================

export function stopCurrentMediaListener() {

    if (!unsubscribe) return;

    unsubscribe();

    unsubscribe = null;

    console.log("🛑 Current Media Listener dihentikan.");

}