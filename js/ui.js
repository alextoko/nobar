import { db } from "./firebase.js";

import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ===========================
// HOST ELEMENT
// ===========================

import {
    fullscreenBtn as hostFullscreenBtn,
    copyRoomBtn,
    endRoomBtn,
    videoPlayer as hostVideoPlayer
} from "./elements.js";

// ===========================
// VIEWER ELEMENT
// ===========================

import {
    videoPlayer as viewerVideoPlayer,
    fullscreenBtn as viewerFullscreenBtn,
    joinRoomInput
} from "./elements2.js";

// ===========================
// HOST FULLSCREEN
// ===========================

export function initFullscreenHost() {

    hostFullscreenBtn?.addEventListener(
        "click",
        () => {

            hostVideoPlayer.requestFullscreen();

        }
    );

}

// ===========================
// VIEWER FULLSCREEN
// ===========================

export function initFullscreenViewer() {

    viewerFullscreenBtn?.addEventListener(
        "click",
        () => {

            viewerVideoPlayer.requestFullscreen();

        }
    );

}

// ===========================
// COPY ROOM LINK
// ===========================

export function initCopyRoom(currentRoomGetter) {

    copyRoomBtn?.addEventListener(
        "click",
        () => {

            const currentRoom =
                currentRoomGetter();

            if (!currentRoom) {

                alert("Belum masuk room");
                return;

            }

            const url =
                `${location.origin}/index.html?room=${currentRoom}`;

            navigator.clipboard.writeText(url);

            alert("Link room berhasil disalin");

        }
    );

}

// ===========================
// END ROOM
// ===========================

export function initEndRoom(currentRoomGetter) {

    endRoomBtn?.addEventListener(
        "click",
        async () => {

            const currentRoom =
                currentRoomGetter();

            if (!currentRoom) {

                alert("Belum ada room aktif");
                return;

            }

            const ok =
                confirm("Yakin ingin mengakhiri room?");

            if (!ok) return;

            await set(
                ref(
                    db,
                    `rooms/${currentRoom}/ended`
                ),
                true
            );

            alert("Room telah diakhiri");

        }
    );

}

// ===========================
// VIEWER UI
// ===========================

export function updateViewerUI() {

    viewerVideoPlayer.controls =
        false;

    viewerVideoPlayer.style.pointerEvents =
        "none";

}

// ===========================
// AUTO JOIN URL
// ===========================

export function initAutoJoin() {

    const params =
        new URLSearchParams(
            location.search
        );

    const roomParam =
        params.get("room");

    if (
        roomParam &&
        joinRoomInput
    ) {

        joinRoomInput.value =
            roomParam;

    }

}