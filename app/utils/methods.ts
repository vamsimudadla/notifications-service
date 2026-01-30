import { INotification, TYPE_FILTER } from "./types";

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

export function generateRandomNotification(): Omit<
  INotification,
  "id" | "created_at"
> {
  const TYPES = [
    TYPE_FILTER.INFO,
    TYPE_FILTER.SUCCESS,
    TYPE_FILTER.WARNING,
    TYPE_FILTER.ERROR,
  ] as const;

  const TITLES: Record<(typeof TYPES)[number], string[]> = {
    info: ["New update available", "FYI", "Did you know?"],
    success: ["Action successful", "Payment completed", "Task finished"],
    warning: ["Check this out", "Action required", "Warning issued"],
    error: ["Something went wrong", "Payment failed", "System error"],
  };

  const MESSAGES = [
    "Please review the details.",
    "This action requires your attention.",
    "Everything looks good on our end.",
    "Try again later.",
    "Contact support if the issue persists.",
  ];
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];

  return {
    title: TITLES[type][Math.floor(Math.random() * TITLES[type].length)],
    message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
    type,
    read: Math.random() < 0.3, // ~30% read
  };
}
