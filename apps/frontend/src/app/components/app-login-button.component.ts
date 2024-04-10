import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login-button',
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button
        class="inline-block cursor-pointer select-none border text-center relative group/button py-1 px-4 text-base rounded-lg bg-white text-gray-900 border-primary-50 hover:bg-grey-100"
        (click)="
          auth.logout({ logoutParams: { returnTo: document.location.origin } })
        "
      >
        Log out
      </button>
    </ng-container>

    <ng-template #loggedOut>
      <button
        class="inline-block cursor-pointer select-none border text-center relative group/button py-1 px-4 text-base rounded-lg bg-white text-gray-900 border-primary-50 hover:bg-grey-100"
        (click)="handleLogin()"
      >
        Log in
      </button>
    </ng-template>
  `,
  standalone: true,
})
export class LoginButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}

  handleLogin(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/profile',
      },
      authorizationParams: {
        screen_hint: 'login',
      },
    });
  }
}
