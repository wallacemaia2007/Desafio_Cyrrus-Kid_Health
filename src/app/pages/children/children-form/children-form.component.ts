import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-children-form',
  standalone: true,
  templateUrl: './children-form.component.html',
  styleUrl: './children-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenFormComponent {}
