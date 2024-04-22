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
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-inbox-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterLink, MatButtonModule],
  template: `
    <mat-table class="overflow-auto" [dataSource]="batches()">
      <!-- Lot Number Column -->
      <ng-container matColumnDef="lotNumber">
        <mat-header-cell class="px-2" *matHeaderCellDef>Lot Number</mat-header-cell>
        <mat-cell class="px-2" *matCellDef="let batch">{{ batch.lotNumber }}</mat-cell>
      </ng-container>

      <!-- Lead Content Column -->
      <ng-container matColumnDef="leadContent">
        <mat-header-cell class="px-2" *matHeaderCellDef>Lead Content</mat-header-cell>
        <mat-cell class="px-2" *matCellDef="let batch">{{ batch.leadContent }}</mat-cell>
      </ng-container>

      <!-- Mercury Content Column -->
      <ng-container matColumnDef="mercuryContent">
        <mat-header-cell class="px-2" *matHeaderCellDef>Mercury Content</mat-header-cell>
        <mat-cell class="px-2" *matCellDef="let batch">{{ batch.mercuryContent }}</mat-cell>
      </ng-container>

      <!-- Cadmium Content Column -->
      <ng-container matColumnDef="cadmiumContent">
        <mat-header-cell class="px-2" *matHeaderCellDef>Cadmium Content</mat-header-cell>
        <mat-cell class="px-2" *matCellDef="let batch">{{ batch.cadmiumContent }}</mat-cell>
      </ng-container>

      <!-- RoHS Compliance Column -->
      <ng-container matColumnDef="isRoHSCompliant">
        <mat-header-cell class="px-2" *matHeaderCellDef>RoHS Compliant</mat-header-cell>
        <mat-cell class="px-2" *matCellDef="let batch">{{ batch.isRoHSCompliant }}</mat-cell>
      </ng-container>

      <!-- Quantity Column -->
      <ng-container matColumnDef="quantity">
        <mat-header-cell class="px-2" *matHeaderCellDef>Quantity</mat-header-cell>
        <mat-cell class="px-2" *matCellDef="let batch">
          {{ batch.quantity }} {{ batch.unit }}
        </mat-cell>
      </ng-container>

      <!-- Status Column -->
      <ng-container matColumnDef="status">
        <mat-header-cell class="px-2" *matHeaderCellDef>Status</mat-header-cell>
        <mat-cell class="px-2" *matCellDef="let batch">{{ batch.status }}</mat-cell>
      </ng-container>

      <!-- Owner Column -->
      <ng-container matColumnDef="owner">
        <mat-header-cell class="px-2" *matHeaderCellDef>Owner VAT</mat-header-cell>
        <mat-cell class="px-2"  *matCellDef="let batch">{{ batch?.company?.VAT }}</mat-cell>
      </ng-container>

      <!-- Action Column -->
      <ng-container
        $ngIf="batch.status !== 'declined'"
        matColumnDef="action-button"
        class="col-span-2 "
      >
        <mat-header-cell class="px-2" class="col-span-2 justify-between" *matHeaderCellDef
          >Accept</mat-header-cell
        >
        <mat-cell class="px-2" class="col-span-2 justify-between" *matCellDef="let batch">
          <button
            *ngIf="batch.status !== 'declined'"
            mat-stroked-button
            class="w-20 "
            color="warn"
            (click)="rejectBatch(batch)"
            routerLinkActive="bg-primary-100"
          >
            Reject
          </button>
          <button
            mat-stroked-button
            class="w-20 "
            color="secondary"
            *ngIf="batch.status !== 'declined'"
            (click)="acceptBatch(batch)"
            routerLinkActive="bg-primary-100"
          >
            Accept
          </button>
          <a
            class="text-inherit w-20 "
            *ngIf="batch.status === 'declined'"
            mat-stroked-button
            color="primary"
            (click)="reclaimBatch(batch)"
            routerLinkActive="bg-primary-100"
            >Reclaim</a
          >
        </mat-cell>
      </ng-container>
      <!-- TODO: handle rejected batches -->

      <tr
        mat-header-row
        class="grid grid-cols-10 px-0"
        *matHeaderRowDef="displayedColumns"
      ></tr>
      <tr
        mat-row
        class="grid grid-cols-10 px-0"
        *matRowDef="let row; columns: displayedColumns"
      ></tr>
    </mat-table>
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
    'action-button',
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
