import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./children-list/children-list.component').then((m) => m.ChildrenListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./children-form/children-form.component').then((m) => m.ChildrenFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./children-form/children-form.component').then((m) => m.ChildrenFormComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./children-details/children-details.component').then((m) => m.ChildrenDetailsComponent),
  },
  {
    path: 'pendencies/:id',
    loadComponent: () =>
      import('./children-pendencies/children-pendencies.component').then((m) => m.ChildrenPendenciesComponent),
  },
];
