# 📣 Notifications Dashboard

A real-time notifications dashboard built with **Next**, **React**, **TypeScript**, and **Supabase**, featuring cursor-based pagination, server-side filtering, unread counts, and live updates.

Click here for [demo](https://notifications-service-theta.vercel.app/)

---

## Getting Started

## 🚀 Features

- ✅ Cursor-based pagination
- 🔍 Server-side search (title + message)
- 🏷️ Filter by notification type (info, success, warning, error)
- 📬 Read / unread filtering
- 🔔 Real-time updates using Supabase Realtime
- 📊 unread notification count
- ⚡ Optimized queries (no overfetching)
- ✅ Mark all as read

## 📡 Real-time Updates

```bash
The application listens for new notifications using Supabase Realtime:
```

## 🧩 Supabase Setup

## Notifications Table Schema

```bash
create table notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  type text check (type in ('info', 'success', 'warning', 'error')),
  read boolean default false,
  created_at timestamptz default now()
);
```

🔐 Row Level Security (RLS)

```bash
disable row level security on table
```

## 🔐 Environment Variables

Create a .env.local file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
```

Run or restart the dev server after adding environment variables.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
