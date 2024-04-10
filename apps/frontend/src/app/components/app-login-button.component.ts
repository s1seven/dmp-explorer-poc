import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login-button',
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button
        (click)="
          auth.logout({ logoutParams: { returnTo: document.location.origin } })
        "
      >
        Log out
      </button>
    </ng-container>

    <ng-template #loggedOut>
      <button (click)="handleLogin()">Log in</button>
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

    })
  }
}
