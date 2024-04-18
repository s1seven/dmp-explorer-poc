import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, catchError, of, takeUntil, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BatchesService } from './batch.service';

@Component({
  selector: 'app-subbatch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div
      class="flex gap-4 items-left mb-10 rounded-md p-4 border border-gray-300 flex-col max-w-3xl ng-untouched ng-pristine ng-invalid"
    >
      <h2>Create a SubBatch from{{ this.currentSubBatch()?.lotNumber }}</h2>

      <form
        class="flex flex-col max-w-3xl"
        [formGroup]="batchForm"
        (ngSubmit)="submit()"
      >
        <mat-form-field>
          <mat-label>Parent Lot Number</mat-label>
          <input formControlName="parentLotNumber" matInput />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Lot Number</mat-label>
          <input formControlName="lotNumber" matInput />
        </mat-form-field>

        <div class="rounded-md p-4 border border-gray-300 flex flex-col mb-4">
          <p class="text-gray-700 mb-6 flex gap-2">
            <span
              ><mat-icon
                fontIcon="info"
                [inline]="true"
                class="inline"
              ></mat-icon
            ></span>
            Maximum Concentration Value (MCV) for heavy metals and flame
            retardants
          </p>
          <mat-form-field>
            <mat-label>Lead Content</mat-label>
            <input matInput type="number" formControlName="leadContent" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Mercury Content</mat-label>
            <input matInput type="number" formControlName="mercuryContent" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Cadmium Content</mat-label>
            <input matInput type="number" formControlName="cadmiumContent" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Quantity</mat-label>
            <input matInput type="number" formControlName="quantity" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Unit</mat-label>
            <input matInput type="text" formControlName="unit" />
          </mat-form-field>
        </div>
        <div class="flex gap-3">
          <button mat-stroked-button (click)="goBack()">Cancel</button>
          <button mat-raised-button color="primary">Create Batch</button>
        </div>
      </form>
    </div>
  `,
})
export class CreateSubBatchComponent implements OnDestroy, OnInit {
  readonly batchForm = inject(NonNullableFormBuilder).group({
    parentLotNumber: new FormControl(''),
    lotNumber: new FormControl('', Validators.required),
    leadContent: new FormControl(0, Validators.required),
    mercuryContent: new FormControl(0, Validators.required),
    cadmiumContent: new FormControl(0, Validators.required),
    // TODO: validate that quantity is less than parent quantity
    quantity: new FormControl('', Validators.required),
    unit: new FormControl('', Validators.required),
  });
  private unsubscribe$ = new Subject<void>();
  private fromSubBatches = false;
  readonly batchesService = inject(BatchesService);
  readonly currentSubBatch = this.batchesService.currentSubBatch;

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {}

  submit() {
    if (this.batchForm.invalid) {
      return;
    }

    const newBatch = this.batchForm.value;
    this.http
      .post('api/batches', newBatch)
      .pipe(
        tap(() => this.router.navigate(['/batches'])),
        catchError((error) => {
          console.error(error);
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();

    //TODO: route back to parent lot, add new subbatch to subbatches
  }

  goBack(): void {
    this.fromSubBatches
      ? this.location.back()
      : void this.router.navigate([
          '/batches',
          this.currentSubBatch()?.lotNumber,
        ]);
  }

  ngOnInit() {
    this.fromSubBatches =
      this.router.lastSuccessfulNavigation?.extras?.state?.['fromSubBatches'];

    if (this.currentSubBatch()) {
      this.batchForm.patchValue({
        parentLotNumber: this.currentSubBatch()?.lotNumber,
        leadContent: this.currentSubBatch()?.leadContent,
        mercuryContent: this.currentSubBatch()?.mercuryContent,
        cadmiumContent: this.currentSubBatch()?.cadmiumContent,
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
