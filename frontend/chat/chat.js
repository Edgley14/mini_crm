// chat/chat.js
import { db } from '../scripts/firebase-config.js';
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const chatRef = ref(db, 'chat/mensajes');

const chatList = document.getElementById("chatList");
const input = document.getElementById("chatInput");
const btn = document.getElementById("enviarBtn");

if (chatList && input && btn) {
  btn.addEventListener("click", () => {
    const mensaje = input.value.trim();
    if (!mensaje) return;
    push(chatRef, {
      usuario: localStorage.getItem("usuario") || "Anónimo",
      mensaje,
      timestamp: Date.now()
    });
    input.value = "";
  });

  onChildAdded(chatRef, (data) => {
    const msg = data.val();
    const li = document.createElement("li");
    li.innerHTML = `<strong>${msg.usuario}:</strong> ${msg.mensaje}`;
    chatList.appendChild(li);
    chatList.scrollTop = chatList.scrollHeight;
  });
}
