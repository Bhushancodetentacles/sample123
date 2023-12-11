export function formatRelativeTime(dateString) {
  if (!dateString) return "---";
  const currentTime = new Date();
  const inputTime = new Date(parseInt(dateString) * 1000);
  const timeDifference = (currentTime - inputTime) / 1000; // in seconds

  if (timeDifference < 60) {
    return `${Math.floor(timeDifference)} seconds ago`;
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (timeDifference < 86400) {
    const hours = Math.floor(timeDifference / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(timeDifference / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}