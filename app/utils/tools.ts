export function generateUID() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const formattedDate = (date: string): string => {
  const myDate = new Date(date);
  const formated = new Intl.DateTimeFormat("en-En", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(myDate);

  return `${formated}`;
};
