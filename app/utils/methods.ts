export function getRelativeTime(isoDate: string) {
  const date = new Date(isoDate);
  const now = new Date();

  // Check if same day
  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  // Format time in AM/PM
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  if (isSameDay) {
    // Same day: return time with AM/PM
    return date.toLocaleTimeString("en-US", timeOptions);
  } else {
    // Different day: return date (dd-mm-yyyy) with time
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", timeOptions);
    return `${day}-${month}-${year}, ${time}`;
  }
}
