function EmptyMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/80 text-2xl">
        📭
      </div>
      <h2 className="text-sm font-medium text-zinc-100">
        You&apos;re all caught up
      </h2>
      <p className="max-w-xs text-xs text-zinc-500">
        No notifications match your current filters. Try broadening your filters
        or wait for new activity to stream in.
      </p>
    </div>
  );
}

export default EmptyMessage;
