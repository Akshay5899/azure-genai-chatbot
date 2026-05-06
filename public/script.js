async function sendMessage() {
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

const message = input.value.trim();
if (!message) return;

addMessage(message, "user");
input.value = "";

const typing = addMessage("Typing...", "bot");

try {
const res = await fetch("/api/chat", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ message })
});

const data = await res.json();
typing.remove();
addMessage(data.reply, "bot");

} catch (err) {
typing.innerText = "Error...";
}

chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessage(text, type) {
const msg = document.createElement("div");
msg.classList.add("message", type);
msg.innerText = text;
document.getElementById("chat-box").appendChild(msg);
return msg;
}

// Add Enter key support for sending messages
document.getElementById("user-input").addEventListener("keypress", function(event) {
if (event.key === "Enter") {
sendMessage();
}
});

// Add default welcome message on page load
window.addEventListener("load", function() {
addMessage("Hello! I'm your AI assistant. How can I help you today?", "bot");
});
