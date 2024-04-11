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
import { filter, map, tap } from 'rxjs';
import { InvitationDto } from '../shared/models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  selector: 'app-company',
  template: `
    <!-- Company: {{ (company() | json) ?? 'none' }}<br />
    Invitation: {{ (invitation() | json) ?? 'none' }}<br /> -->
    <div
      class="mat-h3 grid grid-cols-[min-content_1fr] items-center gap-4 p-4 border border-orange-400 bg-orange-50"
    >
      <mat-icon fontIcon="mail"></mat-icon>
      <div class="flex-1">
        <h3 class="mat-h4 font-bold mb-0">Company Invitation</h3>
        <p class="mat-body-2 mb-0">
          The company
          <strong>{{ invitation()?.company?.name }}</strong> with the VAT number
          <strong>{{ invitation()?.company?.VAT }}</strong> has invited you to
          join their team.
        </p>
      </div>
      <div></div>
      <div class="flex gap-3">
        <button mat-stroked-button (click)="declineDialog()">
          Decline
        </button>
        <button mat-raised-button color="primary">Accept</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyComponent {
  private readonly profileService = inject(ProfileService);
  readonly company = computed(() => this.profileService.companies()?.[0]);
  readonly invitation = signal<InvitationDto | null>({
    company: {
      name: 'BASF',
      VAT: '1231234234',
    },
    emailToInvite: 'asasd',
  });
  private readonly dialog = inject(MatDialog);

  constructor() {
    effect(
      () => {
        if (this.company()) return;
        const sub = this.profileService
          .getInvitations()
          .pipe(
            map((invitations) => invitations[0]),
            filter(Boolean),
            tap((invitation) => this.invitation.set(invitation))
          )
          .subscribe();
        return () => sub.unsubscribe();
      },
      { allowSignalWrites: true }
    );
  }

  declineDialog(): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });
  }
}
