export const isRecent = (dateString?: string) => {
  if (!dateString) return false;
  const updatedDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - updatedDate.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return diffInDays < 2;
};
