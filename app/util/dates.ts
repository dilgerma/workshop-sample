export const normalizeToMidnight = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const isWithinRange = (today:Date, from:Date, to:Date): boolean => {
    // Check if 'today' is within the 'from' and 'to' range (inclusive)
    return today >= from && today <= to;
}

export const isToday = (date:Date) => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

export const isSameDay = (date1:Date, date2:Date) => {
    return date1.toLocaleDateString('en-US' ) ===
        date2.toLocaleDateString('en-US');
}

export const countDays = (date1 , date2) => {
    // Calculate the difference in time (milliseconds)
    const diffInMilliseconds = date2 - date1;

// Convert the difference to days
    let days = diffInMilliseconds / (1000 * 60 * 60 * 24);
    return days <=0 ? 1 : days
}

