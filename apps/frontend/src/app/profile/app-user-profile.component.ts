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
    <div class="flex gap-4 items-center mb-10" *ngIf="user() as user">
      <img
        class="shadow-md w-28 h-28 rounded-full"
        [src]="user.picture"
        alt="Profile"
      />
      <div class="flex flex-col">
        <span><strong>Name:</strong> {{ user.name }}</span>
        <span><strong>Nickname:</strong> {{ user.nickname }}</span>
        <span><strong>Email:</strong> {{ user.email }}</span>
        <p class="text-gray-700 mb-0">
          If you need to update your information, please
          <a
            class="underline underline-offset-2"
            href="mailto: contact@s1seven.com"
            >contact S1SEVEN</a
          >.
        </p>
      </div>
    </div>

    <h2>Company</h2>
    <app-company></app-company>
  `,
})
export class UserProfileComponent {
  readonly user = toSignal(this.auth.user$);

  user$ = this.auth.user$;
  code$ = this.user$.pipe(
    map((user) => {
      // eslint-disable-next-line no-console
      console.log('User: ', user);
      return JSON.stringify(user, null, 2);
    })
  );

  constructor(public auth: AuthService) {}
}
