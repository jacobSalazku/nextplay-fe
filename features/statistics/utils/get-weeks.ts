import {
  addDays,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { Week } from "./types";

export const getWeeksOfMonth = (year: number, month: number): Week[] => {
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weekStarts = eachWeekOfInterval(
    { start: calendarStart, end: calendarEnd },
    { weekStartsOn: 1 },
  );

  return weekStarts.map((weekStart, index) => {
    const weekEnd = addDays(weekStart, 6);
    const startStr = format(weekStart, "MMM d");
    const endStr = format(weekEnd, "MMM d");

    return {
      label: `Week ${index + 1}`,
      start: startStr,
      end: endStr,
      month,
      startDate: parse(`${startStr} ${year}`, "MMM d yyyy", new Date()),
      endDate: parse(`${endStr} ${year}`, "MMM d yyyy", new Date()),
    };
  });
};
