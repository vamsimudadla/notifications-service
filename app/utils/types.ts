export enum NotificationType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
}

export enum STATUS_FILTER {
  ALL = "all",
  UNREAD = "unread",
  READ = "read",
}

export enum TYPE_FILTER {
  ALL = "all",
  INFO = NotificationType.INFO,
  SUCCESS = NotificationType.SUCCESS,
  WARNING = NotificationType.WARNING,
  ERROR = NotificationType.ERROR,
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: Partial<TYPE_FILTER>;
  created_at: string;
  read: boolean;
  category?: string;
}

export interface IControls {
  search: string;
  statusFilter: STATUS_FILTER;
  typeFilter: TYPE_FILTER;
}
