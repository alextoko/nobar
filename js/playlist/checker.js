// ========================================
// playlist/checker.js
// Playlist Schedule Checker
// ========================================

import {
    getPlaylist
} from "./state.js";

// ========================================
// GET DUE PLAYLIST
// ========================================

export function getDuePlaylist() {

    const playlists = getPlaylist();

    const now = new Date();

    return playlists.find(item => {

        // Tidak memiliki jadwal
        if (!item.schedule) return false;

        // Sudah pernah diputar
        if (item.status !== "Menunggu") return false;

        // Sudah waktunya diputar
        return new Date(item.schedule) <= now;

    }) || null;

}

// ========================================
// HAS DUE PLAYLIST
// ========================================

export function hasDuePlaylist() {

    return getDuePlaylist() !== null;

}

// ========================================
// GET NEXT PLAYLIST
// ========================================

export function getNextPlaylist() {

    const playlists = getPlaylist();

    const now = new Date();

    const next = playlists

        .filter(item => {

            return item.schedule &&
                   item.status === "Menunggu" &&
                   new Date(item.schedule) > now;

        })

        .sort((a, b) => {

            return new Date(a.schedule) - new Date(b.schedule);

        });

    return next.length ? next[0] : null;

}

// ========================================
// GET OVERDUE PLAYLIST
// ========================================

export function getOverduePlaylist() {

    const playlists = getPlaylist();

    const now = new Date();

    return playlists.filter(item => {

        if (!item.schedule) return false;

        if (item.status !== "Menunggu") return false;

        return new Date(item.schedule) < now;

    });

}

// ========================================
// DEBUG
// ========================================

export function printScheduleStatus() {

    const due = getDuePlaylist();

    if (due) {

        console.log("🎬 Playlist Siap Diputar");

        console.table(due);

    } else {

        console.log("⏳ Belum ada playlist yang sesuai jadwal.");

    }

}