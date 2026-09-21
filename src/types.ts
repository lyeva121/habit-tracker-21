export type DateString = string;

export type HabitStatus = "active" | "achieved";

export type TimeOfDay = "morning" | "afternoon" | "evening";

export interface Habit {
  id: string;
  name: string;
  weekdays: number[];
  startDate: DateString;
  timeOfDay: TimeOfDay | null;
  hour: number | null;
  journalEnabled: boolean;
  status: HabitStatus;
}

export interface Completion {
  habitId: string;
  date: DateString;
  markedAt: string;
  value: number | null;
}
