let messages = [];

window.sendMessage = async function () {
	const input = document.getElementById("input");
	const text = input.value;

	if (!text) return;

	addMessage("You", text, "user");

	messages.push({ role: "user", content: text });

	input.value = "";

	const res = await fetch("http://localhost:3000/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ messages }),
	});

	const data = await res.json();

	addMessage("Lena", data.reply, "bot");

	messages.push({ role: "assistant", content: data.reply });
};

document.getElementById("sendBtn").addEventListener("click", sendMessage);

function addMessage(sender, text, className) {
	const div = document.createElement("div");
	div.className = className;
	div.innerHTML = `<b>${sender}:</b> ${text}`;

	const messagesDiv = document.getElementById("messages");
	messagesDiv.appendChild(div);

	messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
