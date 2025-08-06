// utils/formatDate.ts
export const formatDate = (isoDate: string): string => {
    try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return "-";

        const day = date.getDate();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // ensure leading zero
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return `${day}-${month}-${year} at ${hours}:${minutes} ${ampm}`;
    } catch {
        return "-";
    }
};


// Utility to convert ISO week (e.g., 2025-W30) to readable date range
export function formatISOWeekToRange(isoWeek: string): string {
    const [yearStr, weekStr] = isoWeek.split("-W");
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);

    // Approximate date of the Monday of the given ISO week
    const simpleDate = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simpleDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    const monday = new Date(simpleDate);
    monday.setDate(simpleDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust to Monday

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); // Sunday of the same week

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

    return `${monday.toLocaleDateString(undefined, options)} - ${sunday.toLocaleDateString(undefined, options)}`;
}

