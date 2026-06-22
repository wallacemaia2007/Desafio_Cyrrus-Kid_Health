import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-children-details',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './children-details.component.html',
  styleUrl: './children-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenDetailsComponent {}
