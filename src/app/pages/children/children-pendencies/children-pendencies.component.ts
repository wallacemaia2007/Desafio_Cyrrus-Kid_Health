import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, timeOutline, warningOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Child, ChildVaccineItem } from '../../../shared/model/child';
import { ChildService } from '../../../core/services/child.service';
import { getVaccineItemStatus } from '../../../shared/utils/vaccination-status';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';

interface ChildPendenciesViewModel {
  child: Child;
  overdue: ChildVaccineItem[];
  pending: ChildVaccineItem[];
}

@Component({
  selector: 'app-children-pendencies',
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    PageHeaderComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    BackButtonComponent,
  ],
  templateUrl: './children-pendencies.component.html',
  styleUrl: './children-pendencies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenPendenciesComponent {
  private route = inject(ActivatedRoute);
  private childService = inject(ChildService);

  protected vm$: Observable<ChildPendenciesViewModel | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      if (!id) return of(null);
      return this.childService.getChildById(id).pipe(
        map((child) => {
          const vaccines = child.vaccines || [];

          return {
            child,
            overdue: vaccines.filter((vaccine) => getVaccineItemStatus(vaccine) === 'overdue'),
            pending: vaccines.filter((vaccine) => getVaccineItemStatus(vaccine) === 'pending'),
          };
        }),
        catchError(() => of(null)),
      );
    }),
  );

  constructor() {
    addIcons({ calendarOutline, timeOutline, warningOutline });
  }
}
