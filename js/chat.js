import { db } from "./firebase.js";

import {
    ref,
    push,
    onChildAdded
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    chatMessages as hostChatMessages,
    chatInput as hostChatInput,
    sendMessageBtn as hostSendMessageBtn,
    hostNameInput
} from "./elements.js";

import {
    chatMessages as viewerChatMessages,
    chatInput as viewerChatInput,
    sendMessageBtn as viewerSendMessageBtn,
    usernameInput
} from "./elements2.js";

// ===========================
// ELEMENT
// ===========================

const chatMessages =
    hostChatMessages || viewerChatMessages;

const chatInput =
    hostChatInput || viewerChatInput;

const sendMessageBtn =
    hostSendMessageBtn || viewerSendMessageBtn;

// ===========================
// CHAT
// ===========================

export function initChat(currentRoomGetter){

    sendMessageBtn?.addEventListener(
        "click",
        () => {

            sendMessage(
                currentRoomGetter()
            );

        }
    );

    chatInput?.addEventListener(
        "keypress",
        e => {

            if(e.key === "Enter"){

                sendMessage(
                    currentRoomGetter()
                );

            }

        }
    );

}

// ===========================
// SEND MESSAGE
// ===========================

export function sendMessage(currentRoom){

    if(!currentRoom) return;

    const text =
        chatInput.value.trim();

    if(!text) return;

    const username =
        hostNameInput?.value.trim() ||
        usernameInput?.value.trim() ||
        "Guest";

    push(
        ref(
            db,
            `rooms/${currentRoom}/chat`
        ),
        {
            user:username,
            text,
            time:Date.now()
        }
    );

    chatInput.value = "";

}

// ===========================
// LOAD CHAT
// ===========================

export function loadChat(currentRoom){

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
                document.createElement(
                    "div"
                );

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

            chatMessages.appendChild(
                div
            );

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        }
    );

}