const PLACEHOLDER_DATESTRING = '-';

const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) {
        return 'th';
    }

    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
};

export const timestampToDateString = (timestamp: string | undefined): string => {
    if (!timestamp) return PLACEHOLDER_DATESTRING;

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) return PLACEHOLDER_DATESTRING;

    const month = date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    const year = date.getFullYear();

    return `${month} ${day}${suffix}, ${year}`;
}