import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-children-pendencies',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './children-pendencies.component.html',
  styleUrl: './children-pendencies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenPendenciesComponent {}
