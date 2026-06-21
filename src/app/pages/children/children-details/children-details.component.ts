import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-children-details',
  standalone: true,
  templateUrl: './children-details.component.html',
  styleUrl: './children-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenDetailsComponent {}
