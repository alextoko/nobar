// ========================================
// playlist/room.js
// Playlist Room Manager
// ========================================

// ========================================
// STATE
// ========================================

let currentRoom = "";

// ========================================
// SET ROOM
// ========================================

export function setCurrentRoom(roomId) {

    if (!roomId) {

        console.warn("⚠ Room ID kosong.");

        return;

    }

    currentRoom = roomId;

    console.log("🏠 Playlist Room :", currentRoom);

}

// ========================================
// GET ROOM
// ========================================

export function getCurrentRoom() {

    return currentRoom;

}

// ========================================
// HAS ROOM
// ========================================

export function hasCurrentRoom() {

    return currentRoom !== "";

}

// ========================================
// CLEAR ROOM
// ========================================

export function clearCurrentRoom() {

    currentRoom = "";

    console.log("🗑 Playlist Room dihapus.");

}

// ========================================
// DEBUG
// ========================================

export function printCurrentRoom() {

    console.log("Current Room :", currentRoom);

}