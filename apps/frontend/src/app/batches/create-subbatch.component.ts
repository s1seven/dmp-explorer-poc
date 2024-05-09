import { Component, OnInit, computed, inject } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BatchesService } from './batch.service';
import { CreateBatchDto } from '../shared/models';

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
      class="flex gap-4 mb-10 rounded-md p-4 border border-gray-300 flex-col max-w-3xl"
    >
      <!-- TODO: handle case where quantityRemaining is null? -->
      <h2>
        Create a SubBatch from
        <strong>{{ this.currentSubBatch()?.lotNumber }}</strong> -
        {{ this.quantityRemaining() }}
        {{ this.currentSubBatch()?.unit }} remaining.
      </h2>

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
export class CreateSubBatchComponent implements OnInit {
  private fromSubBatches = false;
  readonly batchesService = inject(BatchesService);
  readonly currentSubBatch = this.batchesService.currentSubBatch;
  private batch = this.batchesService.batch;
  readonly quantityRemaining = computed(() => {
    const totalQuantity = this.batch()?.quantity;
    const totalSubBatchesQuantity = this.batch()?.subBatches?.reduce(
      (acc, batch) => acc + batch.quantity,
      0
    );
    if (
      totalQuantity === null ||
      totalQuantity === undefined ||
      totalSubBatchesQuantity === null ||
      totalSubBatchesQuantity === undefined
    ) {
      return 0;
    }
    return totalQuantity - totalSubBatchesQuantity;
  });
  readonly batchForm = inject(NonNullableFormBuilder).group({
    parentLotNumber: new FormControl(''),
    lotNumber: new FormControl('', Validators.required),
    leadContent: new FormControl(0, Validators.required),
    mercuryContent: new FormControl(0, Validators.required),
    cadmiumContent: new FormControl(0, Validators.required),
    // TODO: validate that quantity is less than parent quantity in backend
    quantity: new FormControl(0, [
      Validators.required,
      this.quantityValidator(this.quantityRemaining()),
    ]),
    unit: new FormControl('', Validators.required),
  });

  constructor(private router: Router, private location: Location) {}

  async submit() {
    if (this.batchForm.invalid) {
      return;
    }

    const batchToCreate = this.batchForm.value;
    const newBatch = await this.batchesService.createBatch(
      batchToCreate as CreateBatchDto
    );

    // get updated parent batch, or do work on frontend?
    const currentBatch = this.batch();
    if (currentBatch && currentBatch.subBatches) {
      this.batch.set({
        ...currentBatch,
        subBatches: [...currentBatch.subBatches, newBatch],
      });
    }

    this.goBack();
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
        unit: this.currentSubBatch()?.unit,
      });
    }
  }

  quantityValidator(quantityRemaining: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = control.value > quantityRemaining;
      return forbidden ? { forbiddenQuantity: { value: control.value } } : null;
    };
  }
}
