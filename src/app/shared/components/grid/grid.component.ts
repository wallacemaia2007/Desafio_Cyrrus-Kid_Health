import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-grid',
  standalone: true,
  template: `<div class="app-grid" [style.--grid-min-width]="minWidth() + 'px'" [style.--grid-gap]="gap() + 'rem'"><ng-content /></div>`,
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  readonly minWidth = input(280);
  readonly gap = input(1.25);
}
