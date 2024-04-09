import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
    <form [formGroup]="batchForm" (ngSubmit)="onSubmit()">
      <div>
        <mat-form-field appearance="fill">
          <mat-label>Lot Number</mat-label>
          <input matInput formControlName="lotNumber" />
        </mat-form-field>
      </div>
      <div>
        <h2>
          Maximum Concentration Value (MCV) for heavy metals and flame
          retardants
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
      </div>
      <button mat-raised-button type="submit">Submit</button>
    </form>
  `,
  styles: [],
})
export class BatchFormComponent implements OnInit {
  batchForm!: FormGroup;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.batchForm = new FormGroup({
      lotNumber: new FormControl(''),
      leadContent: new FormControl(''),
      mercuryContent: new FormControl(''),
      cadmiumContent: new FormControl(''),
    });
  }

  onSubmit() {
    const newBatch = this.batchForm.value;
    this.http
      .post('http://localhost:3000/api/batches', newBatch)
      .subscribe((batch) => {
        console.log('Updated batch:', batch);
      });

    this.router.navigate(['/batches']);

    console.log(this.batchForm.value);
  }
}
