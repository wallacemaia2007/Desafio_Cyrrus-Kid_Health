import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, happyOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import {
  StatusBadgeComponent,
  StatusBadgeVariant,
} from '../status-badge/status-badge.component';
import { Child } from '../../model/child';
import {
  getChildVaccinationSummary,
  getVaccinationProgress,
  VaccinationSummary,
} from '../../utils/vaccination-status';

@Component({
  selector: 'app-child-card',
  standalone: true,
  imports: [CommonModule, RouterLink, IonIcon, StatusBadgeComponent],
  templateUrl: './child-card.component.html',
  styleUrl: './child-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildCardComponent {
  readonly child = input.required<Child>();

  constructor() {
    addIcons({ calendarOutline, happyOutline, shieldCheckmarkOutline });
  }

  protected getVaccineStatus(): StatusBadgeVariant {
    const summary = this.getSummary();

    if (summary.overdue > 0) return 'overdue';
    if (summary.pending === 0) return 'complete';
    if (summary.applied > 0) return 'partial';
    return 'pending';
  }

  protected getVaccineProgress(): number {
    return getVaccinationProgress(this.getSummary());
  }

  protected getSummary(): VaccinationSummary {
    return getChildVaccinationSummary(this.child());
  }

  protected getStatusLabel(): string {
    const summary = this.getSummary();

    if (summary.overdue > 0) return `${summary.overdue} Atrasada${summary.overdue !== 1 ? 's' : ''}`;
    if (summary.pending > 0) return `${summary.pending} Pendente${summary.pending !== 1 ? 's' : ''}`;
    return 'Completo';
  }
}
