import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  template: `<div>
    <app-navbar></app-navbar>
    <div class="container mx-auto py-8 overflow-hidden">
      <router-outlet></router-outlet>
    </div>
    <!-- <app-footer></app-footer> -->
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, NavbarComponent],
})
export class ShellComponent {}
