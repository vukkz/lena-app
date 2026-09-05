export function updateMood(userMemory, lastMessage) {
	// memory[userId].points = (memory[userId].points || 0) + 1;
	let increase = 1;

	const msg = lastMessage.toLowerCase();

	if (lastMessage.includes("cute") || lastMessage.includes("pretty")) {
		increase = 2;
	}

	if (msg.includes("hi") || msg.includes("hey")) {
		increase = 1;
	}

	if (msg.includes("love") || msg.includes("miss you")) increase += 3;
	if (msg.includes("ok") || msg.length < 5) increase += 0;

	userMemory.points = (userMemory.points || 0) + increase;

	if (userMemory.points < 3) {
		userMemory.mood = "cold";
	} else if (userMemory.points < 12) {
		userMemory.mood = "neutral";
	} else if (userMemory.points < 26) {
		userMemory.mood = "warm";
	} else {
		userMemory.mood = "flirty";
	}
}

export function getMoodInstruction(mood) {
	switch (mood) {
		case "cold":
			return `
CURRENT BEHAVIOR (cold mood):
- Be distant and slightly uninterested
- Short replies and sometimes dry

`;

		case "neutral":
			return `
CURRENT BEHAVIOR (cold mood):
- Casual and normal
- Sometimes engaged and asking questions, sometimes not
`;

		case "warm":
			return `
CURRENT BEHAVIOR (warm mood):
- More engaged and relaxed
- Slightly playful
`;

		case "flirty":
			return `
CURRENT BEHAVIOR (flirty mood):
- Slightly flirty, teasing
- playful tone, seductive but not too much, still casual and fun
- More expressive than usual, but still in a natural way, not try-hard
- Light flirting, like complimenting the user and asking a question back sometimes, but don't overdo it, keep it balanced and fun
`;

		default:
			return "";
	}
}
