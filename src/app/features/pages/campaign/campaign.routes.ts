import { Routes } from '@angular/router';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';

export const routes: Routes = [
  {
    path: '',
    component: CampaignListComponent,
  },
  {
    path: ':id',
    component: CampaignDetailsComponent,
  },
];
