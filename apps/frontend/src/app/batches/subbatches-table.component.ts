import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
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
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-subbatches-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="text-2xl font-bold mb-4">Parent Batch</h2>
        <mat-card
          class="mb-10 rounded-md p-4 border border-gray-300 flex-col max-w-full"
        >
          <mat-card-header class="">
            <mat-card-title class=""
              >Lot number: {{ batch()?.lotNumber }}</mat-card-title
            >
            <mat-card-subtitle></mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="px-4 py-2">
            <ul
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-around"
            >
              <li class="mb-2">Lead content: {{ batch()?.leadContent }}</li>
              <li class="mb-2">
                Mercury content: {{ batch()?.mercuryContent }}
              </li>
              <li class="mb-2">
                Cadmium content: {{ batch()?.cadmiumContent }}
              </li>
              <li class="mb-2">
                RoHS compliant: {{ batch()?.isRoHSCompliant }}
              </li>
              <li class="mb-2">
                Quantity: {{ batch()?.quantity }} {{ batch()?.unit }}
              </li>
              <li class="mb-2">Status: {{ batch()?.status }}</li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>
      <div
        class="mb-10 rounded-md p-4 border border-gray-300 flex-col max-w-full"
      >
        <div class="flex justify-between">
          <h2>SubBatches</h2>
          <a
            class="text-inherit text-white"
            [disabled]="quantityRemaining() === 0"
            mat-raised-button
            color="primary"
            routerLinkActive="bg-primary-100"
            (click)="createSubbatch(batch()!)"
            >Create a new SubBatch</a
          >
        </div>
        <div
          class="block overflow-auto"
        >
          <table mat-table *ngIf="batches().length" [dataSource]="batches()">
            <!-- Lot Number Column -->
            <ng-container matColumnDef="parentLotNumber">
              <th mat-header-cell *matHeaderCellDef>Parent Lot Number</th>
              <td mat-cell *matCellDef="let batch">
                {{ batch?.parentLotNumber }}
              </td>
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
              <td mat-cell *matCellDef="let batch">
                {{ batch.mercuryContent }}
              </td>
            </ng-container>

            <!-- Cadmium Content Column -->
            <ng-container matColumnDef="cadmiumContent">
              <th mat-header-cell *matHeaderCellDef>Cadmium Content</th>
              <td mat-cell *matCellDef="let batch">
                {{ batch.cadmiumContent }}
              </td>
            </ng-container>

            <!-- RoHS Compliance Column -->
            <ng-container matColumnDef="isRoHSCompliant">
              <th mat-header-cell *matHeaderCellDef>RoHS Compliant</th>
              <td mat-cell *matCellDef="let batch">
                {{ batch.isRoHSCompliant }}
              </td>
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
              <td mat-cell *matCellDef="let batch">
                {{ batch?.company?.VAT }}
              </td>
            </ng-container>

            <!-- Action Column -->
            <ng-container matColumnDef="action-button">
              <th mat-header-cell *matHeaderCellDef>Action</th>
              <td mat-cell *matCellDef="let batch">
                <a
                  *ngIf="
                    batch?.parentLotNumber &&
                    batch?.company?.VAT === company()?.VAT && batch?.status !== 'declined'
                  "
                  class="text-inherit"
                  mat-stroked-button
                  routerLinkActive="bg-primary-100"
                  (click)="setCurrentSubBatch(batch)"
                >
                  Assign
                </a>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
          <p *ngIf="!batches().length">
            There are currently no SubBatches.
          </p>
        </div>
      </div>
    </div>

    <ng-container>
      <button mat-stroked-button (click)="goBack()">
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
  // parent batch
  readonly batch = this.batchesService.batch;
  // subbatches
  readonly batches = input.required<BatchDto[]>();
  readonly quantityRemaining = computed(() => {
    const batch = this.batch();
    if (!batch) return 0;
    const { quantity } = batch;
    const consumedQuantity = this.batches().reduce(
      (acc, batch) => acc + batch.quantity,
      0
    );
    return quantity - consumedQuantity;
  });
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
    'action-button',
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

  createSubbatch(batch: BatchDto) {
    this.currentSubBatch.set(batch);
    void this.router.navigate(['/batches', this.currentRouteId, 'create'], {
      state: { fromSubBatches: true },
    });
  }

  goBack(): void {
    this.fromBatches
      ? this.location.back()
      : void this.router.navigate([
          '/batches',
          this.currentSubBatch()?.lotNumber,
        ]);
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
