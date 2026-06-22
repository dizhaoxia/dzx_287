import * as dayjs from 'dayjs';

export function formatDate(
  date: Date | string,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  return dayjs(date).format(format);
}

export function getNow(): Date {
  return dayjs().toDate();
}

export function addDays(date: Date | string, days: number): Date {
  return dayjs(date).add(days, 'day').toDate();
}

export function isExpired(date: Date | string): boolean {
  return dayjs().isAfter(dayjs(date));
}
