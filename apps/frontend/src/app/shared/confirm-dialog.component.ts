import { Component, Inject, Signal } from '@angular/core';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from '../profile/profile.service';
import { InvitationDto } from './models';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  template: `<h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      {{ data.message }}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>
        {{ data.cancel }}
      </button>
      <button mat-button mat-dialog-close (click)="cancel()" cdkFocusInitial>
        {{ data.confirm }}
      </button>
    </mat-dialog-actions>`,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      cancel: string;
      confirm: string;
      invitation: Signal<InvitationDto>;
    },
    private readonly profileService: ProfileService
  ) {}

  async cancel() {
    await firstValueFrom(
      this.profileService.respondToInvitation(
        this.data.invitation() as InvitationDto,
        false
      )
    );
    // TODO: how can I set the invitation to null in the parent component?
    // this.data.invitation().set(null);
    this.dialogRef.close();
  }
}
