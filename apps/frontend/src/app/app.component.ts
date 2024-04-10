import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginButtonComponent } from './components/app-login-button.component';
import { UserProfileComponent } from './components/app-user-profile.component';
import { NavbarComponent } from './components/navbar.component';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { PageLoaderComponent } from './components/page-loader.component';
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
  templateUrl: './app.component.html',
  styles: '',
})
export class AppComponent {
  isAuth0Loading$ = this.authService.isLoading$;

  constructor(private authService: AuthService) {}
}
