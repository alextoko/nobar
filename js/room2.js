import { db } from "./firebase.js";

import {
    ref,
    get,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    joinRoomInput,
    joinPasswordInput,
    usernameInput,
    joinRoomBtn,
    roomDisplay
} from "./elements2.js";

// ===========================
// FORM JOIN
// ===========================

export function initJoinForm(){

    joinRoomBtn.disabled = true;

    checkJoinForm();

    usernameInput.addEventListener(
        "input",
        checkJoinForm
    );

    joinRoomInput.addEventListener(
        "input",
        checkJoinForm
    );

    joinPasswordInput.addEventListener(
        "input",
        checkJoinForm
    );

}

function checkJoinForm(){

    joinRoomBtn.disabled =
        !usernameInput.value.trim() ||
        !joinRoomInput.value.trim() ||
        !joinPasswordInput.value.trim();

}

// ===========================
// JOIN ROOM
// ===========================

export function initJoinRoom(
    setCurrentRoom,
    updateViewerUI,
    joinUser,
    loadRoom,
    lockViewer
){

    joinRoomBtn.addEventListener(
        "click",
        async () => {

            const roomId =
                joinRoomInput.value.trim();

            const password =
                joinPasswordInput.value.trim();

            if(!roomId){

                alert(
                    "Masukkan Room ID"
                );

                return;

            }

            const snap =
                await get(
                    ref(
                        db,
                        `rooms/${roomId}`
                    )
                );

            if(!snap.exists()){

                alert(
                    "Room tidak ditemukan"
                );

                return;

            }

            const room =
                snap.val();

            if(
                room.password !==
                password
            ){

                alert(
                    "Password salah"
                );

                return;

            }

            setCurrentRoom(roomId);

            roomDisplay.textContent =
                "Room : " + roomId;

            updateViewerUI();

            joinUser();

            loadRoom();

            lockViewer();

            watchRoomEnded(
                () => roomId
            );

        }

    );

}

// ===========================
// ROOM ENDED
// ===========================

export function watchRoomEnded(
    getCurrentRoom
){

    onValue(
        ref(
            db,
            `rooms/${getCurrentRoom()}/ended`
        ),
        snap => {

            if(!snap.exists()) return;

            if(!snap.val()) return;

            alert(
                "Host telah mengakhiri room"
            );

            location.reload();

        }
    );

}