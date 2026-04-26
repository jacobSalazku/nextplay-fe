import { z } from "zod";

export const attendanceSchema = z.object({
  activityId: z.string(),
  teamMemberId: z.string(),
  attendanceStatus: z.enum(["ATTENDING", "NOT_ATTENDING", "LATE"]),
  reason: z.string().optional(),
});

export type AttendanceData = z.infer<typeof attendanceSchema>;

export const attendanceStatusOptionSchema = z.object({
  value: z.enum(["ATTENDING", "NOT_ATTENDING", "LATE"]),
  label: z.string(),
});

export type AttendanceStatusOption = z.infer<
  typeof attendanceStatusOptionSchema
>;
