import { Component, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, catchError, of, takeUntil, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-batch-form',
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
      <h2>Create Batch</h2>

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
          <mat-label>Upload JSON Certificate</mat-label>
          <input
            id="fileInput"
            type="file"
            (change)="onFileChange($event)"
            accept=".json"
            [multiple]="false"
          />
        </div>
        <div class="flex gap-3">
          <button mat-stroked-button (click)="goBack()">Cancel</button>
          <button mat-raised-button color="primary">Create Batch</button>
        </div>
      </form>
    </div>
  `,
})
export class CreateBatchComponent implements OnDestroy {
  // TODO: prefil content from parent lot
  readonly batchForm = new FormGroup({
    parentLotNumber: new FormControl(''),
    lotNumber: new FormControl('', Validators.required),
    leadContent: new FormControl('', Validators.required),
    mercuryContent: new FormControl('', Validators.required),
    cadmiumContent: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    unit: new FormControl('', Validators.required),
    json: new FormControl<File | null>(null),
  });
  private unsubscribe$ = new Subject<void>();
  constructor(private http: HttpClient, private router: Router) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.batchForm.patchValue({ json: file });
  }

  submit() {
    if (this.batchForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.entries(this.batchForm.value).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    this.http
      .post('api/batches', formData)
      .pipe(
        tap(() => this.router.navigate(['/batches'])),
        catchError((error) => {
          console.error(error);
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  goBack(): void {
    void this.router.navigate(['/batches']);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
