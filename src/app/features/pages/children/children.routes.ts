import { Routes } from '@angular/router';
import { ChildrenListComponent } from './children-list/children-list.component';
import { ChildrenFormComponent } from './children-form/children-form.component';
import { ChildrenDetailsComponent } from './children-details/children-details.component';

export const routes: Routes = [
  {
    path: '',
    component: ChildrenListComponent,
  },
  {
    path: 'new',
    component: ChildrenFormComponent,
  },
  {
    path: 'edit/:id',
    component: ChildrenFormComponent,
  },
  {
    path: 'details/:id',
    component: ChildrenDetailsComponent,
  },
];
