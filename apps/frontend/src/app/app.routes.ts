import { Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

export const appRoutes: Route[] = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   loadComponent: () =>
  //     import('./app.component').then((mod) => mod.AppComponent),
  // },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/app-user-profile.component').then(
        (mod) => mod.UserProfileComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'batch',
    loadComponent: () =>
      import('./components/batch-form.component').then(
        (mod) => mod.BatchFormComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'batches',
    loadComponent: () =>
      import('./components/batches.component').then(
        (mod) => mod.BatchesComponent
      ),
    canActivate: [AuthGuard],
  },
];
