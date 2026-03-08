const PLACEHOLDER_DATESTRING = '-';

export const timestampToDateString = (timestamp: string | undefined): string => {
    if (!timestamp) return PLACEHOLDER_DATESTRING;

    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) return PLACEHOLDER_DATESTRING;

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date).toLowerCase();
}