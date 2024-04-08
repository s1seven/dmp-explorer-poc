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
      import('./app-user-profile/app-user-profile.component').then(
        (mod) => mod.UserProfileComponent
      ),
    canActivate: [AuthGuard],
  },
];
