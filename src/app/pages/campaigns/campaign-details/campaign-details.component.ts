import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { medkitOutline } from 'ionicons/icons';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { Campaign } from '../../../shared/model/campaign';
import { CampaignService } from '../../../core/services/campaign.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { isCampaignCurrentlyActive } from '../../../shared/utils/vaccination-status';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    PageHeaderComponent,
    StatusBadgeComponent,
    LoadingStateComponent,
    BackButtonComponent,
  ],
  templateUrl: './campaign-details.component.html',
  styleUrl: './campaign-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignDetailsComponent {
  private route = inject(ActivatedRoute);
  private campaignService = inject(CampaignService);

  campaign$: Observable<Campaign | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      if (!id) return of(null);
      return this.campaignService.getCampaignById(id).pipe(catchError(() => of(null)));
    }),
  );

  constructor() {
    addIcons({ medkitOutline });
  }

  protected isActive(campaign: Campaign): boolean {
    return isCampaignCurrentlyActive(campaign);
  }
}
