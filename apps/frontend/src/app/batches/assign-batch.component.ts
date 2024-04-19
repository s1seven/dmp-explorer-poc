import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CreateCompanyComponent } from '../profile/create-company.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, map, takeUntil } from 'rxjs';
import { BatchesService } from './batch.service';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-assign-batch',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CreateCompanyComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <!-- TODO: ensure currentSubBatch and the route id match -->
    <div *ngIf="this.company()?.VAT === this.currentSubBatch()?.company?.VAT">
      >
      <form
        class="rounded-md p-4 border border-gray-300 flex flex-col max-w-3xl"
        [formGroup]="assignToCompanyForm"
        (ngSubmit)="assignToCompany()"
      >
        <p class="text-gray-700 mb-6 flex gap-2">
          <span
            ><mat-icon fontIcon="info" [inline]="true" class="inline"></mat-icon
          ></span>
          Enter the VAT number of the company you wish to assign batch:
          {{ this.batchId() }} to.
        </p>
        <mat-form-field>
          <mat-label>Company VAT</mat-label>
          <input matInput type="text" formControlName="companyVAT" />
        </mat-form-field>
        <div class="flex gap-3">
          <button mat-raised-button color="primary">Assign to Company</button>
          <button mat-raised-button (click)="goBack()" color="secondary">
            Go Back
          </button>
        </div>
      </form>
    </div>
    <div *ngIf="this.company()?.VAT !== this.currentSubBatch()?.company?.VAT">
      <p>
        Batch: {{ this.batchId() }} has been sent to
        {{ this.currentSubBatch()?.company?.VAT }}.
      </p>
      <button mat-raised-button color="primary" (click)="goBack()">
        Go Back
      </button>
    </div>
  `,
  styles: ``,
})
export class AssignBatchComponent implements OnDestroy, OnInit {
  readonly assignToCompanyForm = inject(NonNullableFormBuilder).group({
    companyVAT: ['' as string, Validators.required],
  });
  private readonly route = inject(ActivatedRoute);
  private readonly batchesService = inject(BatchesService);
  readonly company = inject(ProfileService).company;
  readonly currentSubBatch = this.batchesService.currentSubBatch;

  private destroy$ = new Subject<void>();
  batchId = signal<string>('');
  fromSubBatches = false;

  constructor(private location: Location, private router: Router) {}

  async assignToCompany() {
    if (this.assignToCompanyForm.invalid) {
      return;
    }
    const { companyVAT } = this.assignToCompanyForm.value;
    await this.batchesService.sendBatch(this.batchId(), companyVAT as string);
  }

  goBack(): void {
    this.fromSubBatches
      ? this.location.back()
      : void this.router.navigate(['/batches', this.currentSubBatch()?.lotNumber]);
  }

  ngOnInit() {
    this.fromSubBatches =
      this.router.lastSuccessfulNavigation?.extras?.state?.['fromSubBatches'];
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((params: ParamMap) => {
          this.batchId.set(params.get('subBatchId') || '');
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
