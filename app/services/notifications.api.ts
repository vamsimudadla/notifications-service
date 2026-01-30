import { supabase } from "../clients/supabase";
import { PAGE_LIMIT } from "../utils/constans";
import {
  IControls,
  INotification,
  STATUS_FILTER,
  TYPE_FILTER,
} from "../utils/types";

export async function fetchNotifications(
  cursor?: string, // created_at cursor
  filters?: IControls,
  pageSize = PAGE_LIMIT,
  direction: "forward" | "backward" = "forward",
): Promise<INotification[]> {
  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply cursor filter
  if (cursor) {
    if (direction === "forward") {
      // Get notifications older than the cursor (for next page)
      query = query.lt("created_at", cursor);
    } else {
      // Get notifications newer than the cursor (for previous page)
      query = query.gt("created_at", cursor);
    }
  }

  // 🔍 Search (title + message)
  if (filters?.search?.trim()) {
    const text = filters.search.trim();
    query = query.or(`title.ilike.%${text}%,message.ilike.%${text}%`);
  }

  // ✅ Read / Unread filter
  if (
    filters?.statusFilter === STATUS_FILTER.READ ||
    filters?.statusFilter === STATUS_FILTER.UNREAD
  ) {
    query = query.eq("read", filters?.statusFilter === STATUS_FILTER.READ);
  }

  // 🏷️ Type filter
  if (filters?.typeFilter && filters.typeFilter !== TYPE_FILTER.ALL) {
    query = query.eq("type", filters.typeFilter);
  }

  query = query.limit(pageSize);

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function fetchUnreadCountWithFilters(
  filters?: IControls,
): Promise<number> {
  let query = supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("read", false);

  if (filters?.search?.trim()) {
    const text = filters.search.trim();
    query = query.or(`title.ilike.%${text}%,message.ilike.%${text}%`);
  }

  if (filters?.typeFilter && filters.typeFilter !== TYPE_FILTER.ALL) {
    query = query.eq("type", filters.typeFilter);
  }

  const { count, error } = await query;

  if (error) throw error;
  return count ?? 0;
}

export async function markAsReadUnread(id: string, read: boolean) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: read })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteNotification(id: string) {
  const { error } = await supabase.from("notifications").delete().eq("id", id);

  if (error) throw error;
}

export async function markAllAsRead(filters?: IControls): Promise<void> {
  let query = supabase
    .from("notifications")
    .update({ read: true })
    .eq("read", false); // only unread

  // 🔍 Search (title + message)
  if (filters?.search?.trim()) {
    const text = filters.search.trim();
    query = query.or(`title.ilike.%${text}%,message.ilike.%${text}%`);
  }

  // 🏷️ Type filter
  if (filters?.typeFilter && filters.typeFilter !== TYPE_FILTER.ALL) {
    query = query.eq("type", filters.typeFilter);
  }

  // ⚠️ statusFilter is intentionally ignored
  // If statusFilter === READ, there is nothing to update

  const { error } = await query;

  if (error) throw error;
}

export async function addNotification(
  notification: Omit<INotification, "id" | "created_at">,
) {
  const { error } = await supabase.from("notifications").insert({
    ...notification,
    read: false,
  });

  if (error) throw error;
}

export function subscribeToNewNotifications(
  onNewNotification: (notification: INotification) => void,
) {
  const channel = supabase
    .channel("notifications-insert")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
      },
      (payload) => {
        onNewNotification(payload.new as INotification);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
