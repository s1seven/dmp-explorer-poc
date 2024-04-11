import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ProfileService } from './profile.service';
import { tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-company',
  template: `Company: {{ company() | json }}<br />
    Invitation: {{ invitation() | json }}<br /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyComponent {
  private readonly profileService = inject(ProfileService);
  readonly company = computed(() => this.profileService.companies()?.[0]);
  readonly invitation = signal<any>(null);

  constructor() {
    effect(
      () => {
        if (this.company()) return;
        const sub = this.profileService
          .getInvitations()
          .pipe(tap((invitations) => this.invitation.set(invitations[0])))
          .subscribe();
        return () => sub.unsubscribe();
      },
      { allowSignalWrites: true }
    );
  }
}
