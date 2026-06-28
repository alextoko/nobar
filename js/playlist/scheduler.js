// ========================================
// playlist/scheduler.js
// Playlist Scheduler
// ========================================

import {
    getDuePlaylist
} from "./checker.js";

import {
    playPlaylist
} from "./play.js";

// ========================================
// CONFIG
// ========================================

const CHECK_INTERVAL = 1000;

// ========================================
// STATE
// ========================================

let schedulerId = null;

let lastPlayedId = null;

// ========================================
// START SCHEDULER
// ========================================

export function startScheduler() {

    // Hindari scheduler ganda
    if (schedulerId) {

        console.log("⚠ Scheduler sudah berjalan.");

        return;

    }

    console.log("⏰ Playlist Scheduler Started");

    schedulerId = setInterval(async () => {

        const playlist = getDuePlaylist();

        // Belum ada playlist yang waktunya tiba
        if (!playlist) {

            lastPlayedId = null;

            return;

        }

        // Jangan putar playlist yang sama berulang
        if (playlist.id === lastPlayedId) {

            return;

        }

        console.log("🎬 Auto Play Playlist");

        console.table(playlist);

        lastPlayedId = playlist.id;

        await playPlaylist(playlist.id);

    }, CHECK_INTERVAL);

}

// ========================================
// STOP SCHEDULER
// ========================================

export function stopScheduler() {

    if (!schedulerId) return;

    clearInterval(schedulerId);

    schedulerId = null;

    lastPlayedId = null;

    console.log("🛑 Playlist Scheduler Stopped");

}

// ========================================
// STATUS
// ========================================

export function isSchedulerRunning() {

    return schedulerId !== null;

}