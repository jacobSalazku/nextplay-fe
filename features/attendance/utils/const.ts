import type { AttendanceStatusOption } from "../zod";

export const attendanceStatus: AttendanceStatusOption[] = [
  {
    value: "ATTENDING",
    label: "I will be there",
  },
  { value: "NOT_ATTENDING", label: "I will not be there" },
  { value: "LATE", label: "I will be late" },
];
