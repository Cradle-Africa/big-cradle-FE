// utils/formatDate.ts
export const formatDate = (
    isoDate: string,
    options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    },
    locale: string = "en-US"
): string => {
    try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return "Invalid date";
        return date.toLocaleString(locale, options);
    } catch {
        return "Invalid date";
    }
};
