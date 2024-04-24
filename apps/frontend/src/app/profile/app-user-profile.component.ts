import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';
import { CompanyComponent } from './company.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, CompanyComponent],
  template: `
    <div
      class="flex gap-4 mb-8 items-center rounded-md p-4 border border-gray-300 flex-row max-w-3xl ng-untouched ng-pristine ng-invalid"
      *ngIf="user() as user"
    >
      <img
        class="shadow-sm w-24 h-24 rounded-full"
        [src]="user.picture"
        alt="Profile"
      />
      <div class="flex flex-col">
        <span><strong>Name:</strong> {{ user.name }}</span>
        <span><strong>Nickname:</strong> {{ user.nickname }}</span>
        <span><strong>Email:</strong> {{ user.email }}</span>
      </div>
    </div>

    <app-company></app-company>
  `,
})
export class UserProfileComponent {
  readonly user = toSignal(this.auth.user$);

  user$ = this.auth.user$;
  code$ = this.user$.pipe(
    map((user) => {
      return JSON.stringify(user, null, 2);
    })
  );

  constructor(public auth: AuthService) {}
}
