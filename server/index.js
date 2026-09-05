import express from "express";
import cors from "cors";
import { loadMemory, getUserMemory, saveMemory } from "./memory.js";
import { updateMood, getMoodInstruction } from "./mood.js";
import { buildPrompt } from "./prompt.js";

const app = express();

app.use(cors());
app.use(express.json());

loadMemory();

app.post("/chat", async (req, res) => {
	try {
		const { messages = [] } = req.body;

		const recentMessages = messages.slice(-8);

		const userId = "default";
		const userMemory = getUserMemory(userId);

		const conversation = recentMessages
			.map((m) => {
				if (m.role === "user") return `User: ${m.content}`;
				return `Lena (casual): ${m.content}`;
			})
			.join("\n");

		const memoryText = userMemory.notes.join(", ");

		const moodInstruction = getMoodInstruction(userMemory.mood);

		const fullPrompt = buildPrompt({
			memoryText,
			conversation,
			moodInstruction,
			mood: userMemory.mood,
		});

		const response = await fetch("http://localhost:11434/api/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "mistral",
				prompt: fullPrompt,
				stream: false,
			}),
		});

		const data = await response.json();
		console.log("OLLAMA RAW RESPONSE:", data);

		let reply = data.response || "Sorry, I don't have a response right now.";

		if (!reply) {
			console.error("Ollama response error:", data);
			return res.json({ reply: "..." }); // fallback message
		}

		// reply cutting-----
		reply = reply.replace(/^Lena.*?:\s*/i, "");
		reply = reply.split(/[.!?]/)[0];

		// if (reply.length > 120) {
		// 	reply = reply.slice(0, 120);
		// }

		// checking the last message and pushing the memory----
		const lastUserMsgObj = [...messages]
			.reverse()
			.find((m) => m.role === "user");

		const lastUserMessage = lastUserMsgObj?.content || "";

		if (lastUserMessage) {
			userMemory.notes.push(lastUserMessage);
			userMemory.notes = userMemory.notes.slice(-10);
		}

		// update mood
		updateMood(userMemory, lastUserMessage);

		saveMemory();

		res.json({ reply });
	} catch (err) {
		console.error("ERROR:", err);
		res.status(500).json({ error: err.message });
	}
});

app.listen(3000, () => {
	console.log("Server running on http://localhost:3000");
});
