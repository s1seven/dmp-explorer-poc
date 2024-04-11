import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginButtonComponent } from './layout/app-login-button.component';
import { UserProfileComponent } from './profile/app-user-profile.component';
import { NavbarComponent } from './layout/navbar.component';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { PageLoaderComponent } from './shared/page-loader.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageLoaderComponent,
    RouterModule,
    LoginButtonComponent,
    UserProfileComponent,
    NavbarComponent,
    HttpClientModule,
  ],
  selector: 'app-root',
  template: `<div
      class="page-layout"
      *ngIf="isAuth0Loading$ | async; else auth0Loaded"
    >
      <app-page-loader></app-page-loader>
    </div>
    <ng-template #auth0Loaded>
      <router-outlet></router-outlet>
    </ng-template>`,
  styles: '',
})
export class AppComponent {
  isAuth0Loading$ = this.authService.isLoading$;

  constructor(private authService: AuthService) {}
}
