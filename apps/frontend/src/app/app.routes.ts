import { inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { ProfileService } from './profile/profile.service';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell.component').then((mod) => mod.ShellComponent),
    canActivate: [AuthGuard, () => inject(ProfileService).getCompanies(true)],
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
        // User needs to have at least one company.
        canActivate: [
          async () => {
            const profileService = inject(ProfileService);
            const companies = profileService.companies();
            if (companies.length) return true;
            return inject(Router).createUrlTree(['/profile']);
          },
        ],
        children: [
          {
            path: 'create-batch',
            loadComponent: () =>
              import('./batches/create-batch.component').then(
                (mod) => mod.CreateBatchComponent
              ),
          },
          {
            path: 'batches',
            loadComponent: () =>
              import('./batches/batches.component').then(
                (mod) => mod.BatchesComponent
              ),
          },
          {
            path: 'batches/:batchId',
            loadComponent: () =>
              import('./batches/subbatches.component').then(
                (mod) => mod.SubbatchesComponent
              ),
          },
          {
            path: 'batches/:parentBatchId/:subBatchId/assign',
            loadComponent: () =>
              import('./batches/assign-batch.component').then(
                (mod) => mod.AssignBatchComponent
              ),
          },
          {
            path: 'batches/:subBatchId/create',
            loadComponent: () =>
              import('./batches/create-subbatch.component').then(
                (mod) => mod.CreateSubBatchComponent
              ),
          },
          {
            path: '**',
            redirectTo: 'batches',
          },
        ],
      },
    ],
  },
];
