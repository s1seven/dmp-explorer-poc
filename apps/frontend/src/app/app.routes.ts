import { inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { ProfileService } from './profile/profile.service';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell.component').then((mod) => mod.ShellComponent),
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/app-user-profile.component').then(
            (mod) => mod.UserProfileComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        canActivate: [
          async () => {
            const router = inject(Router);
            const profileService = inject(ProfileService);
            const companies = await profileService.getCompanies();
            return companies.length ? true : router.createUrlTree(['/profile']);
          },
        ],
        path: '',
        children: [
          {
            path: 'create-batch',
            loadComponent: () =>
              import('./batches/batch-form.component').then(
                (mod) => mod.BatchFormComponent
              ),
            canActivate: [AuthGuard],
          },
          {
            path: 'batches',
            loadComponent: () =>
              import('./batches/batches.component').then(
                (mod) => mod.BatchesComponent
              ),
            canActivate: [AuthGuard],
          },
        ],
      },
    ],
  },
];
