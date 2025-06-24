export const toCamelCase = (str: string): string => {
    return str
        .replace(/[^a-zA-Z0-9 ]/g, "") // Remove non-alphanumeric characters
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, "");
};

export const toSentenceCase = (str: string): string => {
    if (!str) return "";

    // Replace non-alphanumeric characters with space
    let cleaned = str.replace(/[^a-zA-Z0-9]/g, " ");

    // Insert space before capital letters (e.g., "firstName" → "first Name")
    cleaned = cleaned.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Convert to lowercase
    cleaned = cleaned.toLowerCase().trim();

    // Capitalize the first letter
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};
