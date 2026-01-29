"use client";

import { useCallback } from "react";
import type { INotification } from "../utils/types";
import { getRelativeTime } from "../utils/methods";
import { BADGE_STYLES } from "../utils/constans";

interface NotificationCardProps {
  notification: INotification;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationCard({
  notification,
  onToggleRead,
  onDelete,
}: NotificationCardProps) {
  const handleToggleReadClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const nextId = e.currentTarget.dataset.id;
      if (!nextId) return;
      onToggleRead(nextId);
    },
    [onToggleRead],
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const nextId = e.currentTarget.dataset.id;
      if (!nextId) return;
      onDelete(nextId);
    },
    [onDelete],
  );

  return (
    <li
      className={`flex items-start gap-4 px-4 py-4 sm:px-5 sm:py-4.5 ${
        notification.read ? "bg-transparent" : "bg-zinc-900"
      }`}
    >
      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950/80">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            notification.read
              ? "bg-zinc-500/60"
              : "bg-sky-500 shadow-[0_0_0_4px_rgba(56,189,248,0.3)]"
          }`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`truncate text-sm font-medium ${
              notification.read ? "text-zinc-300" : "text-zinc-50"
            }`}
          >
            {notification.title}
          </h3>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              BADGE_STYLES[notification.type as keyof typeof BADGE_STYLES]
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className="capitalize">{notification.type}</span>
          </span>
          {notification.category && (
            <span className="text-[11px] text-zinc-500 capitalize">
              {notification.category}
            </span>
          )}
        </div>
        <p
          className={`line-clamp-2 text-xs leading-relaxed text-zinc-400 ${
            notification.read ? "opacity-80" : ""
          }`}
        >
          {notification.message}
        </p>
        <p className="mt-1 text-[11px] text-zinc-500">
          {getRelativeTime(notification.created_at)}
        </p>
      </div>
      <div className="ml-2 flex flex-none flex-col items-end gap-2 text-xs sm:flex-row sm:items-center sm:gap-1.5">
        <button
          type="button"
          data-id={notification.id}
          onClick={handleToggleReadClick}
          className="inline-flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-950/70 px-3 py-1 text-[11px] font-medium text-zinc-200 opacity-80 outline-none ring-0 ring-sky-500/50 transition hover:border-sky-500/70 hover:bg-sky-500/10 hover:text-sky-100 group-hover:opacity-100"
        >
          <span className="text-xs">{notification.read ? "◻" : "✓"}</span>
          <span>Mark as {notification.read ? "unread" : "read"}</span>
        </button>
        <button
          type="button"
          data-id={notification.id}
          onClick={handleDeleteClick}
          className="inline-flex items-center justify-center rounded-full border border-transparent px-2 py-1 text-[11px] text-zinc-500 outline-none ring-0 ring-rose-500/50 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default NotificationCard;
