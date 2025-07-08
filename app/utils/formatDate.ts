// utils/formatDate.ts
export const formatDate = (isoDate: string): string => {
    try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return "Invalid date";

        const day = date.getDate();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // ensure leading zero
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return `${day}-${month}-${year} at ${hours}:${minutes} ${ampm}`;
    } catch {
        return "Invalid date";
    }
};
