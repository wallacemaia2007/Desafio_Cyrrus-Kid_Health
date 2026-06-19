export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
}
