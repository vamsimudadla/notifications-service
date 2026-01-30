import { useCallback } from "react";
import { IControls, STATUS_FILTER, TYPE_FILTER } from "../utils/types";

interface ControlsProps {
  controls: IControls;
  unreadCount: number;
  updateSearch: (search: string) => void;
  updateStatusFilter: (filter: STATUS_FILTER) => void;
  updateTypeFilter: (filter: TYPE_FILTER) => void;
  handleMarkAllAsRead: () => void;
}

function statusPillClasses(active: boolean) {
  return [
    "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors capitalize",
    active
      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
      : "bg-transparent text-zinc-500 hover:bg-zinc-100/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100 cursor-pointer",
  ].join(" ");
}

function Controls({
  controls,
  unreadCount,
  updateSearch,
  updateStatusFilter,
  updateTypeFilter,
  handleMarkAllAsRead,
}: ControlsProps) {
  const { search, statusFilter, typeFilter } = controls;

  const handleStatusFilterClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const next = e.currentTarget.dataset.filter as STATUS_FILTER | undefined;
      if (!next) return;
      updateStatusFilter(next);
    },
    [updateStatusFilter],
  );

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
            <span className="text-sm">🔍</span>
          </div>
          <input
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search by title, message, or category…"
            className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/80 pl-9 pr-3 text-sm text-zinc-100 outline-none ring-0 ring-sky-500/60 transition focus:border-sky-500/70 focus:ring-2 placeholder:text-zinc-500"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
        <div className="inline-flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-950/60 p-1 text-xs">
          {Object.values(STATUS_FILTER).map((filter) => (
            <button
              key={filter}
              type="button"
              data-filter={filter}
              onClick={handleStatusFilterClick}
              className={statusPillClasses(statusFilter === filter)}
            >
              {filter}
              {filter === STATUS_FILTER.UNREAD && unreadCount > 0 && (
                <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-sky-500/20 px-1 text-[10px] text-sky-300">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <select
          value={typeFilter}
          onChange={(e) => updateTypeFilter(e.target.value as TYPE_FILTER)}
          className="capitalize h-9 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 text-xs font-medium text-zinc-200 outline-none ring-0 ring-sky-500/60 transition hover:border-zinc-700 focus:border-sky-500/70 focus:ring-2"
        >
          {Object.values(TYPE_FILTER).map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600/40 bg-emerald-600/15 px-3 py-1.5 text-xs font-medium text-emerald-300 outline-none ring-0 ring-emerald-500/50 transition cursor-pointer hover:border-emerald-500/70 hover:bg-emerald-500/20 hover:text-emerald-100 disabled:border-zinc-700 disabled:bg-zinc-800/60 disabled:text-zinc-500 disabled:cursor-not-allowed"
        >
          <span>Mark all as read</span>
        </button>
      </div>
    </section>
  );
}

export default Controls;
