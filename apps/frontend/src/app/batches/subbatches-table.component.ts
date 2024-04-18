import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BatchDto } from '../shared/models';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { BatchesService } from './batch.service';
import { Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-subbatches-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterLink],
  template: `
    <table mat-table [dataSource]="batches()">
      <!-- Lot Number Column -->
      <ng-container matColumnDef="parentLotNumber">
        <th mat-header-cell *matHeaderCellDef>Parent Lot Number</th>
        <td mat-cell *matCellDef="let batch">{{ batch?.parentLotNumber }}</td>
      </ng-container>

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
        <th mat-header-cell *matHeaderCellDef>owner</th>
        <td mat-cell *matCellDef="let batch">{{ batch?.company?.VAT }}</td>
      </ng-container>

      <!-- Subbatch Column -->
      <ng-container matColumnDef="assign-button">
        <th mat-header-cell *matHeaderCellDef>Assign</th>
        <td mat-cell *matCellDef="let batch">
          <a
            *ngIf="
              batch?.parentLotNumber && batch?.company?.VAT === company()?.VAT
            "
            class="text-inherit"
            mat-button
            routerLinkActive="bg-primary-100"
            (click)="setCurrentSubBatch(batch)"
            >Assign Batch</a
          >
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>

    <ng-container>
      <button
        mat-raised-button
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        (click)="goBack()"
      >
        Go Back
      </button></ng-container
    >
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubBatchesTableComponent implements OnDestroy, OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly batchesService = inject(BatchesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly currentSubBatch = this.batchesService.currentSubBatch;
  readonly batches = input.required<BatchDto[]>();
  readonly company = this.profileService.company;
  private currentRouteId: string | null = null;
  readonly displayedColumns: string[] = [
    'parentLotNumber',
    'lotNumber',
    'leadContent',
    'mercuryContent',
    'cadmiumContent',
    'isRoHSCompliant',
    'quantity',
    'status',
    'owner',
    'assign-button',
  ];
  fromBatches = false;

  private destroy$ = new Subject<void>();

  constructor(private location: Location) {}

  setCurrentSubBatch(batch: BatchDto) {
    this.currentSubBatch.set(batch);
    void this.router.navigate(
      ['/batches', this.currentRouteId, batch.lotNumber, 'assign'],
      {
        state: { fromSubBatches: true },
      }
    );
  }

  goBack(): void {
    this.fromBatches
      ? this.location.back()
      : void this.router.navigate(['/batches', this.currentSubBatch()?.id]);
  }

  ngOnInit() {
    this.fromBatches =
      this.router.lastSuccessfulNavigation?.extras?.state?.['fromBatches'];
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((params: ParamMap) => {
          this.currentRouteId = params.get('batchId');
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
