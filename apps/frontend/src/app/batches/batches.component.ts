import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BatchDto, Status } from '../shared/models';
import { ProfileService } from '../profile/profile.service';
import { BatchService } from './batch.service';

export enum BatchInboxType {
  RECLAIM = 'RECLAIM',
  ACCEPT = 'ACCEPT',
}

export interface BatchInbox {
  type: BatchInboxType;
  batch: BatchDto;
}

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <h2>Inbox</h2>
    {{ inbox() | json }}
    <h2>Batches</h2>
    {{ batches() | json }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchesComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  readonly company = computed(() => this.profileService.companies()?.[0]);
  readonly batches = signal<BatchDto[]>([]);

  // Batches that:
  // - have been sent to you but not accepted
  // - you sent to someone but they have declined
  readonly inbox = computed<BatchInbox[]>(() => {
    const batches = this.batches();
    if (!batches) return [];
    return batches
      .filter((batch) => batch.status !== Status.ACCEPTED)
      .map((batch) => ({
        batch,
        type:
          batch.status === Status.PENDING
            ? BatchInboxType.ACCEPT
            : BatchInboxType.RECLAIM,
      }));
  });

  private readonly batchService = inject(BatchService);

  ngOnInit() {
    this.batchService.getBatches();
  }
}

// displayedColumns: string[] = [
//   'lotNumber',
//   'leadContent',
//   'mercuryContent',
//   'cadmiumContent',
//   'isRoHSCompliant',
//   'quantity',
//   'unit',
// ];

// <table mat-table [dataSource]="batchesArray$">
// <!-- Lot Number Column -->
// <ng-container matColumnDef="lotNumber">
//   <th mat-header-cell *matHeaderCellDef>Lot Number</th>
//   <td mat-cell *matCellDef="let batch">{{ batch.lotNumber }}</td>
// </ng-container>

// <!-- Lead Content Column -->
// <ng-container matColumnDef="leadContent">
//   <th mat-header-cell *matHeaderCellDef>Lead Content</th>
//   <td mat-cell *matCellDef="let batch">{{ batch.leadContent }}</td>
// </ng-container>

// <!-- Mercury Content Column -->
// <ng-container matColumnDef="mercuryContent">
//   <th mat-header-cell *matHeaderCellDef>Mercury Content</th>
//   <td mat-cell *matCellDef="let batch">{{ batch.mercuryContent }}</td>
// </ng-container>

// <!-- Cadmium Content Column -->
// <ng-container matColumnDef="cadmiumContent">
//   <th mat-header-cell *matHeaderCellDef>Cadmium Content</th>
//   <td mat-cell *matCellDef="let batch">{{ batch.cadmiumContent }}</td>
// </ng-container>

// <!-- RoHS Compliance Column -->
// <ng-container matColumnDef="isRoHSCompliant">
//   <th mat-header-cell *matHeaderCellDef>RoHS Compliance</th>
//   <td mat-cell *matCellDef="let batch">{{ batch.isRoHSCompliant }}</td>
// </ng-container>

// // TODO: combine quantity and unit
// <!-- Quantity Column -->
// <ng-container matColumnDef="quantity">
//   <th mat-header-cell *matHeaderCellDef>Quantity</th>
//   <td mat-cell *matCellDef="let batch">{{ batch.quantity }}</td>
// </ng-container>

// <!-- Cadmium Content Column -->
// <ng-container matColumnDef="unit">
//   <th mat-header-cell *matHeaderCellDef>Unit</th>
//   <td mat-cell *matCellDef="let batch">{{ batch.unit }}</td>
// </ng-container>

// <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
// <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
// </table>
