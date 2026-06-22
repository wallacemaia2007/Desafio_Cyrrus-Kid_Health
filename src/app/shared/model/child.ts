export interface ChildVaccineItem {
  vaccineId: string;
  vaccineName: string;
  applied: boolean;
  scheduledDate: Date;
  applicationDate?: Date;
}

export interface Child {
  id: string;
  name: string;
  birthDate: Date;
  responsible?: string;
  totalVaccines: number;
  appliedVaccines: number;
  pendingVaccines: number;
  vaccines?: ChildVaccineItem[];
}
