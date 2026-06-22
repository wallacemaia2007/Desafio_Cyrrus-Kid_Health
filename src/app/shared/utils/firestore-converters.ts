import { Timestamp } from '@angular/fire/firestore';

export function convertDates<T>(data: any, dateFields: (keyof T)[]): T {
  const result = { ...data };
  for (const field of dateFields) {
    if (result[field] instanceof Timestamp) {
      result[field] = result[field].toDate();
    }
  }
  return result as T;
}

export function convertToTimestamps<T>(data: Partial<T>, dateFields: (keyof T)[]): any {
  const result: any = { ...data };
  for (const field of dateFields) {
    if (result[field] instanceof Date) {
      result[field] = Timestamp.fromDate(result[field]);
    }
  }
  return result;
}
