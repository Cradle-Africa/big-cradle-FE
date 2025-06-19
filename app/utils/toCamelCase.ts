export const toCamelCase = (str: string): string => {
    return str
        .replace(/[^a-zA-Z0-9 ]/g, "") // Remove non-alphanumeric characters
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, "");
};
