// ========================================
// playlist/state.js
// Playlist State Manager
// ========================================

export const playlistState = {

    // Semua data playlist
    items: [],

    // Playlist yang sedang dipilih
    selected: null,

    // ID playlist yang sedang diedit
    editingId: null,

    // Status edit
    isEditing: false,

    // Playlist yang sedang diputar
    current: null

};

// ========================================
// SET PLAYLIST
// ========================================

export function setPlaylist(list = []) {

    playlistState.items = [...list];

}

// ========================================
// GET PLAYLIST
// ========================================

export function getPlaylist() {

    return playlistState.items;

}

// ========================================
// ADD PLAYLIST
// ========================================

export function addPlaylist(item) {

    playlistState.items.push(item);

}

// ========================================
// UPDATE PLAYLIST
// ========================================

export function updatePlaylist(id, newData) {

    const index = playlistState.items.findIndex(item => item.id === id);

    if (index === -1) return false;

    playlistState.items[index] = {

        ...playlistState.items[index],
        ...newData

    };

    return true;

}

// ========================================
// DELETE PLAYLIST
// ========================================

export function deletePlaylist(id) {

    playlistState.items = playlistState.items.filter(item => item.id !== id);

}

// ========================================
// GET PLAYLIST BY ID
// ========================================

export function getPlaylistById(id) {

    return playlistState.items.find(item => item.id === id);

}

// ========================================
// CLEAR PLAYLIST
// ========================================

export function clearPlaylist() {

    playlistState.items = [];

}

// ========================================
// DEBUG
// ========================================

export function printPlaylistState() {

    console.table(playlistState.items);

}