// ========================================
// playlist/table.js
// Playlist Table Renderer
// ========================================

import {
    playlistBody
} from "./elements.js";

import {
    getPlaylist
} from "./state.js";

// ========================================
// RENDER TABLE
// ========================================

export function renderPlaylistTable() {

    const playlists = getPlaylist();

    // Kosongkan tabel
    playlistBody.innerHTML = "";

    // Jika belum ada playlist
    if (playlists.length === 0) {

        playlistBody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="playlist-empty">
                        📺
                        <p>Belum ada playlist.</p>
                        <small>
                            Tambahkan Playlist M3U atau Film.
                        </small>
                    </div>
                </td>
            </tr>
        `;

        return;

    }

    // Render semua playlist
    playlists.forEach((item, index) => {

        playlistBody.insertAdjacentHTML("beforeend", createRow(item, index));

    });

}

// ========================================
// CREATE ROW
// ========================================

function createRow(item, index) {

    return `

    <tr data-id="${item.id}">

        <td>${index + 1}</td>

        <td>${item.type}</td>

        <td>${item.title}</td>

        <td title="${item.url}">
            ${shortUrl(item.url)}
        </td>

        <td>${formatDate(item.schedule)}</td>

        <td class="playlist-status">
            ${item.status}
        </td>

        <td>

            <button class="play-btn">
                ▶
            </button>

            <button
                class="edit-btn"
                data-id="${item.id}">
                ✏️
            </button>

            <button
                class="delete-btn"
                data-id="${item.id}">
                🗑
            </button>

        </td>

    </tr>

    `;

}

// ========================================
// SHORT URL
// ========================================

function shortUrl(url) {

    if (!url) return "-";

    if (url.length <= 40) return url;

    return url.substring(0, 40) + "...";

}

// ========================================
// FORMAT DATE
// ========================================

function formatDate(date) {

    if (!date) return "-";

    return date.replace("T", " ");

}

import { editPlaylist } from "./edit.js";

playlistBody.addEventListener("click", (e) => {

    const button = e.target.closest(".edit-btn");

    if (!button) return;

    editPlaylist(button.dataset.id);

});