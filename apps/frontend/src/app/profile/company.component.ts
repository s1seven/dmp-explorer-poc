import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ProfileService } from './profile.service';
import { catchError, filter, firstValueFrom, map, tap } from 'rxjs';
import { CreateInvitationDto, InvitationDto } from '../shared/models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { CreateCompanyComponent } from './create-company.component';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PendingInvitationsComponent } from './pending-invitations.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CreateCompanyComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    PendingInvitationsComponent,
  ],
  selector: 'app-company',
  template: `
    <div class="flex flex-col gap-8">
      <app-create-company
        *ngIf="!company() && !this.invitation()"
      ></app-create-company>

      <div
        class="flex gap-4 rounded-md p-4 border border-gray-300 flex-col max-w-3xl"
        *ngIf="this.company() as company"
      >
        <h2>Company</h2>
        <div class="flex flex-col">
          <span><strong>Name:</strong> {{ company.name }}</span>
          <span><strong>VAT:</strong> {{ company.VAT }}</span>
        </div>
      </div>
      <!-- invite a user to company form -->
      <div *ngIf="this.company()">
        <form
          class="rounded-md p-4 border border-gray-300 flex flex-col max-w-3xl"
          [formGroup]="inviteToCompanyForm"
          (ngSubmit)="inviteToCompany()"
        >
          <p class="text-gray-700 mb-6 flex gap-2">
            <span
              ><mat-icon
                fontIcon="info"
                [inline]="true"
                class="inline"
              ></mat-icon
            ></span>
            If you wish to invite a user to join your company, enter their email
            in the following form.
          </p>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput type="text" formControlName="emailToInvite" />
          </mat-form-field>
          <div class="flex gap-3">
            <button mat-raised-button color="primary">Invite to Company</button>
          </div>
        </form>
      </div>
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
          <button mat-stroked-button (click)="declineDialog(invitation)">
            Decline
          </button>
          <button
            (click)="acceptInvitation(invitation)"
            mat-raised-button
            color="primary"
          >
            Accept
          </button>
        </div>
      </div>
      <app-pending-invitations
        *ngIf="pendingInvitations().length"
        [invitations]="pendingInvitations()"
      ></app-pending-invitations>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly matSnackBar = inject(MatSnackBar);
  readonly company = computed(() => this.profileService.companies()?.[0]);
  readonly invitation = signal<InvitationDto | null>(null);
  private readonly dialog = inject(MatDialog);
  readonly inviteToCompanyForm = inject(NonNullableFormBuilder).group({
    emailToInvite: ['' as string, [Validators.required, Validators.email]],
  });
  readonly pendingInvitations = this.profileService.pendingInvitations;

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

  // TODO: combine accept and decline into one method
  async acceptInvitation(invitation: InvitationDto) {
    await firstValueFrom(
      this.profileService.respondToInvitation(invitation, true)
    );
    await this.profileService.getCompanies();
    this.invitation.set(null);
  }

  async declineInvitation(invitation: InvitationDto) {
    await firstValueFrom(
      this.profileService.respondToInvitation(invitation, false)
    );
    this.invitation.set(null);
  }

  async inviteToCompany() {
    if (this.inviteToCompanyForm.invalid) {
      return;
    }
    const { emailToInvite } = this.inviteToCompanyForm.value;
    const company = this.company();
    // TODO: fix types
    await firstValueFrom(
      this.profileService
        .createInvitation({
          emailToInvite,
          companyId: company.id,
        } as CreateInvitationDto)
        .pipe(
          catchError((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            return [];
          })
        )
    );
    this.matSnackBar.open(
      `${emailToInvite} has been invited to your company.`,
      'Close',
      { panelClass: ['mat-primary'] }
    );
    this.inviteToCompanyForm.reset();
  }

  async declineDialog(invitation: InvitationDto): Promise<void> {
    const result = await firstValueFrom(
      this.dialog
        .open(ConfirmDialogComponent, {
          width: '250px',
          data: {
            title: 'Decline Invitation',
            message: 'Are you sure you want to decline this invitation?',
            cancel: 'Cancel',
            confirm: 'Confirm',
            invitation,
          },
        })
        .afterClosed()
    );
    if (result === true) {
      this.declineInvitation(invitation);
    }
  }

  ngOnInit() {
    if (!this.company()) return;
    this.profileService.getAllInvitations();
  }
}
