export interface VaccineApplication {
  id: string;
  childId: string;
  vaccineId: string;
  scheduledDate: Date;
  applicationDate?: Date;
}
