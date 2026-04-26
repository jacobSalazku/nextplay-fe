export const isToday = (activityDate: string | Date) => {
  const today = new Date();
  const date = new Date(activityDate);

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};
