import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonSearchbar,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { happyOutline, calendarOutline, searchOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Child } from '../../../shared/model/child';
import { ChildService } from '../../../core/services/child.service';

@Component({
  selector: 'app-child-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonSearchbar,
    IonSpinner,
    IonIcon,
  ],
  templateUrl: './children-list.component.html',
  styleUrls: ['./children-list.component.scss'],
})
export class ChildrenListComponent {
  private allChildren$: Observable<Child[]>;
  private searchTerm$ = new BehaviorSubject<string>('');
  filteredChildren$: Observable<Child[]>;

  constructor(
    private childService: ChildService,
  ) {
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

  getVaccineStatus(child: Child): string {
    if (child.pendingVaccines === 0) return 'complete';
    if (child.appliedVaccines > 0) return 'partial';
    return 'pending';
  }

  getVaccineProgress(child: Child): number {
    if (!child.totalVaccines) return 0;
    return (child.appliedVaccines / child.totalVaccines) * 100;
  }
}
