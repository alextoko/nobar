// ========================================
// index.js
// Viewer v2
// Part 1 - Initialization
// ========================================

import { db } from "./firebase.js";

import {
    ref,
    set,
    get,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {

    videoPlayer,

    refreshVideoBtn,

    fullscreenBtn,

    roomDisplay,

    joinRoomBtn,

    joinRoomInput,

    joinPasswordInput,

    usernameInput,

    onlineCount,

    chatMessages,

    chatInput,

    sendMessageBtn,

    userList

} from "./elements2.js";

import {

    joinUser,
    loadUsers

} from "./users.js";

import {

    initChat,
    loadChat

} from "./chat.js";

import {

    initJoinForm,
    initJoinRoom,
    initLeaveRoom

} from "./room2.js";

import {

    updateViewerUI,
    initFullscreenViewer,
    initAutoJoin

} from "./ui.js";

import {

    log,
    warn,
    error

} from "./logger.js";

// ========================================
// GLOBAL
// ========================================

let currentRoom = "";

let isHost = false;

let ignoreSync = false;

let hostStarted = false;

let hls = null;

let currentMedia = null;

// ========================================
// UID
// ========================================

let uid = localStorage.getItem("uid");

if (!uid) {

    uid =
        "user_" +
        Math.random()
        .toString(36)
        .substring(2, 10);

    localStorage.setItem(
        "uid",
        uid
    );

}

log("Viewer UID :", uid);

// ========================================
// INIT
// ========================================

initFullscreenViewer();

initAutoJoin();

initChat(() => currentRoom);

initJoinForm();

initLeaveRoom();

// ========================================
// JOIN ROOM
// ========================================

initJoinRoom(

    (roomId) => {

        currentRoom = roomId;

        log("Joined Room :", currentRoom);

    },

    updateViewerUI,

    () =>

        joinUser(

            currentRoom,

            uid

        ),

    loadRoom,

    lockViewer

);

// ========================================
// LOAD ROOM
// ========================================

function loadRoom() {

    log("Loading Room...");

    loadUsers(currentRoom);

    loadChat(currentRoom);

    loadVideo();

    setupVideoSync();

}

// ========================================
// LOAD VIDEO
// ========================================

function loadVideo() {

    const mediaRef = ref(
        db,
        `rooms/${currentRoom}/media/current`
    );

    onValue(mediaRef, async (snap) => {

        if (!snap.exists()) {

            warn("Belum ada media.");

            return;

        }

        const media = snap.val();

        currentMedia = media;

        const videoSrc = media.url;
        const mediaType = media.type;
        const mediaTitle = media.title;

        log("MEDIA :", mediaTitle);
        log("TYPE  :", mediaType);
        log("URL   :", videoSrc);

        if (!videoSrc) return;

        // Hindari reload jika URL sama
        if (videoPlayer.dataset.src === videoSrc) {

            return;

        }

        videoPlayer.dataset.src = videoSrc;

        // Bersihkan HLS sebelumnya
        if (hls) {

            hls.destroy();

            hls = null;

        }

        videoPlayer.pause();

        // =====================================
        // HLS (.m3u8)
        // =====================================

        if (videoSrc.includes(".m3u8")) {

            log("Loading HLS...");

            if (Hls.isSupported()) {

                hls = new Hls({

                    enableWorker: true,

                    lowLatencyMode: true

                });

                hls.loadSource(videoSrc);

                hls.attachMedia(videoPlayer);

                hls.on(

                    Hls.Events.MANIFEST_PARSED,

                    async () => {

                        try {

                            const stateSnap = await get(

                                ref(
                                    db,
                                    `rooms/${currentRoom}/state`
                                )

                            );

                            if (stateSnap.exists()) {

                                const state = stateSnap.val();

                                ignoreSync = true;

                                videoPlayer.currentTime =
                                    state.currentTime || 0;

                                if (state.playing) {

                                    await videoPlayer.play();

                                }

                                setTimeout(() => {

                                    ignoreSync = false;

                                }, 300);

                            }

                            log("Viewer Ready");

                        } catch (err) {

                            error(err);

                        }

                    }

                );

                hls.on(

                    Hls.Events.ERROR,

                    (event, data) => {

                        error("========== HLS ERROR ==========");

                        error(data);

                    }

                );

            }

            else if (

                videoPlayer.canPlayType(

                    "application/vnd.apple.mpegurl"

                )

            ) {

                videoPlayer.src = videoSrc;

            }

        }

        // =====================================
        // MP4
        // =====================================

        else {

            videoPlayer.src = videoSrc;

            videoPlayer.load();

            videoPlayer.addEventListener(

                "loadedmetadata",

                async () => {

                    try {

                        const stateSnap = await get(

                            ref(
                                db,
                                `rooms/${currentRoom}/state`
                            )

                        );

                        if (!stateSnap.exists()) return;

                        const state = stateSnap.val();

                        ignoreSync = true;

                        videoPlayer.currentTime =
                            state.currentTime || 0;

                        if (state.playing) {

                            await videoPlayer.play();

                        }

                        setTimeout(() => {

                            ignoreSync = false;

                        }, 300);

                    }

                    catch (err) {

                        error(err);

                    }

                },

                { once: true }

            );

        }

    });

}

// ========================================
// VIDEO SYNC
// ========================================

function setupVideoSync() {

    const stateRef = ref(
        db,
        `rooms/${currentRoom}/state`
    );

    onValue(stateRef, async (snap) => {

        if (!snap.exists()) return;

        const state = snap.val();

        hostStarted = state.playing;

        // Tunggu video siap
        if (videoPlayer.readyState < 1) {

            return;

        }

        ignoreSync = true;

        // =====================================
        // SYNC CURRENT TIME
        // =====================================

        const drift = Math.abs(

            videoPlayer.currentTime -

            state.currentTime

        );

        if (drift > 0.5) {

            log(
                "SYNC TIME :",
                videoPlayer.currentTime,
                "->",
                state.currentTime
            );

            videoPlayer.currentTime =
                state.currentTime;

        }

        // =====================================
        // PLAY / PAUSE
        // =====================================

        try {

            if (state.playing) {

                if (videoPlayer.paused) {

                    await videoPlayer.play();

                    log("▶ Viewer Play");

                }

            } else {

                if (!videoPlayer.paused) {

                    videoPlayer.pause();

                    log("⏸ Viewer Pause");

                }

            }

        } catch (err) {

            error("Viewer Sync Error", err);

        }

        // =====================================
        // RELEASE LOCK
        // =====================================

        setTimeout(() => {

            ignoreSync = false;

        }, 300);

    });

}

// ========================================
// LOCK VIEWER
// ========================================

function lockViewer() {

    videoPlayer.controls = false;

    // ===========================
    // PLAY
    // ===========================

    videoPlayer.addEventListener(
        "play",
        () => {

            if (ignoreSync) return;

            if (!hostStarted) {

                videoPlayer.pause();

            }

        }
    );

    // ===========================
    // PAUSE
    // ===========================

    videoPlayer.addEventListener(
        "pause",
        () => {

            if (ignoreSync) return;

            get(
                ref(
                    db,
                    `rooms/${currentRoom}/state`
                )
            ).then((snap) => {

                if (!snap.exists()) return;

                const state = snap.val();

                if (state.playing) {

                    ignoreSync = true;

                    videoPlayer
                        .play()
                        .catch(() => {});

                    setTimeout(() => {

                        ignoreSync = false;

                    }, 300);

                }

            });

        }
    );

    // ===========================
    // SEEK
    // ===========================

    videoPlayer.addEventListener(
        "seeking",
        () => {

            if (ignoreSync) return;

            get(
                ref(
                    db,
                    `rooms/${currentRoom}/state`
                )
            ).then((snap) => {

                if (!snap.exists()) return;

                const state = snap.val();

                ignoreSync = true;

                videoPlayer.currentTime =
                    state.currentTime;

                setTimeout(() => {

                    ignoreSync = false;

                }, 300);

            });

        }
    );

}