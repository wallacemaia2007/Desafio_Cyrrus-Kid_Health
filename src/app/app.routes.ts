import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'children',
        loadChildren: () => import('./pages/children/children.routes').then((m) => m.routes),
      },
      {
        path: 'campaigns',
        loadChildren: () => import('./pages/campaigns/campaigns.routes').then((m) => m.routes),
      },
    ],
  },
];
