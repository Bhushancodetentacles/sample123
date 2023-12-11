export function formatDate(dateString) {
    if (!dateString) return "---";
    const inputDate = new Date(dateString);
    const options = { year: 'numeric', month: 'short' };
    const formattedDate = inputDate.toLocaleDateString('en-US', options);
    return formattedDate
}