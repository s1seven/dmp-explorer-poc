import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { LoginButtonComponent } from './app-login-button/app-login-button.component';
import { LogoutButtonComponent } from './app-logout-button/app-logout-button.component';
import { UserProfileComponent } from './app-user-profile/app-user-profile.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    LoginButtonComponent,
    LogoutButtonComponent,
    UserProfileComponent,
    NavbarComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
