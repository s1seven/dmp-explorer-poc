import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { PageLayoutComponent } from './page-layout.component';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [CommonModule, MatTableModule, PageLayoutComponent],
  template: ` <app-page-layout>
    <table mat-table [dataSource]="batchesArray$">
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

      <!-- Cadmium Content Column -->
      <ng-container matColumnDef="isRoHSCompliant">
        <th mat-header-cell *matHeaderCellDef>RoHS Complient</th>
        <td mat-cell *matCellDef="let batch">{{ batch.isRoHSCompliant }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  </app-page-layout>`,
  styles: ``,
})
export class BatchesComponent implements OnInit {
  batchesArray$: Observable<any[]> = of([]);
  displayedColumns: string[] = [
    'lotNumber',
    'leadContent',
    'mercuryContent',
    'cadmiumContent',
    'isRoHSCompliant',
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // eslint-disable-next-line no-console
    console.log('Fetching batches');
    this.batchesArray$ = this.http.get<any[]>('api/batches');
  }
}
