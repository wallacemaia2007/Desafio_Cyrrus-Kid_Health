import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { shareReplay } from 'rxjs/operators';
import { CampaignService } from '../../../core/services/campaign.service';
import { CampaignCardComponent } from '../../../shared/components/campaign-card/campaign-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { isCampaignCurrentlyActive } from '../../../shared/utils/vaccination-status';
import { Campaign } from '../../../shared/model/campaign';
import {
  CardGridFilterOption,
  CardGridSearchFn,
  PaginatedCardGridComponent,
} from '../../../shared/components/paginated-card-grid/paginated-card-grid.component';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [
    CommonModule,
    CampaignCardComponent,
    PageHeaderComponent,
    LoadingStateComponent,
    PaginatedCardGridComponent,
  ],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListComponent {
  private campaignService = inject(CampaignService);

  protected campaigns$ = this.campaignService
    .getCampaigns()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  protected readonly campaignFilters: CardGridFilterOption<Campaign>[] = [
    { label: 'Todas', value: 'all', predicate: () => true },
    {
      label: 'Ativas',
      value: 'active',
      predicate: (campaign) => isCampaignCurrentlyActive(campaign),
    },
    {
      label: 'Inativas',
      value: 'ended',
      predicate: (campaign) => !isCampaignCurrentlyActive(campaign),
    },
  ];

  protected readonly searchCampaigns: CardGridSearchFn<Campaign> = (campaign, term) => {
    const title = this.normalizeSearchText(campaign.title);
    return title.includes(term);
  };

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
