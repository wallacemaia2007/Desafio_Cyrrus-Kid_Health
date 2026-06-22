import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-children-form',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './children-form.component.html',
  styleUrl: './children-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenFormComponent {}
