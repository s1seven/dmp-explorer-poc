import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LogoutButtonComponent } from '../app-logout-button/app-logout-button.component';
import { UserProfileComponent } from '../app-user-profile/app-user-profile.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    LogoutButtonComponent,
    UserProfileComponent,
  ],
  standalone: true,
  template: `
    <mat-toolbar color="primary">
      <mat-toolbar-row class="flex flex-row justify-between" >
        <button
          mat-icon-button
          (click)="sidenav.toggle()"
          class="block sm:hidden"
        >
          <mat-icon>menu</mat-icon>
        </button>
        <span>Responsive Navigation</span>
        <span class="menu-spacer"></span>
        <div class="hidden sm:block">
          <!-- The following menu items will be hidden on both SM and XS screen sizes -->
          <app-logout-button></app-logout-button>
          <a *ngIf="auth.user$ | async as user" mat-button routerLink="/profile"
            >Profile</a
          >
        </div>
      </mat-toolbar-row>
    </mat-toolbar>

    <mat-sidenav-container class="flex">
      <mat-sidenav #sidenav>
        <mat-nav-list>
          <!-- <a (click)="sidenav.toggle()" href="" mat-list-item>Close</a> -->
          <app-logout-button></app-logout-button>
          <a *ngIf="auth.user$ | async as user" mat-button routerLink="/profile"
            >Profile</a
          >
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content class="flex">Main content</mat-sidenav-content>
    </mat-sidenav-container>
    <!-- <mat-toolbar color="primary">
    <span>Receiver product</span>
    <div class="spacer"></div>
    <app-logout-button></app-logout-button>
    <a *ngIf="auth.user$ | async as user" mat-button routerLink="/profile">Profile</a>
  </mat-toolbar> -->
  `,
  styles: `.mat-toolbar{
    background-color: cornflowerblue;
    color: white;
  }.mat-button{
     color: white;
  }.spacer{
    flex: 1 1 auto;
  }`,
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
