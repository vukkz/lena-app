import fs from "fs";

const FILE = "memory.json";

let memory = {};

export function loadMemory() {
	try {
		const data = fs.readFileSync(FILE, "utf-8");
		memory = JSON.parse(data);
	} catch {
		memory = {};
	}
}

export function getUserMemory(userId) {
	if (!memory[userId]) {
		memory[userId] = {
			notes: [],
			mood: "cold",
			points: 0,
		};
	}

	if (typeof memory[userId].points !== "number") {
		memory[userId].points = 0;
	}

	if (!memory[userId].mood) {
		memory[userId].mood = "cold";
	}

	if (!Array.isArray(memory[userId].notes)) {
		memory[userId].notes = [];
	}

	return memory[userId];
}

export function saveMemory() {
	fs.writeFileSync(FILE, JSON.stringify(memory, null, 2));
}
