// Helper function to hash the username to a number
export const stringToHash = (str: string) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 10) - hash + str.charCodeAt(i);
		hash |= 0; // Convert to 32-bit integer
	}
	return hash;
};

// Helper function to generate a random color based on a seed
export const generateColorFromSeed = (seed: number) => {
	// Using modulo to ensure RGB values are between 0 and 255
	const r = (((seed * 123) % 256) + 256) % 256; // Ensure positive value
	const g = (((seed * 456) % 256) + 256) % 256; // Ensure positive value
	const b = (((seed * 789) % 256) + 256) % 256; // Ensure positive value
	return `rgb(${r},${g},${b})`;
};
