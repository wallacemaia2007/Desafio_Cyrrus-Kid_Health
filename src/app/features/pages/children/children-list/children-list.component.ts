import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  IonSearchbar,
  IonBadge,
  IonCard,
  IonCardContent,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Child } from '../../../../shared/model/child';
import { ChildService } from '../../../services/child.service';

@Component({
  selector: 'app-child-list',
  standalone: true,
  imports: [
    CommonModule,
    IonSearchbar,
    IonBadge,
    IonCard,
    IonCardContent,
    IonSpinner,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './children-list.component.html',
  styleUrls: ['./children-list.component.scss'],
})
export class ChildrenListComponent implements OnInit {
  private allChildren$: Observable<Child[]>;
  private searchTerm$ = new BehaviorSubject<string>('');
  filteredChildren$: Observable<Child[]>;

  constructor(
    private childService: ChildService,
    private router: Router,
  ) {
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

  ngOnInit(): void {}

  onSearch(event: any): void {
    const term = event.target.value || '';
    this.searchTerm$.next(term);
  }

  goToDetails(childId: string): void {
    this.router.navigate(['/children/details', childId]);
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
