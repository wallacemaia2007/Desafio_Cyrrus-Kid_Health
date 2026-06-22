import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatusBadgeVariant = 'active' | 'ended' | 'complete' | 'partial' | 'pending' | 'overdue';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span [class]="'status-badge status-' + status()">{{ label() }}</span>`,
  styleUrl: './status-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  readonly status = input.required<StatusBadgeVariant>();
  readonly label = input.required<string>();
}
