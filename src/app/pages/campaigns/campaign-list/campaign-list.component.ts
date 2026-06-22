import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CampaignService } from '../../../core/services/campaign.service';
import { CampaignCardComponent } from '../../../shared/components/campaign-card/campaign-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SummaryCardComponent, StatItem } from '../../../shared/components/summary-card/summary-card.component';

type FilterValue = 'all' | 'active' | 'ended';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [
    CommonModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    CampaignCardComponent,
    PageHeaderComponent,
    GridComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    SummaryCardComponent,
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

  stats$ = combineLatest([this.activeCount$, this.endedCount$]).pipe(
    map(([active, ended]) => [
      { label: 'Ativas', value: active },
      { label: 'Encerradas', value: ended },
    ] as StatItem[]),
  );

  onFilterChange(event: CustomEvent): void {
    this.filter$.next(event.detail.value);
  }
}
