function Header() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-400">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
            🔔
          </span>
          Notification Center
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            View, filter, and act on notifications.
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
