import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PageLayoutComponent } from './page-layout.component';

@Component({
  selector: 'app-batch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    PageLayoutComponent,
  ],
  template: `
    <app-page-layout>
      <form class="flex flex-col" [formGroup]="batchForm" (ngSubmit)="onSubmit()">
        <!-- <div> -->
          <mat-form-field appearance="fill">
            <mat-label>Lot Number</mat-label>
            <input matInput formControlName="lotNumber" />
          </mat-form-field>
        <!-- </div>
        <div> -->
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
        <!-- </div> -->
        <div class="flex-col flex gap-8 items-center">
        <button mat-raised-button class="inline-block cursor-pointer select-none border text-center relative group/button px-6 py-3 text-base rounded-lg bg-blue-500 text-white shadow-lg border-primary-500 hover:bg-blue-600" type="submit">Submit</button>
        </div>
      </form>

    </app-page-layout>
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
    this.http.post('api/batches', newBatch).subscribe((batch) => {
      console.log('Updated batch:', batch);
    });

    this.router.navigate(['/batches']);

    console.log(this.batchForm.value);
  }
}
