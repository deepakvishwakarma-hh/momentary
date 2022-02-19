import { useEffect, useState } from "react";
import database from "../firebase.config";
import { getDatabase, ref, set, onValue, update } from "firebase/database";

// need to add Fallback when getting error

export async function addMyMessage(roomId: string, oldChat: any, sender: any, message: string) {
    const updates = await update(ref(database, 'room/' + roomId.toString()), {
        chat: [...oldChat, { sender: sender, message: message, cat: +Date.now() }]
    });
    return updates;
}

export async function getRoomData(roomId: string, callback = (data) => { console.log(data) }) {
    const starCountRef = ref(database, 'room/' + roomId);
    onValue(starCountRef, (snapshot) => {
        callback(snapshot.val())
        return snapshot.val()
    });
}


export async function removeMyMessages(roomId: string,
    oldChat: any, email, callback = (data) => { console.log(data) }) {
    const filteradChat = oldChat.filter(data => data.sender.email !== email)
    const updates = await update(ref(database, 'room/' + roomId.toString()), {
        chat: [...filteradChat]
    }).then((data) => {
        callback(data)
    })
    return updates
}

