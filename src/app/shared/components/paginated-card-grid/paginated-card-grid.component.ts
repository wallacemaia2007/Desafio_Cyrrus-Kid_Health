import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, filterOutline } from 'ionicons/icons';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { GridComponent } from '../grid/grid.component';

export interface CardGridFilterOption<T = unknown> {
  label: string;
  value: string;
  predicate: (item: T) => boolean;
}

export type CardGridSearchFn<T = unknown> = (item: T, term: string) => boolean;

@Component({
  selector: 'app-paginated-card-grid',
  standalone: true,
  imports: [CommonModule, RouterLink, IonIcon, IonSearchbar, EmptyStateComponent, GridComponent],
  templateUrl: './paginated-card-grid.component.html',
  styleUrl: './paginated-card-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatedCardGridComponent<T = unknown> {
  readonly items = input<readonly T[]>([]);
  readonly searchPlaceholder = input('');
  readonly searchFn = input<CardGridSearchFn<T> | null>(null);
  readonly filterOptions = input<readonly CardGridFilterOption<T>[]>([]);
  readonly pageSize = input(6);
  readonly emptyTitle = input('Nenhum item encontrado.');
  readonly emptySubtitle = input<string>();
  readonly emptyIcon = input<string>();
  readonly minWidth = input(280);
  readonly gap = input(1.25);
  readonly actionLabel = input<string>();
  readonly actionRoute = input<string | unknown[] | null>(null);

  readonly itemTemplate = contentChild.required<TemplateRef<{ $implicit: T }>>(TemplateRef);

  protected readonly searchTerm = signal('');
  protected readonly selectedFilter = signal('');
  protected readonly currentPage = signal(1);
  protected readonly isFilterMenuOpen = signal(false);

  constructor() {
    addIcons({ addOutline, filterOutline });
  }

  protected readonly activeFilterValue = computed(() => {
    const filters = this.filterOptions();
    return this.selectedFilter() || filters[0]?.value || '';
  });

  protected readonly hasActiveSpecificFilter = computed(() => {
    const filters = this.filterOptions();
    return filters.length > 0 && this.activeFilterValue() !== filters[0].value;
  });

  protected readonly filteredItems = computed(() => {
    const term = this.normalizeSearchText(this.searchTerm());
    const searchFn = this.searchFn();
    const filter = this.filterOptions().find((option) => option.value === this.activeFilterValue());

    return this.items().filter((item) => {
      const matchesSearch = !term || !searchFn || searchFn(item, term);
      const matchesFilter = !filter || filter.predicate(item);
      return matchesSearch && matchesFilter;
    });
  });

  protected readonly totalPages = computed(() => {
    const size = this.normalizedPageSize();
    return Math.max(1, Math.ceil(this.filteredItems().length / size));
  });

  protected readonly safeCurrentPage = computed(() => {
    return Math.min(this.currentPage(), this.totalPages());
  });

  protected readonly paginatedItems = computed(() => {
    const size = this.normalizedPageSize();
    const start = (this.safeCurrentPage() - 1) * size;
    return this.filteredItems().slice(start, start + size);
  });

  protected readonly shouldShowPagination = computed(() => {
    return this.filteredItems().length > this.normalizedPageSize();
  });

  protected readonly visibleStart = computed(() => {
    return this.filteredItems().length === 0
      ? 0
      : (this.safeCurrentPage() - 1) * this.normalizedPageSize() + 1;
  });

  protected readonly visibleEnd = computed(() => {
    return Math.min(
      this.safeCurrentPage() * this.normalizedPageSize(),
      this.filteredItems().length,
    );
  });

  protected onSearch(event: CustomEvent<{ value?: string | null }>): void {
    this.searchTerm.set(event.detail.value || '');
    this.currentPage.set(1);
  }

  protected toggleFilterMenu(): void {
    this.isFilterMenuOpen.update((isOpen) => !isOpen);
  }

  protected selectFilter(value: string): void {
    this.selectedFilter.set(value);
    this.currentPage.set(1);
    this.isFilterMenuOpen.set(false);
  }

  protected goToPreviousPage(): void {
    this.currentPage.set(Math.max(1, this.safeCurrentPage() - 1));
  }

  protected goToNextPage(): void {
    this.currentPage.set(Math.min(this.totalPages(), this.safeCurrentPage() + 1));
  }

  private normalizedPageSize(): number {
    return Math.max(1, this.pageSize());
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
