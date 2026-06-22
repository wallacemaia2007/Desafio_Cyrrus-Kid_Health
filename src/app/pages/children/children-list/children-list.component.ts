import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonSearchbar, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  happyOutline,
  calendarOutline,
  searchOutline,
  shieldCheckmarkOutline,
  addOutline,
} from 'ionicons/icons';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { StatusBadgeComponent, StatusBadgeVariant } from '../../../shared/components/status-badge/status-badge.component';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { Child } from '../../../shared/model/child';
import { ChildService } from '../../../core/services/child.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  getChildVaccinationSummary,
  getVaccinationProgress,
  VaccinationSummary,
} from '../../../shared/utils/vaccination-status';

@Component({
  selector: 'app-child-list',
  standalone: true,
  imports: [CommonModule, RouterLink, IonSearchbar, IonIcon, PageHeaderComponent, StatusBadgeComponent, GridComponent, LoadingStateComponent, EmptyStateComponent],
  templateUrl: './children-list.component.html',
  styleUrls: ['./children-list.component.scss'],
})
export class ChildrenListComponent {
  private allChildren$: Observable<Child[]>;
  private searchTerm$ = new BehaviorSubject<string>('');
  filteredChildren$: Observable<Child[]>;

  constructor(private childService: ChildService) {
    addIcons({ happyOutline, calendarOutline, searchOutline, shieldCheckmarkOutline, addOutline });

    this.allChildren$ = this.childService.getChildren();
    this.filteredChildren$ = combineLatest([
      this.allChildren$,
      this.searchTerm$.pipe(startWith('')),
    ]).pipe(
      map(([children, term]) => {
        const normalizedTerm = this.normalizeSearchText(term);
        if (!normalizedTerm) return children;

        return children.filter((child) => {
          const childName = this.normalizeSearchText(child.name);
          const responsibleName = this.normalizeSearchText(child.responsible || '');

          return childName.includes(normalizedTerm) || responsibleName.includes(normalizedTerm);
        });
      }),
    );
  }

  onSearch(event: any): void {
    const term = event.target.value || '';
    this.searchTerm$.next(term);
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  getVaccineStatus(child: Child): StatusBadgeVariant {
    const summary = this.getSummary(child);

    if (summary.overdue > 0) return 'overdue';
    if (summary.pending === 0) return 'complete';
    if (summary.applied > 0) return 'partial';
    return 'pending';
  }

  getVaccineProgress(child: Child): number {
    return getVaccinationProgress(this.getSummary(child));
  }

  getSummary(child: Child): VaccinationSummary {
    return getChildVaccinationSummary(child);
  }

  getStatusLabel(child: Child): string {
    const summary = this.getSummary(child);

    if (summary.overdue > 0) return `${summary.overdue} Atrasada${summary.overdue !== 1 ? 's' : ''}`;
    if (summary.pending > 0) return `${summary.pending} Pendente${summary.pending !== 1 ? 's' : ''}`;
    return 'Completo';
  }
}
