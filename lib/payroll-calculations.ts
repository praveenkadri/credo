export type PayrollRateType = "hourly" | "daily" | "weekly" | "biWeekly" | "monthly" | "annual";

type HourCalculationInput = {
  startDate: string;
  endDate: string;
  rateType: PayrollRateType;
  hoursPerDay: number;
  hoursPerWeek: number;
};

type GrossPayCalculationInput = HourCalculationInput & {
  rateAmount: number;
  totalHours: number;
};

type RangeMetrics = {
  businessDaysInRange: number;
  weeksInRange: number;
  biWeeklyPeriodsInRange: number;
  monthlyProration: number;
  annualProration: number;
};

export function calculatePayPeriodHours({
  startDate,
  endDate,
  rateType,
  hoursPerDay,
  hoursPerWeek,
}: HourCalculationInput) {
  const metrics = getRangeMetrics(startDate, endDate);

  switch (rateType) {
    case "hourly":
    case "daily":
    case "monthly":
    case "annual":
      return roundToTwo(metrics.businessDaysInRange * hoursPerDay);
    case "weekly":
      return roundToTwo(metrics.weeksInRange * hoursPerWeek);
    case "biWeekly":
      return roundToTwo(metrics.biWeeklyPeriodsInRange * hoursPerWeek * 2);
    default:
      return 0;
  }
}

export function calculateGrossPay({
  rateType,
  rateAmount,
  totalHours,
  hoursPerDay,
  hoursPerWeek,
  startDate,
  endDate,
}: GrossPayCalculationInput) {
  const metrics = getRangeMetrics(startDate, endDate);

  switch (rateType) {
    case "hourly":
      return roundToTwo(rateAmount * totalHours);
    case "daily":
      return roundToTwo(rateAmount * metrics.businessDaysInRange);
    case "weekly":
      return roundToTwo(rateAmount * metrics.weeksInRange);
    case "biWeekly":
      return roundToTwo(rateAmount * metrics.biWeeklyPeriodsInRange);
    case "monthly":
      return roundToTwo(rateAmount * metrics.monthlyProration);
    case "annual":
      return roundToTwo(rateAmount * metrics.annualProration);
    default:
      return roundToTwo((hoursPerDay + hoursPerWeek) * 0);
  }
}

export function getBusinessDaysInRange(startDate: string, endDate: string) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!start || !end || start > end) {
    return 0;
  }

  let total = 0;
  const cursor = new Date(start);

  while (cursor <= end) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      total += 1;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return total;
}

export function parseDateOnly(value: string) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function getRangeMetrics(startDate: string, endDate: string): RangeMetrics {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!start || !end || start > end) {
    return {
      businessDaysInRange: 0,
      weeksInRange: 0,
      biWeeklyPeriodsInRange: 0,
      monthlyProration: 0,
      annualProration: 0,
    };
  }

  const inclusiveDays = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
  const businessDaysInRange = getBusinessDaysInRange(startDate, endDate);
  const weeksInRange = inclusiveDays / 7;
  const biWeeklyPeriodsInRange = inclusiveDays / 14;
  const monthlyProration = getMonthlyProration(start, end);
  const annualProration = getAnnualProration(start, end);

  return {
    businessDaysInRange,
    weeksInRange,
    biWeeklyPeriodsInRange,
    monthlyProration,
    annualProration,
  };
}

function getMonthlyProration(start: Date, end: Date) {
  let total = 0;
  let cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));

  while (cursor <= end) {
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth();
    const monthStart = new Date(Date.UTC(year, month, 1));
    const monthEnd = new Date(Date.UTC(year, month + 1, 0));
    const overlapStart = start > monthStart ? start : monthStart;
    const overlapEnd = end < monthEnd ? end : monthEnd;

    if (overlapStart <= overlapEnd) {
      const overlapBusinessDays = getBusinessDaysInRange(formatDateOnly(overlapStart), formatDateOnly(overlapEnd));
      const monthBusinessDays = getBusinessDaysInRange(formatDateOnly(monthStart), formatDateOnly(monthEnd));

      if (monthBusinessDays > 0) {
        total += overlapBusinessDays / monthBusinessDays;
      }
    }

    cursor = new Date(Date.UTC(year, month + 1, 1));
  }

  return total;
}

function getAnnualProration(start: Date, end: Date) {
  let total = 0;
  let cursor = new Date(Date.UTC(start.getUTCFullYear(), 0, 1));

  while (cursor <= end) {
    const year = cursor.getUTCFullYear();
    const yearStart = new Date(Date.UTC(year, 0, 1));
    const yearEnd = new Date(Date.UTC(year, 11, 31));
    const overlapStart = start > yearStart ? start : yearStart;
    const overlapEnd = end < yearEnd ? end : yearEnd;

    if (overlapStart <= overlapEnd) {
      const overlapBusinessDays = getBusinessDaysInRange(formatDateOnly(overlapStart), formatDateOnly(overlapEnd));
      const yearBusinessDays = getBusinessDaysInRange(formatDateOnly(yearStart), formatDateOnly(yearEnd));

      if (yearBusinessDays > 0) {
        total += overlapBusinessDays / yearBusinessDays;
      }
    }

    cursor = new Date(Date.UTC(year + 1, 0, 1));
  }

  return total;
}

function formatDateOnly(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}
