import { Component } from '@angular/core';
import { PageLayoutComponent } from './page-layout.component';

@Component({
  standalone: true,
  imports: [PageLayoutComponent],
  selector: 'app-home',
  template: `<app-page-layout></app-page-layout> `,
})
export class HomeComponent {}
