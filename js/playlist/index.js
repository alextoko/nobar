// ========================================
// playlist/index.js
// Playlist Module Initialization
// ========================================

import {
    playlistCard,
    addPlaylistBtn,
    m3uUrl,
    m3uTitle,
    mediaType,
    m3uSchedule,
    savePlaylistBtn,
    playlistBody,
    playlistEmpty
} from "./elements.js";

import "./table.js";
import "./add.js";
import "./edit.js";
import "./delete.js";
import "./play.js";

// ========================================
// CHECK ELEMENT
// ========================================

function checkElement(name, element) {

    if (!element) {

        console.error(`❌ ${name} tidak ditemukan`);

        return;

    }

    console.log(`✅ ${name}`);

}

// ========================================
// INIT
// ========================================

export function initPlaylist() {

    console.group("🎬 Playlist Module");

    checkElement("Playlist Card", playlistCard);
    checkElement("Tambah Playlist", addPlaylistBtn);
    checkElement("URL Media", m3uUrl);
    checkElement("Judul", m3uTitle);
    checkElement("Jenis Media", mediaType);
    checkElement("Jadwal", m3uSchedule);
    checkElement("Simpan Playlist", savePlaylistBtn);
    checkElement("Playlist Body", playlistBody);
    checkElement("Playlist Empty", playlistEmpty);

    console.log("✅ Playlist Module Ready");

    console.groupEnd();

}

// ========================================
// AUTO INIT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    initPlaylist();

});