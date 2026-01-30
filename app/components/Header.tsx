interface HeaderProps {
  sendNotification: () => void;
}

function Header({ sendNotification }: HeaderProps) {
  return (
    <header className="flex justify-between gap-4 sm:flex-row sm:items-center sm:justify-between">
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
      <div className="space-y-1.5 flex flex-col items-end">
        <button
          type="button"
          onClick={sendNotification}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600/40 bg-emerald-600/15 px-3 py-1.5 text-xs font-medium text-emerald-300 outline-none ring-0 ring-emerald-500/50 transition cursor-pointer hover:border-emerald-500/70 hover:bg-emerald-500/20 hover:text-emerald-100 disabled:border-zinc-700 disabled:bg-zinc-800/60 disabled:text-zinc-500 disabled:cursor-not-allowed"
        >
          <span>Send notification</span>
        </button>
        <p className="text-xs">This is to test realtime updates</p>
      </div>
    </header>
  );
}

export default Header;
