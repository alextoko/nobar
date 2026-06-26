import { db } from "./firebase.js";

import {
    ref,
    set,
    onValue,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ===========================
// HOST ELEMENT
// ===========================

import {
    hostNameInput,
    userList as hostUserList,
    onlineCount as hostOnlineCount
} from "./elements.js";

// ===========================
// VIEWER ELEMENT
// ===========================

import {
    usernameInput,
    userList as viewerUserList,
    onlineCount as viewerOnlineCount
} from "./elements2.js";

// ===========================
// ELEMENT
// ===========================

const userList =
    hostUserList || viewerUserList;

const onlineCount =
    hostOnlineCount || viewerOnlineCount;

// ===========================
// JOIN USER
// ===========================

export function joinUser(currentRoom, uid) {

    if (typeof currentRoom === "function") {
        currentRoom = currentRoom();
    }

    const username =
        hostNameInput?.value.trim() ||
        usernameInput?.value.trim() ||
        "Guest";

    const userRef =
        ref(
            db,
            `rooms/${currentRoom}/users/${uid}`
        );

    set(
        userRef,
        {
            name: username,
            host: !!hostNameInput
        }
    );

    onDisconnect(userRef).remove();

}

// ===========================
// LOAD USERS
// ===========================

export function loadUsers(currentRoom) {

    if (typeof currentRoom === "function") {
        currentRoom = currentRoom();
    }

    const usersRef =
        ref(
            db,
            `rooms/${currentRoom}/users`
        );

    onValue(
        usersRef,
        snap => {

            userList.innerHTML = "";

            let count = 0;

            const users = [];

            snap.forEach(child => {

                count++;

                users.push(
                    child.val()
                );

            });

            users.sort(
                (a, b) => {

                    if (a.host && !b.host) return -1;

                    if (!a.host && b.host) return 1;

                    return 0;

                }
            );

            users.forEach(user => {

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

                <div class="user-role ${user.host ? "host" : "viewer"}">
                ${user.host ? "HOST" : "VIEWER"}
                </div>
                `;

                userList.appendChild(div);

            });

            onlineCount.textContent =
                "Online : " + count;

        }
    );

}