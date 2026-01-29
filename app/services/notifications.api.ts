import { supabase } from "../clients/supabase";
import { PAGE_LIMIT } from "../utils/constans";
import { INotification } from "../utils/types";

export async function fetchNotifications(
  cursor?: string, // Pass the last notification's created_at or id
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

  query = query.limit(pageSize);

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function markAsRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteNotification(id: string) {
  const { error } = await supabase.from("notifications").delete().eq("id", id);

  if (error) throw error;
}
