export function formatUnixFormatDate(dateString) {
    if (!dateString) return "---";
    
    const unixTimestamp = parseInt(dateString) * 1000; // Convert to milliseconds
    const inputDate = new Date(unixTimestamp);

    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(inputDate);
    return formattedDate;
}