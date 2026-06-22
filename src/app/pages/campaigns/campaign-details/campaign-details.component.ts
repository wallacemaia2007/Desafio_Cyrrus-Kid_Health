import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { Campaign } from '../../../shared/model/campaign';
import { CampaignService } from '../../../core/services/campaign.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonIcon,
    PageHeaderComponent,
    StatusBadgeComponent,
    LoadingStateComponent,
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
    addIcons({ arrowBackOutline });
  }
}
