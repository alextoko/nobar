import { db } from "./firebase.js";
import {
    joinRoomInput,
    joinPasswordInput,
    usernameInput,
    joinRoomBtn,
    roomDisplay,
    onlineCount,
    chatMessages,
    chatInput,
    sendMessageBtn,
    userList,
    fullscreenBtn,
    videoPlayer
} from "./elements2.js";

import {
ref,
set,
get,
push,
onValue,
onChildAdded,
onDisconnect
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
    initJoinRoom
} from "./room2.js";

import {
    updateViewerUI,
    initFullscreenViewer,
    initAutoJoin
} from "./ui.js";

console.log("Firebase Connected");
console.log(db);

// ===========================
// VARIABLE
// ===========================

let currentRoom = "";
let isHost = false;
let ignoreSync = false;
let hostStarted = false;
let hls = null;

let uid =
localStorage.getItem("uid");

if(!uid){


uid =
    "user_" +
    Math.random()
    .toString(36)
    .substring(2,10);

localStorage.setItem(
    "uid",
    uid
);
}

initFullscreenViewer();
initAutoJoin();
initChat(() => currentRoom);
initJoinForm();

initJoinRoom(

    (roomId)=>{
        currentRoom = roomId;
    },

    updateViewerUI,

    ()=>joinUser(
        currentRoom,
        uid
    ),

    loadRoom,

    lockViewer

);

// ===========================
// LOAD ROOM
// ===========================

function loadRoom(){

loadUsers(currentRoom);
loadChat(currentRoom);
loadVideo();
setupVideoSync();

}

// ===========================
// LOAD VIDEO
// ===========================

function loadVideo(){


const videoRef =
    ref(
        db,
        `rooms/${currentRoom}/videoUrl`
    );

onValue(
    videoRef,
    snap => {

        if(!snap.exists()) return;

        const videoSrc =
            snap.val();

        console.log(
            "Video SRC :",
            videoSrc
        );

        if(hls){

            hls.destroy();
            hls = null;

        }

        videoPlayer.pause();

        if(
            videoSrc.includes(
                ".m3u8"
            )
        ){

            if(
                Hls.isSupported()
            ){

                hls =
                    new Hls({

                    enableWorker:true,
                    lowLatencyMode:true

                });

                hls.loadSource(
                    videoSrc
                );

                hls.attachMedia(
                    videoPlayer
                );

            }
            else if(
                videoPlayer.canPlayType(
                    "application/vnd.apple.mpegurl"
                )
            ){

                videoPlayer.src =
                    videoSrc;

            }

        }else{

            videoPlayer.src =
                videoSrc;

            videoPlayer.load();

        }

    }
);

videoPlayer.addEventListener(
    "loadedmetadata",
    async () => {

        const snap =
            await get(
                ref(
                    db,
                    `rooms/${currentRoom}/state`
                )
            );

        if(!snap.exists()) return;

        const state =
            snap.val();

        ignoreSync = true;

        videoPlayer.currentTime =
            state.currentTime;

        if(state.playing){

            await videoPlayer
                .play()
                .catch(()=>{});

        }else{

            videoPlayer.pause();

        }

        setTimeout(
            () => {

                ignoreSync = false;

            },
            1000
        );

    }
);


}

// ===========================
// VIDEO SYNC
// ===========================

function setupVideoSync(){


const stateRef =
    ref(
        db,
        `rooms/${currentRoom}/state`
    );

onValue(
    stateRef,
    snap => {

        if(!snap.exists()) return;

        const state =
            snap.val();

        hostStarted =
            state.playing;

        if(
            videoPlayer.readyState < 1
        ){
            return;
        }

        ignoreSync = true;

        const drift =
            Math.abs(
                videoPlayer.currentTime -
                state.currentTime
            );

        if(drift > 0.5){

            videoPlayer.currentTime =
                state.currentTime;

        }

        if(state.playing){

            videoPlayer
                .play()
                .catch(()=>{});

        }else{

            videoPlayer.pause();

        }

        setTimeout(
            () => {

                ignoreSync = false;

            },
            300
        );

    }
);


}

// ===========================
// LOCK VIEWER
// ===========================

function lockViewer(){


videoPlayer.controls =
    false;

videoPlayer.addEventListener(
    "play",
    () => {

        if(ignoreSync) return;

        if(!hostStarted){

            videoPlayer.pause();

        }

    }
);

videoPlayer.addEventListener(
    "pause",
    () => {

        if(ignoreSync) return;

        get(
            ref(
                db,
                `rooms/${currentRoom}/state`
            )
        ).then(
            snap => {

                if(!snap.exists()) return;

                const state =
                    snap.val();

                if(state.playing){

                    ignoreSync =
                        true;

                    videoPlayer
                        .play()
                        .catch(()=>{});

                    setTimeout(
                        () => {

                            ignoreSync =
                                false;

                        },
                        300
                    );

                }

            }
        );

    }
);

videoPlayer.addEventListener(
    "seeking",
    () => {

        if(ignoreSync) return;

        get(
            ref(
                db,
                `rooms/${currentRoom}/state`
            )
        ).then(
            snap => {

                if(!snap.exists()) return;

                const state =
                    snap.val();

                ignoreSync =
                    true;

                videoPlayer.currentTime =
                    state.currentTime;

                setTimeout(
                    () => {

                        ignoreSync =
                            false;

                    },
                    300
                );

            }
        );

    }
);

}
