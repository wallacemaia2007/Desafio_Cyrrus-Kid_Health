import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./campaign-list/campaign-list.component').then((m) => m.CampaignListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./campaign-details/campaign-details.component').then((m) => m.CampaignDetailsComponent),
  },
];
