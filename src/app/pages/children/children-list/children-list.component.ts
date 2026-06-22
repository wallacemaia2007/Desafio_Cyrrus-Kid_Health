import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { Child } from '../../../shared/model/child';
import { ChildService } from '../../../core/services/child.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  CardGridSearchFn,
  PaginatedCardGridComponent,
} from '../../../shared/components/paginated-card-grid/paginated-card-grid.component';
import { ChildCardComponent } from '../../../shared/components/child-card/child-card.component';

@Component({
  selector: 'app-child-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingStateComponent,
    PaginatedCardGridComponent,
    ChildCardComponent,
  ],
  templateUrl: './children-list.component.html',
  styleUrls: ['./children-list.component.scss'],
})
export class ChildrenListComponent {
  children$: Observable<Child[]>;

  protected readonly searchChildren: CardGridSearchFn<Child> = (child, term) => {
    const childName = this.normalizeSearchText(child.name);
    const responsibleName = this.normalizeSearchText(child.responsible || '');

    return childName.includes(term) || responsibleName.includes(term);
  };

  constructor(private childService: ChildService) {
    this.children$ = this.childService.getChildren();
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
