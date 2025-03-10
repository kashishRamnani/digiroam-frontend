// Helper function to convert milliseconds to days, hours, and minutes
export const convertMillisecondsToDHMS = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {
        days,
        hours: hours % 24,
        minutes: minutes % 60,
    };
}