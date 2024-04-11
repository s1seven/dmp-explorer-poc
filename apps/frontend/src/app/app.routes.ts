import { inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { ProfileService } from './profile/profile.service';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell.component').then((mod) => mod.ShellComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [
          async () => {
            const profileService = inject(ProfileService);
            await profileService.getCompanies();
            return true;
          },
        ],
        children: [
          {
            path: 'profile',
            loadComponent: () =>
              import('./profile/app-user-profile.component').then(
                (mod) => mod.UserProfileComponent
              ),
          },
          {
            path: '',
            canActivate: [
              async () => {
                const router = inject(Router);
                const profileService = inject(ProfileService);
                const companies = profileService.companies();
                return companies.length
                  ? true
                  : router.createUrlTree(['/profile']);
              },
            ],
            children: [
              {
                path: 'create-batch',
                loadComponent: () =>
                  import('./batches/batch-form.component').then(
                    (mod) => mod.BatchFormComponent
                  ),
              },
              {
                path: 'batches',
                loadComponent: () =>
                  import('./batches/batches.component').then(
                    (mod) => mod.BatchesComponent
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
];
