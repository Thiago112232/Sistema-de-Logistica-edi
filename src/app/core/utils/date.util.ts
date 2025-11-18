import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export class DateUtil {
  static format(date: string | Date, format: string = 'DD/MM/YYYY'): string {
    return dayjs(date).format(format);
  }

  static formatDateTime(date: string | Date): string {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  }

  static fromNow(date: string | Date): string {
    return dayjs(date).fromNow();
  }

  static setLocale(locale: 'es' | 'en'): void {
    dayjs.locale(locale);
  }

  static addDays(date: string | Date, days: number): string {
    return dayjs(date).add(days, 'day').toISOString();
  }

  static isBefore(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).isBefore(dayjs(date2));
  }

  static isAfter(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).isAfter(dayjs(date2));
  }
}

