import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { medkitOutline, peopleOutline } from 'ionicons/icons';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Campaign } from '../../../shared/model/campaign';
import { CampaignService } from '../../../core/services/campaign.service';

type FilterValue = 'all' | 'active' | 'ended';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
    IonIcon,
  ],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListComponent {
  private campaignService = inject(CampaignService);

  private campaigns$ = this.campaignService.getCampaigns();
  private filter$ = new BehaviorSubject<FilterValue>('all');

  filteredCampaigns$ = combineLatest([this.campaigns$, this.filter$]).pipe(
    map(([campaigns, filter]) => {
      if (filter === 'all') return campaigns;
      if (filter === 'active') return campaigns.filter((c) => c.active);
      return campaigns.filter((c) => !c.active);
    }),
  );

  activeCount$ = this.campaigns$.pipe(
    map((campaigns) => campaigns.filter((c) => c.active).length),
  );

  endedCount$ = this.campaigns$.pipe(
    map((campaigns) => campaigns.filter((c) => !c.active).length),
  );

  constructor() {
    addIcons({ medkitOutline, peopleOutline });
  }

  onFilterChange(event: CustomEvent): void {
    this.filter$.next(event.detail.value);
  }
}
