export const formatTime = (time?: string): string | null => {
  if (!time) return null;
  const match = time.match(/(\d+)\s*(\w+)/);
  if (match && match[1] && match[2]) return `${match[1]} ${match[2]}`;
  return time;
};
