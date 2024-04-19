import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BatchDto } from '../shared/models';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-batches-table',
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

      <!-- Subbatch Column -->
      <ng-container matColumnDef="subbatch-button">
        <th mat-header-cell *matHeaderCellDef>subbatch</th>
        <td mat-cell *matCellDef="let batch">
          <a
            class="bg-transparent hover:bg-secondary-400 text-secondary-800 hover:text-white py-2 px-4 border border-secondary-500 hover:border-transparent rounded"
            mat-stroked-button
            (click)="goToBatch(batch)"
            routerLinkActive="bg-primary-100"
            >View Batch</a
          >
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchesTableComponent {
  readonly batches = input.required<BatchDto[]>();
  private readonly router = inject(Router);
  readonly displayedColumns: string[] = [
    'lotNumber',
    'leadContent',
    'mercuryContent',
    'cadmiumContent',
    'isRoHSCompliant',
    'quantity',
    'status',
    'subbatch-button',
  ];

  goToBatch(batch: BatchDto) {
    void this.router.navigate(['/batches', batch.lotNumber], {
      state: { fromBatches: true },
    });
  }
}
