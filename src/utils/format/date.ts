import { formatDistanceToNow } from "date-fns";

export const formatDate = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};
