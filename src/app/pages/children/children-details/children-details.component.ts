import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  happyOutline,
  calendarOutline,
  checkmarkCircleOutline,
  timeOutline,
  createOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import {
  StatusBadgeComponent,
  StatusBadgeVariant,
} from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { Child, ChildVaccineItem } from '../../../shared/model/child';
import { ChildService } from '../../../core/services/child.service';
import {
  getChildVaccinationSummary,
  getVaccinationProgress,
  getVaccineItemStatus,
  VaccinationSummary,
  VaccineItemStatus,
} from '../../../shared/utils/vaccination-status';

@Component({
  selector: 'app-children-details',
  standalone: true,
  imports: [CommonModule, RouterLink, IonIcon, StatusBadgeComponent, LoadingStateComponent],
  templateUrl: './children-details.component.html',
  styleUrl: './children-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenDetailsComponent {
  private route = inject(ActivatedRoute);
  private childService = inject(ChildService);

  protected child$: Observable<Child | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      if (!id) return of(null);
      return this.childService.getChildById(id).pipe(catchError(() => of(null)));
    }),
  );

  protected vaccineStatus(child: Child): StatusBadgeVariant {
    const summary = this.vaccinationSummary(child);

    if (summary.overdue > 0) return 'overdue';
    if (summary.pending === 0) return 'complete';
    if (summary.applied > 0) return 'partial';
    return 'pending';
  }

  protected vaccineProgress(child: Child): number {
    return getVaccinationProgress(this.vaccinationSummary(child));
  }

  protected vaccinationSummary(child: Child): VaccinationSummary {
    return getChildVaccinationSummary(child);
  }

  protected statusLabel(child: Child): string {
    const summary = this.vaccinationSummary(child);

    if (summary.overdue > 0) return `${summary.overdue} Atrasada${summary.overdue !== 1 ? 's' : ''}`;
    if (summary.pending > 0) return `${summary.pending} Pendente${summary.pending !== 1 ? 's' : ''}`;
    return 'Completo';
  }

  protected vaccineItemStatus(vaccine: ChildVaccineItem): VaccineItemStatus {
    return getVaccineItemStatus(vaccine);
  }

  protected vaccineItemStatusLabel(vaccine: ChildVaccineItem): string {
    const status = this.vaccineItemStatus(vaccine);

    if (status === 'applied') return 'Aplicada';
    if (status === 'overdue') return 'Atrasada';
    return 'Pendente';
  }

  protected vaccineItemBadgeStatus(vaccine: ChildVaccineItem): StatusBadgeVariant {
    const status = this.vaccineItemStatus(vaccine);
    return status === 'applied' ? 'complete' : status;
  }

  constructor() {
    addIcons({
      arrowBackOutline,
      happyOutline,
      calendarOutline,
      checkmarkCircleOutline,
      timeOutline,
      createOutline,
      shieldCheckmarkOutline,
    });
  }
}
