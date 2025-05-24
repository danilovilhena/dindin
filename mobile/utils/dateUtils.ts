export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "hoje";
  } else if (diffInDays === 1) {
    return "ontem";
  } else if (diffInDays === 2) {
    return "2 dias atrás";
  } else if (diffInDays === 3) {
    return "3 dias atrás";
  } else {
    // Show actual date for anything older than 3 days
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  }
}
