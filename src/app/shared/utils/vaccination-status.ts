import { Campaign } from '../model/campaign';
import { Child, ChildVaccineItem } from '../model/child';

export type VaccineItemStatus = 'applied' | 'pending' | 'overdue';

export interface VaccinationSummary {
  total: number;
  applied: number;
  pending: number;
  overdue: number;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getVaccineItemStatus(
  vaccine: Pick<ChildVaccineItem, 'applied' | 'scheduledDate'>,
  today = new Date(),
): VaccineItemStatus {
  if (vaccine.applied) return 'applied';

  const scheduledDate = startOfDay(vaccine.scheduledDate);
  const currentDate = startOfDay(today);

  return scheduledDate < currentDate ? 'overdue' : 'pending';
}

export function getVaccinationSummary(
  vaccines: ChildVaccineItem[] = [],
  today = new Date(),
): VaccinationSummary {
  return vaccines.reduce<VaccinationSummary>(
    (summary, vaccine) => {
      const status = getVaccineItemStatus(vaccine, today);

      return {
        total: summary.total + 1,
        applied: summary.applied + (status === 'applied' ? 1 : 0),
        pending: summary.pending + (status === 'pending' ? 1 : 0),
        overdue: summary.overdue + (status === 'overdue' ? 1 : 0),
      };
    },
    { total: 0, applied: 0, pending: 0, overdue: 0 },
  );
}

export function getChildVaccinationSummary(
  child: Pick<Child, 'vaccines' | 'totalVaccines' | 'appliedVaccines' | 'pendingVaccines'>,
  today = new Date(),
): VaccinationSummary {
  if (child.vaccines?.length) {
    return getVaccinationSummary(child.vaccines, today);
  }

  return {
    total: child.totalVaccines || 0,
    applied: child.appliedVaccines || 0,
    pending: child.pendingVaccines || 0,
    overdue: 0,
  };
}

export function getVaccinationProgress(summary: Pick<VaccinationSummary, 'total' | 'applied'>): number {
  if (!summary.total) return 0;
  return (summary.applied / summary.total) * 100;
}

export function isCampaignCurrentlyActive(campaign: Campaign, today = new Date()): boolean {
  if (!campaign.active) return false;

  const currentDate = startOfDay(today);
  const endDate = startOfDay(campaign.endDate);

  return currentDate <= endDate;
}
