import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';
import { CompanyComponent } from './company.component';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, CompanyComponent],
  template: ` <h2>Company</h2>
    <app-company></app-company>

    <h2>Profile</h2>

    <div class="content-layout">
      <h1 id="page-title" class="content__title">Profile Page</h1>
      <div class="content__body">
        <p id="page-description">
          <span>
            You can use the <strong>ID Token</strong> to get the profile
            information of an authenticated user.
          </span>
          <span>
            <strong>Only authenticated users can access this page.</strong>
          </span>
        </p>

        <ng-container *ngIf="user$ | async as user">
          <div class="profile-grid">
            <div class="profile__header">
              <img [src]="user.picture" alt="Profile" class="profile__avatar" />
              <div class="profile__headline">
                <h2 class="profile__title">{{ user.name }}</h2>
                <span class="profile__description">{{ user.email }}</span>
              </div>
            </div>
            {{ code$ | async | json }}
          </div>
        </ng-container>
      </div>
    </div>`,
  standalone: true,
})
export class UserProfileComponent {
  title = 'Decoded ID Token';

  user$ = this.auth.user$;
  code$ = this.user$.pipe(
    map((user) => {
      // eslint-disable-next-line no-console
      console.log('User: ', user);
      return JSON.stringify(user, null, 2);
    })
  );

  constructor(public auth: AuthService) {}
}
