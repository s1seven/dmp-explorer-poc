import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BatchDto } from '../shared/models';
import { RouterLink } from '@angular/router';
import { BatchesService } from './batch.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inbox-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterLink, MatButtonModule],
  template: `
    <table mat-table [dataSource]="batches()">
      <!-- Lot Number Column -->
      <ng-container matColumnDef="lotNumber">
        <th mat-header-cell *matHeaderCellDef>Lot Number</th>
        <td mat-cell *matCellDef="let batch">{{ batch.lotNumber }}</td>
      </ng-container>

      <!-- Lead Content Column -->
      <ng-container matColumnDef="leadContent">
        <th mat-header-cell *matHeaderCellDef>Lead Content</th>
        <td mat-cell *matCellDef="let batch">{{ batch.leadContent }}</td>
      </ng-container>

      <!-- Mercury Content Column -->
      <ng-container matColumnDef="mercuryContent">
        <th mat-header-cell *matHeaderCellDef>Mercury Content</th>
        <td mat-cell *matCellDef="let batch">{{ batch.mercuryContent }}</td>
      </ng-container>

      <!-- Cadmium Content Column -->
      <ng-container matColumnDef="cadmiumContent">
        <th mat-header-cell *matHeaderCellDef>Cadmium Content</th>
        <td mat-cell *matCellDef="let batch">{{ batch.cadmiumContent }}</td>
      </ng-container>

      <!-- RoHS Compliance Column -->
      <ng-container matColumnDef="isRoHSCompliant">
        <th mat-header-cell *matHeaderCellDef>RoHS Compliant</th>
        <td mat-cell *matCellDef="let batch">{{ batch.isRoHSCompliant }}</td>
      </ng-container>

      <!-- Quantity Column -->
      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Quantity</th>
        <td mat-cell *matCellDef="let batch">
          {{ batch.quantity }} {{ batch.unit }}
        </td>
      </ng-container>

      <!-- Status Column -->
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let batch">{{ batch.status }}</td>
      </ng-container>

      <!-- Owner Column -->
      <ng-container matColumnDef="owner">
        <th mat-header-cell *matHeaderCellDef>Owner VAT</th>
        <td mat-cell *matCellDef="let batch">{{ batch?.company?.VAT }}</td>
      </ng-container>

      <!-- Action Column -->
      <ng-container
        $ngIf="batch.status !== 'declined'"
        matColumnDef="action-button"
      >
        <th mat-header-cell *matHeaderCellDef>Accept</th>
        <td mat-cell *matCellDef="let batch">
          <div class="flex justify-end gap-4">
            <button
              *ngIf="batch.status !== 'declined'"
              mat-stroked-button
              (click)="rejectBatch(batch)"
            >
              Reject
            </button>
            <button
              mat-raised-button
              color="primary"
              *ngIf="batch.status !== 'declined'"
              (click)="acceptBatch(batch)"
            >
              Accept
            </button>
            <a
              *ngIf="batch.status === 'declined'"
              mat-raised-button
              color="primary"
              (click)="reclaimBatch(batch)"
              >Reclaim</a
            >
          </div>
        </td>
      </ng-container>
      <!-- TODO: handle rejected batches -->

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxTableComponent {
  @HostBinding('class') readonly class = 'block overflow-auto';
  private readonly matSnackBar = inject(MatSnackBar);
  readonly batches = input.required<BatchDto[]>();
  readonly batchesService = inject(BatchesService);
  readonly displayedColumns: string[] = [
    'lotNumber',
    'leadContent',
    'mercuryContent',
    'cadmiumContent',
    'isRoHSCompliant',
    'quantity',
    'owner',
    'status',
    'action-button',
  ];

  async acceptBatch(batch: BatchDto) {
    const acceptedBatch = await this.batchesService.acceptBatch(batch);
    this.openSnackbar(
      `Batch number ${acceptedBatch.lotNumber} has been accepted.`
    );
  }

  async rejectBatch(batch: BatchDto) {
    const rejectedBatch = await this.batchesService.declineBatch(batch);
    this.openSnackbar(
      `Batch number ${rejectedBatch.lotNumber} has been rejected.`
    );
  }

  async reclaimBatch(batch: BatchDto) {
    const reclaimedBatch = await this.batchesService.reclaimBatch(batch);
    this.openSnackbar(
      `Batch number ${reclaimedBatch.lotNumber} has been reclaimed.`
    );
  }

  openSnackbar(message: string) {
    this.matSnackBar.open(message, 'Close', { panelClass: ['mat-primary'] });
  }
}
