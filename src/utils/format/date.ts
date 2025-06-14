import { formatDistanceToNow, format } from "date-fns";

export const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  return format(date, "MMMM d, yyyy, HH:mm");
};

export const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  return formatDistanceToNow(date, { addSuffix: true });
};
