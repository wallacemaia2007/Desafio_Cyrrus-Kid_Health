import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-children-pendencies',
  standalone: true,
  templateUrl: './children-pendencies.component.html',
  styleUrl: './children-pendencies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenPendenciesComponent {}
