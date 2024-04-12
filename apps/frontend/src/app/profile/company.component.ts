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
import { CreateCompanyComponent } from './create-company.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CreateCompanyComponent,
  ],
  selector: 'app-company',
  template: `
    <app-create-company *ngIf="!company"></app-create-company>

    <p *ngIf="this.company">
      {{ this.company() | json }}
    </p>

    <!-- invitation: -->
    <div
      *ngIf="this.invitation() as invitation"
      class="rounded-md p-4 border max-w-3xl border-orange-400 bg-orange-50 grid grid-cols-[min-content_1fr] items-center gap-4"
    >
      <mat-icon fontIcon="mail"></mat-icon>
      <div class="flex-1">
        <h3 class="mat-h4 font-bold mb-0">Company Invitation</h3>
        <p class="mat-body-2 mb-0">
          The company
          <strong>{{ invitation.company.name }}</strong> with the VAT number
          <strong>{{ invitation.company.VAT }}</strong> has invited you to
          join their team.
        </p>
      </div>
      <div></div>
      <div class="flex gap-3">
        <button mat-stroked-button (click)="declineDialog()">Decline</button>
        <button (click)="acceptInvitation(invitation)" mat-raised-button color="primary">
          Accept
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyComponent {
  private readonly profileService = inject(ProfileService);
  readonly company = computed(() => this.profileService.companies()?.[0]);
  readonly invitation = signal<InvitationDto | null>(null);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

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

  acceptInvitation() {
    const sub = this.profileService
      .acceptInvitation(this.invitation()!)
      .pipe(tap(async () => (await this.profileService.getCompanies())[0]))
      .subscribe();
  }

  declineInvitation() {
    this.profileService.declineInvitation(this.invitation()!);
  }

  declineDialog(): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Decline Invitation',
        message: 'Are you sure you want to decline this invitation?',
        cancel: 'Cancel',
        confirm: 'Confirm',
      },
    });
  }
}
