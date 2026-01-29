"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type INotification,
  type IControls,
  STATUS_FILTER,
  TYPE_FILTER,
} from "./utils/types";
import NotificationCard from "./components/NotificationCard";
import Header from "./components/Header";
import EmptyMessage from "./components/EmptyMessage";
import Controls from "./components/Controls";
import { fetchNotifications } from "./services/notifications.api";
import { PAGE_LIMIT } from "./utils/constans";

export default function Home() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [controls, setControls] = useState<IControls>({
    search: "",
    statusFilter: STATUS_FILTER.ALL,
    typeFilter: TYPE_FILTER.ALL,
  });

  const updateSearch = useCallback((search: string) => {
    setControls((prev) => ({ ...prev, search }));
  }, []);

  const updateStatusFilter = useCallback((statusFilter: STATUS_FILTER) => {
    setControls((prev) => ({ ...prev, statusFilter }));
  }, []);

  const updateTypeFilter = useCallback((typeFilter: TYPE_FILTER) => {
    setControls((prev) => ({ ...prev, typeFilter }));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    const { search, statusFilter, typeFilter } = controls;
    return notifications.filter((n) => {
      if (statusFilter === STATUS_FILTER.UNREAD && n.read) return false;
      if (statusFilter === STATUS_FILTER.READ && !n.read) return false;
      if (typeFilter !== TYPE_FILTER.ALL && n.type !== typeFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          (n.category && n.category.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [notifications, controls]);

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotifications = async (cursor?: string) => {
    try {
      const data = await fetchNotifications(cursor);
      if (data?.length < PAGE_LIMIT) {
        setHasMore(false);
      }
      setNotifications((prev) => [...prev, ...data]);
    } catch (error) {}
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 px-4 py-10 text-zinc-50">
      <main className="flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8">
        <Header />

        <Controls
          unreadCount={unreadCount}
          controls={controls}
          updateSearch={updateSearch}
          updateStatusFilter={updateStatusFilter}
          updateTypeFilter={updateTypeFilter}
          handleMarkAllAsRead={handleMarkAllAsRead}
        />

        <section className="flex-1 border border-zinc-800/80 bg-zinc-900/80">
          {filteredNotifications.length === 0 ? (
            <EmptyMessage />
          ) : (
            <ul className="divide-y divide-zinc-800/80">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onToggleRead={handleToggleRead}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
