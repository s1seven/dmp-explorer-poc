import { Component } from '@angular/core';
import { NavbarComponent } from './navbar.component';

@Component({
  standalone: true,
  imports: [NavbarComponent],
  selector: 'app-page-layout',
  template: `
    <div>
      <app-navbar></app-navbar>
      <div class="container mx-auto py-8 bg-primary-500 overflow-hidden">
        <ng-content></ng-content>
      </div>
      <!-- <app-footer></app-footer> -->
    </div>
  `,
})
export class PageLayoutComponent {}
