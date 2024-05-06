import { differenceInDays } from "date-fns";

// Pad a number to 2 digits
const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');

// Get timezone offset in ISO format (+hh:mm or -hh:mm)
const getTimezoneOffset = (date: Date) => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  return diff + pad(tzOffset / 60) + ':' + pad(tzOffset % 60);
};

export const toISOStringWithTimezone = (date: Date) => {
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    getTimezoneOffset(date);
};

export function nMonthsToYears(n: number) : string{
  if (n < 12) {
    return `${n} tháng`;
  }
  const years = Math.floor(n / 12);
  const months = n % 12;
  return `${years} năm${months > 0 ? ` ${months} tháng` : ""}`;
}

export function dateDifference(d1: Date, d2: Date) {
  const diffDays = Math.abs(differenceInDays(d1, d2));
  return `${diffDays} ngày${diffDays > 1 ? 's' : ''}`;
}
