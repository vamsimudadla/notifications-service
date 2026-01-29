import { INotification } from "./types";

export const BADGE_STYLES = {
  success: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40",
  warning: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/40",
  error: "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/40",
  info: "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/40",
};

export const INITIAL_NOTIFICATIONS: INotification[] = [
  {
    id: "1",
    title: "Welcome to the notification service",
    message:
      "This is a sample notification. Use the controls above to filter, search, and manage notifications.",
    type: "info",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5m ago
    read: false,
  },
  {
    id: "2",
    title: "New comment on ticket #1423",
    message: "Priya mentioned you in a comment: “Can you confirm the SLA?”",
    type: "warning",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30m ago
    read: false,
  },
  {
    id: "3",
    title: "Daily digest is ready",
    message: "Your daily activity summary for the workspace is now available.",
    type: "success",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    read: true,
  },
  {
    id: "4",
    title: "Delivery failure",
    message: "We were unable to deliver email notifications to 2 recipients.",
    type: "error",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1d ago
    read: false,
  },
];
