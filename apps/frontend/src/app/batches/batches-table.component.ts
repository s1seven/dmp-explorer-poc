import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BatchDto } from '../shared/models';

@Component({
  selector: 'app-batches-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
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

      // TODO: combine quantity and unit
      <!-- Quantity Column -->
      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Quantity</th>
        <td mat-cell *matCellDef="let batch">{{ batch.quantity }}</td>
      </ng-container>

      <!-- Cadmium Content Column -->
      <ng-container matColumnDef="unit">
        <th mat-header-cell *matHeaderCellDef>Unit</th>
        <td mat-cell *matCellDef="let batch">{{ batch.unit }}</td>
      </ng-container>

      <!-- Status Column -->
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let batch">{{ batch.status }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchesTableComponent {
  batches = input.required<BatchDto[]>();

  displayedColumns: string[] = [
    'lotNumber',
    'leadContent',
    'mercuryContent',
    'cadmiumContent',
    'isRoHSCompliant',
    'quantity',
    'unit',
    'status',
  ];
}
