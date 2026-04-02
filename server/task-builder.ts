import Holidays, { HolidaysTypes } from "date-holidays";
import { TaskBuilder as BaseTaskBuilder } from "../shared/schema";

export interface CurrentDateResult {
  date: Date;
  isHoliday: boolean;
  holidayName: string | null;
  holidayType: HolidaysTypes.HolidayType | null;
  nextWorkday: Date;
}

/**
 * TaskBuilder extends the shared base task model with server-side utilities,
 * including holiday-aware date helpers powered by the date-holidays library.
 */
export class TaskBuilder extends BaseTaskBuilder {
  /**
   * Returns the current date enriched with holiday information for the given
   * IANA country code (defaults to "US").
   *
   * Returned fields:
   *   date        - today as a Date object
   *   isHoliday   - whether today is a public/bank/school holiday
   *   holidayName - localised name of the holiday (null if not a holiday)
   *   holidayType - holiday category, e.g. "public" | "bank" | "optional" | "school" | "observance"
   *   nextWorkday - first upcoming date that is neither a weekend nor a holiday
   */
  getCurrentDate(countryCode: string = "US"): CurrentDateResult {
    const hd = new Holidays(countryCode);
    const today = new Date();

    const holidayMatch = hd.isHoliday(today);
    const isHoliday = !!holidayMatch;
    const holidayName = isHoliday
      ? (holidayMatch as HolidaysTypes.Holiday[])[0].name
      : null;
    const holidayType = isHoliday
      ? (holidayMatch as HolidaysTypes.Holiday[])[0].type
      : null;

    const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
    const nextWorkday = new Date(today);
    nextWorkday.setDate(nextWorkday.getDate() + 1);
    while (isWeekend(nextWorkday) || !!hd.isHoliday(nextWorkday)) {
      nextWorkday.setDate(nextWorkday.getDate() + 1);
    }

    return { date: today, isHoliday, holidayName, holidayType, nextWorkday };
  }
}

export const defaultTask = new TaskBuilder();
