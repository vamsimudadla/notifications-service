"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  addNotification,
  deleteNotification,
  fetchNotifications,
  fetchUnreadCountWithFilters,
  markAllAsRead,
  markAsReadUnread,
  subscribeToNewNotifications,
} from "./services/notifications.api";
import { PAGE_LIMIT } from "./utils/constans";
import useIntersectionObserver from "./hooks/IntersectionObserver";
import Loader from "./components/Loader";
import { useDebounce } from "./hooks/Debounce";
import {
  doesNotificationMatchFilters,
  generateRandomNotification,
} from "./utils/methods";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallback";

export default function Home() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [controls, setControls] = useState<IControls>({
    search: "",
    statusFilter: STATUS_FILTER.ALL,
    typeFilter: TYPE_FILTER.ALL,
  });

  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearch = useDebounce(controls.search, 300);

  const getNotifications = async (cursor?: string) => {
    try {
      if (loadingNotifications) {
        return;
      }
      setLoadingNotifications(true);
      const data = await fetchNotifications(cursor, controls);
      if (data?.length < PAGE_LIMIT) {
        setHasMore(false);
      }
      setNotifications((prev) => (cursor ? [...prev, ...data] : data));
    } catch (error) {
    } finally {
      setLoadingNotifications(false);
    }
  };

  const getUnreadCount = async () => {
    try {
      const count = await fetchUnreadCountWithFilters(controls);
      setUnreadCount(count);
    } catch (error) {}
  };

  useEffect(() => {
    setNotifications([]);
    setHasMore(true);
    getNotifications();
    getUnreadCount();

    const unsubscribe = subscribeToNewNotifications((notification) => {
      if (doesNotificationMatchFilters(notification, controls)) {
        setNotifications((prev) => [{ ...notification }, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    });

    return unsubscribe;
  }, [controls.typeFilter, controls.statusFilter, debouncedSearch]);

  const handleVisibilityChange = (id: string, isVisible: boolean) => {
    if (isVisible && notifications.length) {
      getNotifications(notifications[notifications.length - 1]?.created_at);
    }
  };

  const { observe, disconnect } = useIntersectionObserver({
    onVisibilityChange: handleVisibilityChange,
  });

  useEffect(() => {
    if (hasMore && paginationRef.current) {
      observe(paginationRef.current, "pagination-element");
    }
    return () => {
      disconnect();
    };
  }, [hasMore]);

  const updateSearch = useCallback((search: string) => {
    setControls((prev) => ({ ...prev, search }));
  }, []);

  const updateStatusFilter = useCallback((statusFilter: STATUS_FILTER) => {
    setControls((prev) => ({ ...prev, statusFilter }));
  }, []);

  const updateTypeFilter = useCallback((typeFilter: TYPE_FILTER) => {
    setControls((prev) => ({ ...prev, typeFilter }));
  }, []);

  const handleToggleRead = async (id: string) => {
    try {
      const notification = notifications.find((noti) => noti.id === id);
      if (notification) {
        const status = notification.read;
        await markAsReadUnread(id, !status);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: !status } : n)),
        );
        setUnreadCount((prev) => (status ? prev + 1 : Math.max(prev - 1, 0)));
      }
    } catch (error) {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      const notification = notifications.find((noti) => noti.id === id);
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(controls);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {}
  };

  const sendNewNotification = async () => {
    try {
      addNotification(generateRandomNotification());
    } catch (error) {}
  };

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="flex min-h-screen justify-center bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 px-4 py-10 text-zinc-50">
        <main className="flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8">
          <Header sendNotification={sendNewNotification} />

          <Controls
            unreadCount={unreadCount}
            controls={controls}
            updateSearch={updateSearch}
            updateStatusFilter={updateStatusFilter}
            updateTypeFilter={updateTypeFilter}
            handleMarkAllAsRead={handleMarkAllAsRead}
          />

          <section className="flex-1 border border-zinc-800/80 bg-zinc-900/80">
            {!hasMore && notifications.length === 0 ? (
              <EmptyMessage />
            ) : loadingNotifications && !notifications.length ? (
              <div className="flex items-center justify-center mt-4">
                <Loader />
              </div>
            ) : (
              <ul className="divide-y divide-zinc-800/80">
                {notifications.map((notification) => (
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
          {notifications.length && loadingNotifications ? <Loader /> : null}
          {hasMore && <div ref={paginationRef} className="flex"></div>}
        </main>
      </div>
    </ErrorBoundary>
  );
}
