import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  templateUrl: './campaign-details.component.html',
  styleUrl: './campaign-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignDetailsComponent {}
