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
    addIcons({ happyOutline, calendarOutline, searchOutline, shieldCheckmarkOutline });

    this.allChildren$ = this.childService.getChildren();
    this.filteredChildren$ = combineLatest([
      this.allChildren$,
      this.searchTerm$.pipe(startWith('')),
    ]).pipe(
      map(([children, term]) => {
        const normalizedTerm = term.toLowerCase().trim();
        if (!normalizedTerm) return children;

        return children.filter((child) => child.name.toLowerCase().includes(normalizedTerm));
      }),
    );
  }

  onSearch(event: any): void {
    const term = event.target.value || '';
    this.searchTerm$.next(term);
  }

  getVaccineStatus(child: Child): StatusBadgeVariant {
    if (child.pendingVaccines === 0) return 'complete';
    if (child.appliedVaccines > 0) return 'partial';
    return 'pending';
  }

  getVaccineProgress(child: Child): number {
    if (!child.totalVaccines) return 0;
    return (child.appliedVaccines / child.totalVaccines) * 100;
  }
}
