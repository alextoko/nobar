import { db } from "./firebase.js";

import {
    ref,
    set,
    get,
    push,
    onValue,
    onChildAdded,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

console.log("Firebase Connected");
console.log(db);

set(ref(db, "test"), {
    status: "online",
    time: Date.now()
}).then(() => {
    console.log("Firebase Write Success");
});

// ===========================
// ELEMENT
// ===========================

const roomIdInput = document.getElementById("roomId");
const roomPasswordInput = document.getElementById("roomPassword");
const videoUrlInput = document.getElementById("videoUrl");

const joinRoomInput = document.getElementById("joinRoomId");
const joinPasswordInput = document.getElementById("joinPassword");

const usernameInput = document.getElementById("username");

const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");

const roomDisplay = document.getElementById("roomDisplay");
const onlineCount = document.getElementById("onlineCount");

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendMessageBtn = document.getElementById("sendMessageBtn");

const userList = document.getElementById("userList");

const fullscreenBtn = document.getElementById("fullscreenBtn");
const copyRoomBtn = document.getElementById("copyRoomBtn");

const videoPlayer = document.getElementById("videoPlayer");

// ===========================
// VARIABLE
// ===========================

let currentRoom = "";
let isHost = false;
let ignoreSync = false;

const uid =
    "user_" +
    Math.random()
    .toString(36)
    .substring(2, 10);

// ===========================
// CREATE ROOM
// ===========================

createRoomBtn.addEventListener("click", async () => {

    const roomId =
        roomIdInput.value.trim();

    const password =
        roomPasswordInput.value.trim();

    const videoUrl =
        videoUrlInput.value.trim();

    if (!roomId) {
        alert("Room ID kosong");
        return;
    }

    await set(
        ref(db, `rooms/${roomId}`),
        {
            password,
            videoUrl,
            host: uid,

            state:{
                playing:false,
                currentTime:0,
                updatedAt:Date.now()
            },

            createdAt:Date.now()
        }
    );

    currentRoom = roomId;
    isHost = true;
    updateHostUI();

    roomDisplay.textContent =
        "Room : " + roomId;

    joinUser();
    loadRoom();

    alert("Room berhasil dibuat");

});

// ===========================
// JOIN ROOM
// ===========================

joinRoomBtn.addEventListener("click", async () => {

    const roomId =
        joinRoomInput.value.trim();

    const password =
        joinPasswordInput.value.trim();

    if (!roomId) {
        alert("Masukkan Room ID");
        return;
    }

    const snap = await get(
        ref(db, `rooms/${roomId}`)
    );

    if (!snap.exists()) {
        alert("Room tidak ditemukan");
        return;
    }

    const room = snap.val();

    if (room.password !== password) {
        alert("Password salah");
        return;
    }

    currentRoom = roomId;

    roomDisplay.textContent =
        "Room : " + roomId;

    isHost = room.host === uid;
    updateHostUI();

    joinUser();
    loadRoom();

});

// ===========================
// JOIN USER
// ===========================

function joinUser() {

    const username =
        usernameInput.value.trim() ||
        "Guest";

    const userRef =
        ref(
            db,
            `rooms/${currentRoom}/users/${uid}`
        );

    set(userRef, {
        name: username
    });

    onDisconnect(userRef).remove();

}

// ===========================
// LOAD ROOM
// ===========================

function loadRoom() {

    loadUsers();
    loadChat();
    loadVideo();
    setupVideoSync();
}

// ===========================
// LOAD USERS
// ===========================

function loadUsers() {

    const usersRef =
        ref(
            db,
            `rooms/${currentRoom}/users`
        );

    onValue(usersRef, snap => {

        userList.innerHTML = "";

        let count = 0;

        snap.forEach(child => {

            count++;

            const user =
                child.val();

            const div =
                document.createElement("div");

            div.className =
                "user-item";

            div.innerHTML = `
            <div class="user-avatar">
            ${user.name.charAt(0).toUpperCase()}
            </div>

            <div class="user-name">
            ${user.name}
            </div>
            `;

            userList.appendChild(div);

        });

        onlineCount.textContent =
            "Online : " + count;

    });

}

// ===========================
// CHAT
// ===========================

sendMessageBtn.addEventListener(
    "click",
    sendMessage
);

chatInput.addEventListener(
    "keypress",
    e => {

        if (e.key === "Enter") {
            sendMessage();
        }

    }
);

function sendMessage() {

    if (!currentRoom) return;

    const text =
        chatInput.value.trim();

    if (!text) return;

    const username =
        usernameInput.value.trim() ||
        "Guest";

    push(
        ref(
            db,
            `rooms/${currentRoom}/chat`
        ),
        {
            user: username,
            text,
            time: Date.now()
        }
    );

    chatInput.value = "";

}

function loadChat() {

    chatMessages.innerHTML = "";

    const chatRef =
        ref(
            db,
            `rooms/${currentRoom}/chat`
        );

    onChildAdded(
        chatRef,
        snap => {

            const msg =
                snap.val();

            const div =
                document.createElement("div");

            div.className =
                "chat-message";

            div.innerHTML = `
            <div class="chat-user">
            ${msg.user}
            </div>

            <div class="chat-text">
            ${msg.text}
            </div>
            `;

            chatMessages.appendChild(div);

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        }
    );

}

// ===========================
// LOAD VIDEO
// ===========================

function convertDriveUrl(url){

    const match = url.match(/\/d\/([^\/]+)/);

    if(!match) return url;

    const fileId = match[1];

    const API_KEY = "AIzaSyD8BmFBsIS8jqM1z2XoQqGNbfgUryz89tY";

    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`;

}

function loadVideo() {

    const roomRef =
        ref(
            db,
            `rooms/${currentRoom}`
        );

    onValue(roomRef, snap => {

        if (!snap.exists()) return;

        const room =
            snap.val();

        if(room.videoUrl){

        videoPlayer.src =
        convertDriveUrl(room.videoUrl);

}

    });

}

function setupVideoSync(){

    const stateRef =
        ref(db, `rooms/${currentRoom}/state`);

    onValue(stateRef, snap => {

        if(!snap.exists()) return;

        if(isHost) return;

        const state = snap.val();

        ignoreSync = true;

        if(
            Math.abs(
                videoPlayer.currentTime -
                state.currentTime
            ) > 2
        ){
            videoPlayer.currentTime =
                state.currentTime;
        }

        if(state.playing){
            videoPlayer.play();
        }else{
            videoPlayer.pause();
        }

        setTimeout(()=>{
            ignoreSync = false;
        },500);

    });

}

function updateHostUI(){

    if(isHost){

        videoPlayer.controls = true;

        videoPlayer.style.pointerEvents = "auto";

        return;
    }

    videoPlayer.controls = false;

    videoPlayer.style.pointerEvents = "none";

}

// ===========================
// FULLSCREEN
// ===========================

fullscreenBtn.addEventListener(
    "click",
    () => {

        videoPlayer.requestFullscreen();

    }
);

// ===========================
// COPY ROOM LINK
// ===========================

copyRoomBtn.addEventListener(
    "click",
    () => {

        if (!currentRoom) {
            alert("Belum masuk room");
            return;
        }

        const url =
            `${location.origin}${location.pathname}?room=${currentRoom}`;

        navigator.clipboard.writeText(url);

        alert("Link room berhasil disalin");

    }
);

// ===========================
// AUTO JOIN URL
// ===========================

videoPlayer.addEventListener("play", async ()=>{

    if(!isHost) return;
    if(ignoreSync) return;

    await set(
        ref(db, `rooms/${currentRoom}/state`),
        {
            playing:true,
            currentTime:videoPlayer.currentTime,
            updatedAt:Date.now()
        }
    );

});

videoPlayer.addEventListener("pause", async ()=>{

    if(!isHost) return;
    if(ignoreSync) return;

    await set(
        ref(db, `rooms/${currentRoom}/state`),
        {
            playing:false,
            currentTime:videoPlayer.currentTime,
            updatedAt:Date.now()
        }
    );

});

videoPlayer.addEventListener("seeked", async ()=>{

    if(!isHost) return;
    if(ignoreSync) return;

    await set(
        ref(db, `rooms/${currentRoom}/state`),
        {
            playing:!videoPlayer.paused,
            currentTime:videoPlayer.currentTime,
            updatedAt:Date.now()
        }
    );

});

const params =
    new URLSearchParams(
        location.search
    );

const roomParam =
    params.get("room");

if (roomParam) {

    joinRoomInput.value =
        roomParam;

}
