import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { BatchDto, Unit } from '../shared/models';
import { ProfileService } from '../profile/profile.service';

export enum BatchInboxType {
  RECLAIM = 'RECLAIM',
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
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

      <!-- RoHS Compliance Column -->
      <ng-container matColumnDef="isRoHSCompliant">
        <th mat-header-cell *matHeaderCellDef>RoHS Compliance</th>
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

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: ``,
})
export class BatchesComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly company = computed(
    () => this.profileService.companies()?.[0]
  );
  readonly batches = signal<BatchDto[]>([
    {
      lotNumber: '1234',
      leadContent: 0.1,
      mercuryContent: 0.2,
      cadmiumContent: 0.3,
      isRoHSCompliant: true,
      quantity: 10,
      unit: 'kg' as Unit,
      id: '',
      parentLotNumber: '',
      company: {
        VAT: '',
        name: '',
        id: '',
      },
    },
  ]);
  readonly inbox = computed<BatchInbox[]>(() => {
    const batches = this.batches();
    const myCompanyId = this.company()?.id;

    if (!batches) return [];
    return batches
    .filter(batch => batch.type !== )
    .map((batch) => 
      {
        
      }
      
      
      ({
      type: BatchInboxType.RECLAIM,
      batch,
    }));
  });

  batchesArray$: Observable<any[]> = of([]);
  displayedColumns: string[] = [
    'lotNumber',
    'leadContent',
    'mercuryContent',
    'cadmiumContent',
    'isRoHSCompliant',
    'quantity',
    'unit',
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // eslint-disable-next-line no-console
    console.log('Fetching batches');
    this.batchesArray$ = this.http.get<any[]>('api/batches');
  }
}
