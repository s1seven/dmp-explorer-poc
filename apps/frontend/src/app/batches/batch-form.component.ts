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

@Component({
  selector: 'app-batch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <form class="flex flex-col" [formGroup]="batchForm" (ngSubmit)="submit()">
      <mat-form-field appearance="fill">
        <mat-label>Lot Number</mat-label>
        <input matInput formControlName="lotNumber" />
      </mat-form-field>
      <h2>
        Maximum Concentration Value (MCV) for heavy metals and flame retardants
      </h2>
      <mat-form-field appearance="fill">
        <mat-label>Lead Content</mat-label>
        <input matInput type="number" formControlName="leadContent" />
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Mercury Content</mat-label>
        <input matInput type="number" formControlName="mercuryContent" />
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Cadmium Content</mat-label>
        <input matInput type="number" formControlName="cadmiumContent" />
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Quantity</mat-label>
        <input matInput type="number" formControlName="quantity" />
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Unit</mat-label>
        <input matInput type="text" formControlName="unit" />
      </mat-form-field>
      <div class="flex-col flex gap-8 items-center">
        <button mat-raised-button type="submit">Submit</button>
      </div>
    </form>
  `,
  styles: [],
})
export class BatchFormComponent implements OnDestroy {
  readonly batchForm = new FormGroup({
    lotNumber: new FormControl('', Validators.required),
    leadContent: new FormControl('', Validators.required),
    mercuryContent: new FormControl('', Validators.required),
    cadmiumContent: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    unit: new FormControl('', Validators.required),
  });
  private unsubscribe$ = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) {}

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
          // TODO: send to sentry
          console.error(error);
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
