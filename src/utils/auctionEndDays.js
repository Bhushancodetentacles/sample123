
export function auctionEndDays(dateString) {
  if (!dateString) return "---";
  const endDate = new Date(parseInt(dateString) * 1000).getTime()
  const currentDate = new Date().getTime()

  if (endDate <= currentDate) {
    return "Auction has ended";
  }

  const timeDifference = endDate - currentDate;
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return `${days} Days ${hours} Hrs`;
}