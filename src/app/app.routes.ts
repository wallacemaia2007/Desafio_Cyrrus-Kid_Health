import { Routes } from '@angular/router';
import { HomeComponent } from './features/pages/home/home.component';
import { ChildrenListComponent } from './features/pages/children/children-list/children-list.component';
import { CampaignListComponent } from './features/pages/campaign/campaign-list/campaign-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'children',
    loadChildren: () => import('./features/pages/children/children.routes').then((m) => m.routes),
  },
  {
    path: 'campaigns',
    loadChildren: () => import('./features/pages/campaign/campaign.routes').then((m) => m.routes),
  },
];
