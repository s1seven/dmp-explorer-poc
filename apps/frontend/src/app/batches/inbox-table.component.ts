import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BatchDto } from '../shared/models';
import { RouterLink } from '@angular/router';
import { BatchesService } from './batch.service';

@Component({
  selector: 'app-inbox-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterLink],
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

      <!-- Accept Column -->
      <ng-container
        $ngIf="batch.status !== 'declined'"
        matColumnDef="accept-button"
      >
        <th mat-header-cell *matHeaderCellDef>Accept</th>
        <td mat-cell *matCellDef="let batch">
          <a
            class="text-inherit"
            mat-button
            *ngIf="batch.status !== 'declined'"
            (click)="acceptBatch(batch)"
            routerLinkActive="bg-primary-100"
            >Accept Batch</a
          >
        </td>
      </ng-container>

      <!-- Reject Column -->
      <ng-container matColumnDef="reject-button">
        <th mat-header-cell *matHeaderCellDef>Reject</th>
        <td mat-cell *matCellDef="let batch">
          <a
            class="text-inherit"
            *ngIf="batch.status !== 'declined'"
            mat-button
            (click)="rejectBatch(batch)"
            routerLinkActive="bg-primary-100"
            >Reject Batch</a
          >
        </td>
      </ng-container>

      <!-- Reclaim Column -->
      <ng-container matColumnDef="reclaim-button">
        <th mat-header-cell *matHeaderCellDef>Reclaim</th>
        <td mat-cell *matCellDef="let batch">
          <!-- TODO: use Status enum -->
          <a
            class="text-inherit"
            *ngIf="batch.status === 'declined'"
            mat-button
            (click)="reclaimBatch(batch)"
            routerLinkActive="bg-primary-100"
            >Reclaim Batch</a
          >
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
    'accept-button',
    'reject-button',
    'reclaim-button',
  ];

  async acceptBatch(batch: BatchDto) {
    await this.batchesService.acceptBatch(batch);
  }

  async rejectBatch(batch: BatchDto) {
    await this.batchesService.declineBatch(batch);
  }

  async reclaimBatch(batch: BatchDto) {
    await this.batchesService.reclaimBatch(batch);
  }
}
