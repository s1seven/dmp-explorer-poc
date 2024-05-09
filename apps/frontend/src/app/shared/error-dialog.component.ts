import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
  message: string;
}

@Component({
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  template: `
    <h2 mat-dialog-title>Something went wrong...</h2>
    <mat-dialog-content>
      <p class="wrap">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button [mat-dialog-close]="false" cdkFocusInitial>
        Ignore
      </button>
      <button
        mat-raised-button
        [mat-dialog-close]="true"
        color="primary"
        cdkFocusInitial
      >
        Retry
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDialogComponent {
  readonly dialogRef: MatDialogRef<ErrorDialogComponent> = inject(
    MatDialogRef<ErrorDialogComponent>
  );
  readonly data: DialogData = inject(MAT_DIALOG_DATA);
}
