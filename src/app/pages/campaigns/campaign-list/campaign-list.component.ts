import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListComponent {}
