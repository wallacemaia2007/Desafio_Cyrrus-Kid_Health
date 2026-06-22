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
import { Child } from '../../../shared/model/child';
import { ChildService } from '../../../core/services/child.service';

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
    if (child.pendingVaccines === 0) return 'complete';
    if (child.appliedVaccines > 0) return 'partial';
    return 'pending';
  }

  protected vaccineProgress(child: Child): number {
    if (!child.totalVaccines) return 0;
    return (child.appliedVaccines / child.totalVaccines) * 100;
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
